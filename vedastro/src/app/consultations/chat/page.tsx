/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

import { useAuthStore } from "../../../store/authStore";
import ChatWindow from "../../../components/chat/ChatWindow";
import ChatSidebar from "../../../components/chat/ChatSidebar";
import lib from "../../../lib/axios";

interface SelectedChatState {
  roomId: string;
  receiverId: string;
  receiverName: string;
  isOnline: boolean;
}

export default function ConsultationsChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrated = useAuthStore(
    (state) => state.isHydrated
  );
  const openLoginModal = useAuthStore(
    (state) => state.openLoginModal
  );

  const astrologerId =
  searchParams.get("astrologerId");

const userId =
  searchParams.get("userId");

const conversationId =
  searchParams.get("conversationId");

  const [selectedChat, setSelectedChat] =
    useState<SelectedChatState>({
      roomId: "",
      receiverId: "",
      receiverName: "",
      isOnline: false,
    });

  const [loadingRooms, setLoadingRooms] =
    useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }
  }, [
    isHydrated,
    isAuthenticated,
    user,
    router,
    searchParams,
    openLoginModal,
  ]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user?._id) {
      return;
    }

    if (!astrologerId && !userId && !conversationId) {
      setLoadingRooms(false);
      return;
    }

    const controller = new AbortController();

    const openChat = async () => {
      try {
        setLoadingRooms(true);

        if (conversationId) {
          try {
            const response = await lib.get(
              `/chat/conversations/${conversationId}`,
              {
                signal: controller.signal,
              }
            );

            const conversation =
              response?.data?.data;

            const participants =
              conversation?.participants || [];

            const otherUser = Array.isArray(
              participants
            )
              ? participants.find(
                (participant: any) => {
                  const participantId =
                    typeof participant === "object"
                      ? participant?._id ||
                      participant?.id
                      : participant;

                  return (
                    String(participantId) !==
                    String(user._id)
                  );
                }
              )
              : null;

            const actualReceiverId =
              otherUser?._id ||
              otherUser?.id ||
              userId;

            const actualReceiverName =
              otherUser?.name ||
              otherUser?.fullName ||
              (otherUser?.role === "ASTROLOGER"
                ? "Astrologer"
                : "User");

            const actualOnlineStatus =
              Boolean(otherUser?.isOnline);

            if (!actualReceiverId) {
              console.error(
                "Receiver ID not found"
              );

              setSelectedChat({
                roomId: "",
                receiverId: "",
                receiverName: "",
                isOnline: false,
              });

              return;
            }

            setSelectedChat({
              roomId: String(conversationId),
              receiverId: String(
                actualReceiverId
              ),
              receiverName:
                actualReceiverName,
              isOnline: actualOnlineStatus,
            });

            return;
          } catch (error: any) {
            if (
              error?.name ===
              "CanceledError" ||
              error?.code === "ERR_CANCELED"
            ) {
              return;
            }

            console.error(
              "GET CONVERSATION ERROR:",
              error?.response?.data || error
            );

            return;
          }
        }

        const receiverId =
          astrologerId || userId;

        if (!receiverId) {
          setLoadingRooms(false);
          return;
        }

        const response = await lib.post(
          "/chat/conversations",
          {
            receiverId: String(receiverId),
          },
          {
            signal: controller.signal,
          }
        );

        const conversation =
          response?.data?.data;

        if (!conversation?._id) {
          console.error(
            "Conversation not found:",
            response?.data
          );

          setSelectedChat({
            roomId: "",
            receiverId: "",
            receiverName: "",
            isOnline: false,
          });

          return;
        }

        const participants =
          conversation?.participants || [];

        const otherUser = Array.isArray(
          participants
        )
          ? participants.find(
            (participant: any) => {
              const participantId =
                typeof participant ===
                  "object"
                  ? participant?._id ||
                  participant?.id
                  : participant;

              return (
                String(participantId) !==
                String(user._id)
              );
            }
          )
          : null;

        const actualReceiverId =
          otherUser?._id ||
          otherUser?.id ||
          receiverId;

        const actualReceiverName =
          otherUser?.name ||
          otherUser?.fullName ||
          (otherUser?.role === "ASTROLOGER"
            ? "Astrologer"
            : astrologerId
              ? "Astrologer"
              : "User");

        const actualOnlineStatus =
          Boolean(otherUser?.isOnline);

        setSelectedChat({
          roomId: String(
            conversation._id
          ),
          receiverId: String(
            actualReceiverId
          ),
          receiverName:
            actualReceiverName,
          isOnline: actualOnlineStatus,
        });
      } catch (error: any) {
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "ERROR OPENING CHAT:",
          error?.response?.data || error
        );

        setSelectedChat({
          roomId: "",
          receiverId: "",
          receiverName: "",
          isOnline: false,
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRooms(false);
        }
      }
    };

    openChat();

    return () => {
      controller.abort();
    };
  }, [
    isHydrated,
    isAuthenticated,
    user?._id,
    user?.profileCompleted,
    astrologerId,
    userId,
    conversationId,
  ]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0907] text-gray-400">
        Connecting securely...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#0B0907] text-gray-200 pt-16">
      {/* FULL SCREEN CHAT LAYOUT */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="hidden md:flex w-80 shrink-0 border-r border-[#23201C]">
          <ChatSidebar 
            activeRoomId={selectedChat.roomId || selectedChat.receiverId}
            selectedAstroId={astrologerId || undefined}
            onSelectRoom={(id, metadata) => {
              if (metadata?.conversationId) {
                router.push(`/consultations/chat?conversationId=${metadata.conversationId}`);
              } else {
                router.push(`/consultations/chat?astrologerId=${id}`);
              }
            }}
          />
        </div>

        {/* MAIN CHAT WINDOW */}
        <div className="relative flex flex-1 flex-col bg-[#0B0907]">
          {selectedChat.roomId ? (
            <ChatWindow
              roomId={selectedChat.roomId}
              receiverId={selectedChat.receiverId}
              receiverName={selectedChat.receiverName}
              isReceiverOnline={selectedChat.isOnline}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 bg-[#0B0907] p-6 text-center text-gray-500">
              <div className="rounded-full border border-[#23201C] bg-[#14110E] p-5 shadow-inner">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>

              <div className="max-w-sm space-y-2">
                <h2 className="text-xl font-light text-gray-200">
                  {loadingRooms ? "Opening chat..." : "Select a conversation"}
                </h2>

                <p className="text-sm leading-relaxed text-gray-500">
                  {loadingRooms
                    ? "Connecting you with the selected user..."
                    : "Choose a conversation from the sidebar to start chatting."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}