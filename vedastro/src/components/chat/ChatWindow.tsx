/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../../hooks/useSocket";
import { useAuthStore } from "../../store/authStore";
import lib from "../../lib/axios";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import { useChatStore } from "../../store/chatStore";

export interface Message {
  _id?: string;
  text: string;
  sender: string | { _id: string };
  conversation: string | { _id: string };
  createdAt?: string;
  status?: "sending" | "sent" | "failed";
}

interface ChatWindowProps {
  roomId: string; // conversationId
  receiverId: string;
  receiverName: string;
  isReceiverOnline: boolean;
}

export default function ChatWindow({
  roomId,
  receiverId,
  receiverName,
  isReceiverOnline,
}: ChatWindowProps) {
  const { socket } = useSocket();
  const { user } = useAuthStore() as { user: any };

  const { messagesByRoom, setMessages, addMessage, onlineUsers } =
    useChatStore() as any;

  const messages: Message[] = messagesByRoom?.[roomId] || [];
  const currentUserId = user?._id || user?.id;
  const onlineStatus = onlineUsers?.[receiverId] ?? isReceiverOnline;

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewMessage = useCallback(
    (message: Message) => {
      const conversationId =
        typeof message.conversation === "object"
          ? message.conversation._id
          : message.conversation;

      if (String(conversationId) === String(roomId)) {
        addMessage(roomId, { ...message, status: "sent" });
      }
    },
    [roomId, addMessage],
  );

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("conversation:join", roomId);

    return () => {
      socket.emit("conversation:leave", roomId);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:new", handleNewMessage);

    const typingStart = ({ userId }: { userId: string }) => {
      if (String(userId) !== String(currentUserId)) setIsTyping(true);
    };

    const typingStop = ({ userId }: { userId: string }) => {
      if (String(userId) !== String(currentUserId)) setIsTyping(false);
    };

    socket.on("typing:start", typingStart);
    socket.on("typing:stop", typingStop);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("typing:start", typingStart);
      socket.off("typing:stop", typingStop);
    };
  }, [socket, currentUserId, handleNewMessage]);

  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await lib.get(`/chat/messages/${roomId}`);
        if (isMounted) {
          setMessages(roomId, res.data?.data || []);
        }
      } catch (err) {
        console.error("Load message error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [roomId, setMessages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUserId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      _id: tempId,
      text: text.trim(),
      sender: currentUserId,
      conversation: roomId,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    addMessage(roomId, tempMsg);

    // Typing Stop
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket?.emit("typing:stop", {
      conversationId: roomId,
      userId: currentUserId,
    });

    try {
      const res = await lib.post("/chat/send", {
        receiverId,
        text: text.trim(),
      });

      const savedMessage = res.data?.data;
      if (savedMessage) {
        setMessages(
          roomId,
          (messagesByRoom[roomId] || []).map((m: Message) =>
            m._id === tempId ? { ...savedMessage, status: "sent" } : m,
          ),
        );
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  const handleTypingBroadcast = () => {
    if (!socket || !currentUserId) return;

    socket.emit("typing:start", {
      conversationId: roomId,
      userId: currentUserId,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", {
        conversationId: roomId,
        userId: currentUserId,
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full w-full flex-1 bg-[#0B0907] relative overflow-hidden">
      {/* 1. WHATSAPP STYLE CHAT HEADER */}
      <ChatHeader receiverName={receiverName} isOnline={onlineStatus} />

      {/* 2. MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0E0C0A] scrollbar-none relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-xs animate-pulse">
            Syncing conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-xs gap-2">
            <span className="px-3 py-1 rounded-md bg-[#1A1612] border border-[#23201C] text-amber-500/80">
              🔒 Messages are end-to-end encrypted
            </span>
          </div>
        ) : (
          messages.map((msg: Message, index: number) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            const isMe = String(senderId) === String(currentUserId);

            return (
              <MessageBubble
                key={msg._id || index}
                text={msg.text}
                timestamp={
                  msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                isMe={isMe}
              />
            );
          })
        )}

        {isTyping && <TypingIndicator receiverName={receiverName} />}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT BAR AREA */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTypingBroadcast}
      />
    </div>
  );
}
