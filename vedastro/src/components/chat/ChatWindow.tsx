/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  CheckCheck,
  Loader2,
  MoreVertical,
  Paperclip,
  Search,
  Smile,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  Image as ImageIcon,
  FileText,
  UserRound,
  Phone,
  Video,
} from "lucide-react";

import { useSocket } from "../../hooks/useSocket";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import lib from "../../lib/axios";

import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export interface Message {
  _id?: string;
  text: string;
  sender: string | { _id: string };
  receiver?: string | { _id: string };
  conversation: string | { _id: string };
  createdAt?: string;
  updatedAt?: string;
  isSeen?: boolean;
  status?: "sending" | "sent" | "failed";
}

interface ChatWindowProps {
  roomId: string;
  receiverId: string;
  receiverName: string;
  isReceiverOnline?: boolean;
  receiverAvatar?: string;
}

const getId = (value: any): string => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return "";
};

const getConversationId = (message: Message): string => {
  return getId(message.conversation);
};

const formatTime = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDateLabel = (date?: string) => {
  if (!date) return "";

  const messageDate = new Date(date);

  if (Number.isNaN(messageDate.getTime())) {
    return "";
  }

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    messageDate.toDateString() ===
    today.toDateString()
  ) {
    return "TODAY";
  }

  if (
    messageDate.toDateString() ===
    yesterday.toDateString()
  ) {
    return "YESTERDAY";
  }

  return messageDate.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ChatWindow({
  roomId,
  receiverId,
  receiverName,
  isReceiverOnline = false,
  receiverAvatar = "",
}: ChatWindowProps) {
  const router = useRouter();
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

  const currentUserId = useMemo(
    () => getId(user?._id || user?.id),
    [user?._id, user?.id],
  );

  const normalizedRoomId = String(roomId || "");
  const normalizedReceiverId = String(receiverId || "");

  const messages: Message[] =
    messagesByRoom?.[normalizedRoomId] || [];

  const onlineStatus =
    onlineUsers?.[normalizedReceiverId] ??
    Boolean(isReceiverOnline);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [isTyping, setIsTyping] =
    useState(false);

  const [showMenu, setShowMenu] =
    useState(false);

  const [showAttachMenu, setShowAttachMenu] =
    useState(false);

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const [shouldAutoScroll, setShouldAutoScroll] =
    useState(true);

  /*
   * Scroll
   */
  const scrollToBottom = useCallback(
    (
      behavior: ScrollBehavior = "smooth",
    ) => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior,
          block: "end",
        });
      });
    },
    [],
  );

  const handleScroll = useCallback(() => {
    const container =
      messagesContainerRef.current;

    if (!container) return;

    const distance =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShouldAutoScroll(distance < 180);
  }, []);

  useEffect(() => {
    if (
      !loading &&
      shouldAutoScroll
    ) {
      scrollToBottom();
    }
  }, [
    messages.length,
    isTyping,
    loading,
    shouldAutoScroll,
    scrollToBottom,
  ]);

  const handleNewMessage = useCallback(
    (incomingMessage: Message) => {
      if (!incomingMessage) return;

      const incomingConversationId =
        getConversationId(
          incomingMessage,
        );

      if (
        String(incomingConversationId) !==
        String(normalizedRoomId)
      ) {
        return;
      }

      const senderId = getId(
        incomingMessage.sender,
      );

      const currentMessages =
        useChatStore.getState()
          .messagesByRoom?.[
        normalizedRoomId
        ] || [];

      if (
        incomingMessage._id &&
        currentMessages.some(
          (message) =>
            String(message._id) ===
            String(
              incomingMessage._id,
            ),
        )
      ) {
        return;
      }

      if (
        String(senderId) ===
        String(currentUserId)
      ) {
        const optimisticMessage =
          currentMessages.find(
            (message) =>
              String(
                message._id,
              ).startsWith("temp-") &&
              message.text ===
              incomingMessage.text,
          );

        if (optimisticMessage?._id) {
          replaceMessage(
            normalizedRoomId,
            String(
              optimisticMessage._id,
            ),
            {
              ...incomingMessage,
              status: "sent",
            },
          );

          return;
        }
      }

      addMessage(
        normalizedRoomId,
        {
          ...incomingMessage,
          status: "sent",
        },
      );

      setShouldAutoScroll(true);
    },
    [
      normalizedRoomId,
      currentUserId,
      addMessage,
      replaceMessage,
    ],
  );

  useEffect(() => {
    if (
      !socket ||
      !normalizedRoomId
    ) {
      return;
    }

    socket.emit(
      "conversation:join",
      normalizedRoomId,
    );

    return () => {
      socket.emit(
        "conversation:leave",
        normalizedRoomId,
      );
    };
  }, [
    socket,
    normalizedRoomId,
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "message:new",
      handleNewMessage,
    );

    const handleTypingStart = ({
      userId,
    }: {
      userId: string;
    }) => {
      if (
        String(userId) !==
        String(currentUserId)
      ) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = ({
      userId,
    }: {
      userId: string;
    }) => {
      if (
        String(userId) !==
        String(currentUserId)
      ) {
        setIsTyping(false);
      }
    };

    socket.on(
      "typing:start",
      handleTypingStart,
    );

    socket.on(
      "typing:stop",
      handleTypingStop,
    );

    return () => {
      socket.off(
        "message:new",
        handleNewMessage,
      );

      socket.off(
        "typing:start",
        handleTypingStart,
      );

      socket.off(
        "typing:stop",
        handleTypingStop,
      );
    };
  }, [
    socket,
    currentUserId,
    handleNewMessage,
  ]);

  useEffect(() => {
    if (
      !socket ||
      !normalizedReceiverId
    ) {
      return;
    }

    const handleUserOnline = ({
      userId,
    }: {
      userId: string;
    }) => {
      if (
        String(userId) ===
        String(normalizedReceiverId)
      ) {
        useChatStore
          .getState()
          .setUserOnline(
            normalizedReceiverId,
            true,
          );
      }
    };

    const handleUserOffline = ({
      userId,
    }: {
      userId: string;
    }) => {
      if (
        String(userId) ===
        String(normalizedReceiverId)
      ) {
        useChatStore
          .getState()
          .setUserOnline(
            normalizedReceiverId,
            false,
          );
      }
    };

    socket.on(
      "user:online",
      handleUserOnline,
    );

    socket.on(
      "user:offline",
      handleUserOffline,
    );

    return () => {
      socket.off(
        "user:online",
        handleUserOnline,
      );

      socket.off(
        "user:offline",
        handleUserOffline,
      );
    };
  }, [
    socket,
    normalizedReceiverId,
  ]);

  const loadMessages = useCallback(
    async () => {
      if (
        !normalizedRoomId ||
        !currentUserId
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await lib.get(
          `/chat/messages/${encodeURIComponent(
            normalizedRoomId
          )}`
        );

        const rawMessages =
          response?.data?.data;

        const serverMessages: Message[] =
          Array.isArray(rawMessages)
            ? rawMessages
            : [];

        setMessages(
          normalizedRoomId,
          serverMessages,
        );

        setShouldAutoScroll(true);

        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToBottom("auto");
          }, 50);
        });
      } catch (error: any) {
        console.error(
          "LOAD CHAT MESSAGES ERROR:",
          error?.response?.data ||
          error,
        );

        setError(
          error?.response?.data
            ?.message ||
          "Unable to load messages",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      normalizedRoomId,
      currentUserId,
      setMessages,
      scrollToBottom,
    ],
  );

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const stopTyping = useCallback(() => {
    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current,
      );

      typingTimeoutRef.current =
        null;
    }

    if (
      socket &&
      normalizedRoomId
    ) {
      socket.emit(
        "typing:stop",
        {
          conversationId:
            normalizedRoomId,
        },
      );
    }

    setIsTyping(false);
  }, [
    socket,
    normalizedRoomId,
  ]);

  const handleSendMessage = async (
    text: string,
  ) => {
    const cleanText = text.trim();

    if (
      !cleanText ||
      !currentUserId ||
      !normalizedReceiverId ||
      !normalizedRoomId
    ) {
      return;
    }

    const tempId =
      `temp-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    const optimisticMessage: Message = {
      _id: tempId,
      text: cleanText,
      sender: currentUserId,
      receiver:
        normalizedReceiverId,
      conversation:
        normalizedRoomId,
      createdAt:
        new Date().toISOString(),
      status: "sending",
    };

    addMessage(
      normalizedRoomId,
      optimisticMessage,
    );

    setShouldAutoScroll(true);

    stopTyping();

    requestAnimationFrame(() => {
      scrollToBottom();
    });

    try {
      const response =
        await lib.post(
          "/chat/send",
          {
            receiverId:
              normalizedReceiverId,
            text: cleanText,
          },
        );

      const savedMessage =
        response?.data?.data;

      if (!savedMessage?._id) {
        throw new Error(
          "Message was not saved",
        );
      }

      replaceMessage(
        normalizedRoomId,
        tempId,
        {
          ...savedMessage,
          status: "sent",
        },
      );
    } catch (error: any) {
      console.error(
        "SEND MESSAGE ERROR:",
        error?.response?.data ||
        error,
      );

      updateMessageStatus(
        normalizedRoomId,
        tempId,
        "failed",
      );
    }
  };

  const handleTypingBroadcast =
    useCallback(() => {
      if (
        !socket ||
        !currentUserId ||
        !normalizedRoomId
      ) {
        return;
      }

      socket.emit(
        "typing:start",
        {
          conversationId:
            normalizedRoomId,
        },
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current,
        );
      }

      typingTimeoutRef.current =
        setTimeout(() => {
          socket.emit(
            "typing:stop",
            {
              conversationId:
                normalizedRoomId,
            },
          );

          typingTimeoutRef.current =
            null;
        }, 2000);
    }, [
      socket,
      currentUserId,
      normalizedRoomId,
    ]);

  useEffect(() => {
    return () => {
      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current,
        );
      }
    };
  }, []);

  if (
    !normalizedRoomId ||
    !normalizedReceiverId
  ) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-[#f0f2f5]">
        <div className="rounded-lg bg-white px-6 py-4 text-sm text-[#667781] shadow-sm">
          Invalid conversation.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#efeae2]">

      <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#d1d7db] bg-[#f0f2f5] px-3 shadow-sm sm:px-4">

        {/* USER */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <button
            onClick={() => router.back()}
            className="flex shrink-0 items-center justify-center rounded-full p-2 text-[#54656f] transition hover:bg-[#d9dcdf]"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* AVATAR */}
          <div className="relative shrink-0">
            {receiverAvatar ? (
              <img
                src={receiverAvatar}
                alt={receiverName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfe5e7]">
                <UserRound className="h-5 w-5 text-[#667781]" />
              </div>
            )}

            {onlineStatus && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#f0f2f5] bg-[#00a884]" />
            )}
          </div>

          {/* NAME */}
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-medium text-[#111b21]">
              {receiverName || "User"}
            </h2>

            <p className="truncate text-xs text-[#667781]">
              {isTyping
                ? "typing..."
                : onlineStatus
                  ? "online"
                  : "offline"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center">
          {/* Icons removed as per request */}
        </div>
      </header>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundColor: "#efeae2",
          backgroundImage: `
            radial-gradient(
              rgba(84, 72, 63, 0.055) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "18px 18px",
        }}
      >

        {/* subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#efeae2]/20" />

        <div className="relative mx-auto min-h-full w-full max-w-275 px-3 py-4 sm:px-6 sm:py-5 lg:px-10">

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 px-6 py-5 shadow-md">
                <Loader2 className="h-6 w-6 animate-spin text-[#00a884]" />

                <p className="text-sm text-[#667781]">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : error ? (
            /* ERROR */
            <div className="flex min-h-full items-center justify-center">
              <div className="rounded-xl bg-white px-7 py-6 text-center shadow-lg">

                <p className="text-sm font-medium text-red-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    loadMessages
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00a884] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#008f72]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* EMPTY CHAT */
            <div className="flex min-h-full items-center justify-center">
            </div>
          ) : (
            <div className="space-y-1">

              {messages.map(
                (
                  message,
                  index,
                ) => {
                  const senderId =
                    getId(
                      message.sender,
                    );

                  const isMe =
                    String(
                      senderId,
                    ) ===
                    String(
                      currentUserId,
                    );

                  const previousMessage =
                    messages[
                    index - 1
                    ];

                  const currentDate =
                    getDateLabel(
                      message.createdAt,
                    );

                  const previousDate =
                    getDateLabel(
                      previousMessage?.createdAt,
                    );

                  const showDate =
                    currentDate !==
                    previousDate;

                  return (
                    <React.Fragment
                      key={
                        message._id ||
                        `${message.createdAt}-${index}`
                      }
                    >

                      {/* DATE */}
                      {showDate && (
                        <div className="flex justify-center py-4">
                          <span className="rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#54656f] shadow-sm">
                            {currentDate}
                          </span>
                        </div>
                      )}

                      {/* MESSAGE */}
                      <div
                        className={`flex w-full ${isMe
                          ? "justify-end"
                          : "justify-start"
                          }`}
                      >
                        <div
                          className={`
                            relative
                            max-w-[88%]
                            sm:max-w-[70%]
                            lg:max-w-[62%]
                            px-3
                            pb-1.5
                            pt-2
                            shadow-[0_1px_1px_rgba(0,0,0,0.13)]
                            ${isMe
                              ? "rounded-l-lg rounded-br-lg rounded-tr-none bg-[#d9fdd3]"
                              : "rounded-r-lg rounded-bl-lg rounded-tl-none bg-white"
                            }
                          `}
                        >

                          {/* TEXT */}
                          <div className="whitespace-pre-wrap wrap-break-word pr-2 text-[14px] leading-5 text-[#111b21]">
                            {message.text}
                          </div>

                          {/* TIME */}
                          <div className="mt-0.5 flex items-center justify-end gap-1">

                            <span className="text-[10px] leading-3 text-[#667781]">
                              {formatTime(
                                message.createdAt,
                              )}
                            </span>

                            {isMe && (
                              <>
                                {message.status ===
                                  "sending" ? (
                                  <span className="text-[11px] text-[#667781]">
                                    ◷
                                  </span>
                                ) : message.status ===
                                  "failed" ? (
                                  <span className="text-[10px] text-red-500">
                                    Failed
                                  </span>
                                ) : (
                                  <CheckCheck className={`h-3.5 w-3.5 ${message.isSeen ? "text-[#53bdeb]" : "text-[#8696a0]"}`} />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                },
              )}

              {/* TYPING */}
              {isTyping && (
                <div className="pt-1">
                  <TypingIndicator
                    receiverName={
                      receiverName ||
                      "User"
                    }
                  />
                </div>
              )}

              <div
                ref={messagesEndRef}
                className="h-px"
              />
            </div>
          )}
        </div>

        {/* SCROLL TO BOTTOM */}
        {!shouldAutoScroll &&
          messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShouldAutoScroll(
                  true,
                );

                scrollToBottom();
              }}
              className="absolute bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#d1d7db] bg-white text-[#54656f] shadow-lg transition hover:bg-[#f5f6f6]"
              aria-label="Scroll to latest"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
      </div>

      <footer className="relative z-30 shrink-0 border-t border-[#d1d7db] bg-[#f0f2f5] px-2 py-2 sm:px-3">

        {showAttachMenu && (
          <div className="absolute bottom-17 left-3 z-50 w-52 overflow-hidden rounded-xl bg-white py-2 shadow-2xl">

            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#111b21] hover:bg-[#f5f6f6]"
              onClick={() =>
                setShowAttachMenu(
                  false,
                )
              }
            >
              <ImageIcon className="h-5 w-5 text-[#7f66ff]" />
              Photos & videos
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#111b21] hover:bg-[#f5f6f6]"
              onClick={() =>
                setShowAttachMenu(
                  false,
                )
              }
            >
              <FileText className="h-5 w-5 text-[#515bd4]" />
              Document
            </button>
          </div>
        )}

        <div className="mx-auto flex w-full max-w-275 items-center gap-2">

          {/* EMOJI */}
          <button
            type="button"
            className="hidden shrink-0 rounded-full p-2 text-[#54656f] transition hover:bg-[#d9dcdf] sm:block"
            aria-label="Emoji"
          >
            <Smile className="h-6 w-6" />
          </button>

          {/* ATTACH */}
          <button
            type="button"
            onClick={() =>
              setShowAttachMenu(
                (prev) => !prev,
              )
            }
            className="shrink-0 rounded-full p-2 text-[#54656f] transition hover:bg-[#d9dcdf]"
            aria-label="Attach"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* INPUT */}
          <div className="min-w-0 flex-1">
            <ChatInput
              onSendMessage={
                handleSendMessage
              }
              onTyping={
                handleTypingBroadcast
              }
            />
          </div>
        </div>
      </footer>
    </div>
  );
}