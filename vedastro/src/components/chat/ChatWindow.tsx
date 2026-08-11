/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { useSocket } from "../../hooks/useSocket";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

import lib from "../../lib/axios";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export interface Message {
  _id?: string;
  text: string;
  sender: string | { _id: string };
  receiver?: string | { _id: string };
  conversation: string | { _id: string };
  createdAt?: string;
  status?: "sending" | "sent" | "failed";
}

interface ChatWindowProps {
  roomId: string;
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

  const user = useAuthStore((state) => state.user);

  const {
    messagesByRoom,
    setMessages,
    addMessage,
    replaceMessage,
    updateMessageStatus,
    onlineUsers,
  } = useChatStore();

  const messages: Message[] = messagesByRoom?.[roomId] || [];

  const currentUserId = user?._id || user?.id;

  const onlineStatus = onlineUsers[String(receiverId)] ?? isReceiverOnline;

  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping, scrollToBottom]);

  const handleNewMessage = useCallback(
    (message: Message) => {
      const conversationId =
        typeof message.conversation === "object"
          ? message.conversation._id
          : message.conversation;

      if (String(conversationId) !== String(roomId)) {
        return;
      }

      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      const currentMessages =
        useChatStore.getState().messagesByRoom[roomId] || [];

      if (
        message._id &&
        currentMessages.some((item) => String(item._id) === String(message._id))
      ) {
        return;
      }

      if (String(senderId) === String(currentUserId)) {
        const tempMessage = currentMessages.find(
          (item) =>
            String(item._id).startsWith("temp-") && item.text === message.text,
        );

        if (tempMessage) {
          replaceMessage(roomId, String(tempMessage._id), {
            ...message,
            status: "sent",
          });

          return;
        }
      }

      addMessage(roomId, {
        ...message,
        status: "sent",
      });
    },
    [roomId, currentUserId, addMessage, replaceMessage],
  );

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("conversation:join", roomId, (response: any) => {
      console.log("CONVERSATION JOIN:", response);
    });

    return () => {
      socket.emit("conversation:leave", roomId);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:new", handleNewMessage);

    const typingStart = ({ userId }: { userId: string }) => {
      if (String(userId) !== String(currentUserId)) {
        setIsTyping(true);
      }
    };

    const typingStop = ({ userId }: { userId: string }) => {
      if (String(userId) !== String(currentUserId)) {
        setIsTyping(false);
      }
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
    if (!socket || !receiverId) return;

    const handleUserOnline = ({ userId }: { userId: string }) => {
      if (String(userId) === String(receiverId)) {
        useChatStore.getState().setUserOnline(receiverId, true);
      }
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      if (String(userId) === String(receiverId)) {
        useChatStore.getState().setUserOnline(receiverId, false);
      }
    };

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [socket, receiverId]);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        setLoading(true);

        const res = await lib.get(`/chat/messages/${roomId}`);

        if (cancelled) return;

        const serverMessages: Message[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setMessages(roomId, serverMessages);
      } catch (error) {
        if (!cancelled) {
          console.error("Load message error:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [roomId, setMessages]);

  /**
   * SEND MESSAGE
   */
  const handleSendMessage = async (text: string) => {
    const cleanText = text.trim();

    if (!cleanText || !currentUserId) {
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const tempMsg: Message = {
      _id: tempId,
      text: cleanText,
      sender: currentUserId,
      receiver: receiverId,
      conversation: roomId,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    addMessage(roomId, tempMsg);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket?.emit("typing:stop", {
      conversationId: roomId,
    });

    try {
      const res = await lib.post("/chat/send", {
        receiverId,
        text: cleanText,
      });

      const savedMessage = res.data?.data;

      if (!savedMessage) {
        throw new Error("Message not returned from server");
      }

      replaceMessage(roomId, tempId, {
        ...savedMessage,
        status: "sent",
      });
    } catch (error) {
      console.error("Send message error:", error);

      updateMessageStatus(roomId, tempId, "failed");
    }
  };

  /**
   * TYPING
   */
  const handleTypingBroadcast = () => {
    if (!socket || !currentUserId || !roomId) {
      return;
    }

    socket.emit("typing:start", {
      conversationId: roomId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", {
        conversationId: roomId,
      });
    }, 2000);
  };

  /**
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}
      <ChatHeader receiverName={receiverName} isOnline={onlineStatus} />

      {/* MESSAGES */}
      <div className="relative flex-1 space-y-3 overflow-y-auto bg-[#0E0C0A] p-4 scrollbar-none">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            Syncing conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-xs text-gray-500">
            Start a conversation
          </div>
        ) : (
          messages.map((message: Message, index: number) => {
            const senderId =
              typeof message.sender === "object"
                ? message.sender._id
                : message.sender;

            const isMe = String(senderId) === String(currentUserId);

            return (
              <MessageBubble
                key={message._id || `${message.createdAt}-${index}`}
                text={message.text}
                timestamp={
                  message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], {
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

      {/* INPUT */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTypingBroadcast}
      />
    </div>
  );
}
