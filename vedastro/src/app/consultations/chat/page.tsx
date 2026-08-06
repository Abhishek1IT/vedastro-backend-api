/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Lock } from "lucide-react";

import { useAuthStore } from "../../../store/authStore";
import ChatSidebar from "../../../components/chat/ChatSidebar";
import ChatWindow from "../../../components/chat/ChatWindow";
import lib from "../../../lib/axios";

interface SelectedChatState {
  roomId: string;
  receiverId: string;
  receiverName: string;
  isOnline: boolean;
}

export default function ConsultationsChatPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  const isHydrated = useAuthStore((state: any) => state.isHydrated ?? true);

  const [selectedChat, setSelectedChat] = useState<SelectedChatState>({
    roomId: "",
    receiverId: "",
    receiverName: "",
    isOnline: false,
  });

  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(
        `/complete-profile?redirect=${encodeURIComponent("/chat")}`,
      );
    }
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const controller = new AbortController();

    const fetchInitialChatRooms = async () => {
      try {
        setLoadingRooms(true);
        const isUser = user.role === "USER";
        const endpoint = isUser ? "/user/astrologers" : "/chat/conversations";

        const response = await lib.get(endpoint, {
          signal: controller.signal,
        });

        const roomsData =
          response.data?.data ||
          response.data?.conversations ||
          response.data ||
          [];

        if (Array.isArray(roomsData) && roomsData.length > 0) {
          const firstRoom = roomsData[0];

          if (isUser) {
            const astroId = firstRoom._id || firstRoom.id;
            setSelectedChat({
              roomId: astroId,
              receiverId: astroId,
              receiverName: firstRoom.name || "Astrologer Expert",
              isOnline: firstRoom.isOnline || false,
            });
          } else {
            const otherUser = firstRoom.participants?.find(
              (p: any) =>
                (p._id || p.id || p)?.toString() !== user._id?.toString(),
            );

            const conversationId = firstRoom._id || firstRoom.id;
            const clientId = otherUser?._id || otherUser?.id || otherUser;

            setSelectedChat({
              roomId: conversationId,
              receiverId: String(clientId || ""),
              receiverName: otherUser?.name || "Client User",
              isOnline: otherUser?.isOnline || false,
            });
          }
        }
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching initial chat rooms:", error);
        }
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchInitialChatRooms();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated, user?._id, user?.role]);

  const handleRoomSelect = useCallback(
    (
      roomId: string,
      metadata?: {
        name: string;
        isOnline: boolean;
        conversationId?: string;
      },
    ) => {
      const conversationId = metadata?.conversationId || roomId;

      setSelectedChat({
        roomId: conversationId,
        receiverId: roomId,
        receiverName: metadata?.name || "Chat Partner",
        isOnline: metadata?.isOnline || false,
      });
    },
    [],
  );

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0907] text-gray-400">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <p className="text-sm font-medium animate-pulse">
            Connecting securely...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0907] flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      <div className="w-full max-w-7xl mb-3 flex items-center justify-between px-2">
        <Link
          href="/consultations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Consultations</span>
        </Link>
      </div>

      {/* Main WhatsApp-Style Container */}
      <div className="flex h-[85vh] w-full max-w-7xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-[#23201C] bg-[#0E0C0A] text-gray-200 shadow-2xl flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:min-w-[320px] lg:min-w-87.5 border-b md:border-b-0 md:border-r border-[#23201C] bg-[#14110E] flex flex-col h-[40vh] md:h-full">
          <ChatSidebar
            activeRoomId={selectedChat.roomId}
            onSelectRoom={handleRoomSelect}
          />
        </div>

        <div className="flex-1 flex flex-col bg-[#0B0907] relative h-[45vh] md:h-full">
          {selectedChat.roomId ? (
            <ChatWindow
              roomId={selectedChat.roomId}
              receiverId={selectedChat.receiverId}
              receiverName={selectedChat.receiverName}
              isReceiverOnline={selectedChat.isOnline}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 space-y-4 bg-[#0B0907] border-b-[6px] border-amber-600">
              <div className="p-5 rounded-full bg-[#14110E] border border-[#23201C] shadow-inner">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <div className="max-w-sm space-y-2">
                <h2 className="text-xl font-light text-gray-200">
                  {loadingRooms ? "Syncing messages..." : "VedAstro Web"}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Send and receive messages without keeping your phone online.
                  Select a consultation from the left to begin.
                </p>
              </div>
              <div className="absolute bottom-10 flex items-center gap-1.5 text-xs text-gray-600">
                <Lock className="w-3 h-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
