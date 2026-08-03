/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Search, MoreVertical, SlidersHorizontal } from "lucide-react";
import lib from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

interface ChatSidebarProps {
  activeRoomId: string;
  onSelectRoom: (
    id: string,
    metadata?: { name: string; isOnline: boolean; conversationId?: string },
  ) => void;
}

export default function ChatSidebar({
  activeRoomId,
  onSelectRoom,
}: ChatSidebarProps) {
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "USER" | "ASTROLOGER">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuthStore() as any;
  const { onlineUsers } = useChatStore();
  const isUser = user?.role === "USER";
  const isAstrologer = user?.role === "ASTROLOGER";
  const isAdmin = user?.role === "ADMIN";

  const fetchUserSidebar = async () => {
    const res = await lib.get("/user/astrologers");
    const data = res.data?.data || [];
    setAstrologers(Array.isArray(data) ? data : []);
  };

  const fetchAstrologerSidebar = async () => {
    const currentUserId = user?._id || user?.id;
    const res = await lib.get("/chat/conversations");
    const conversations = res.data?.data || [];

    const parsedUsers = conversations
      .map((conv: any) => {
        const participants = conv.participants || [];
        const otherParticipant = participants.find(
          (p: any) => String(p._id || p.id) !== String(currentUserId),
        );

        if (!otherParticipant) return null;

        return {
          _id: otherParticipant._id,
          name: otherParticipant.name,
          isOnline: otherParticipant.isOnline,
          conversationId: conv._id,
          lastMessage: conv.lastMessage,
        };
      })
      .filter(Boolean);

    setAstrologers(parsedUsers);
  };

  const fetchAdminSidebar = async () => {
    const res = await lib.get("/admin/chat-users");
    const data = res.data?.data || [];
    setAstrologers(Array.isArray(data) ? data : []);
  };

  const fetchSidebar = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      if (isUser) {
        await fetchUserSidebar();
      } else if (isAstrologer) {
        await fetchAstrologerSidebar();
      } else if (isAdmin) {
        await fetchAdminSidebar();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSidebar();
  }, [user?._id, user?.role]);

  const filteredList = astrologers.filter((item: any) => {
    const matchesRole = isAdmin
      ? filter === "ALL" || item.role?.toUpperCase() === filter
      : true;
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full h-full bg-[#14110E] flex flex-col border-r border-[#23201C]">
      
      {/* 1. TOP HEADER BAR */}
      <div className="p-3.5 bg-[#1A1612] border-b border-[#23201C] flex justify-between items-center shrink-0">
        <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
          {isUser
            ? "Available Astrologers"
            : isAstrologer
              ? "Recent Consultations"
              : "Users & Astrologers"}{" "}
          <span className="text-xs text-amber-500 font-normal">
            ({filteredList.length})
          </span>
        </h2>
        <div className="flex items-center gap-2 text-gray-400">
          <MoreVertical size={18} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="p-3 border-b border-[#23201C] space-y-2 bg-[#14110E] shrink-0">
        <div className="flex items-center gap-2 bg-[#1A1612] px-3 py-2 rounded-xl border border-[#2B231D] focus-within:border-amber-600/60 transition-colors">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chat or user..."
            className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
          />
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-amber-500" />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "ALL" | "USER" | "ASTROLOGER")
              }
              className="w-full rounded-lg border border-[#2B231D] bg-[#1A1612] px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Users</option>
              <option value="ASTROLOGER">Astrologers</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#1A1612] scrollbar-none">
        {loading ? (
          <div className="p-4 text-center text-xs text-gray-500 animate-pulse">
            {isUser ? "Loading astrologers..." : "Loading conversations..."}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            {isUser
              ? "No astrologers found"
              : isAstrologer
                ? "No client messages yet"
                : "No users found"}
          </div>
        ) : (
          filteredList.map((item: any) => {
            const itemId = item._id || item.id;
            const isOnline = onlineUsers[itemId] ?? item.isOnline;
            const isActive =
              activeRoomId === itemId || activeRoomId === item.conversationId;

            return (
              <div
                key={item.conversationId || itemId}
                onClick={async () => {
                  try {
                    let conversationId = item.conversationId;

                    if (!conversationId) {
                      const res = await lib.post("/chat/conversations", {
                        receiverId: item._id,
                      });
                      conversationId = res.data.data._id;
                    }

                    onSelectRoom(item._id, {
                      name: item.name,
                      isOnline,
                      conversationId,
                    });
                  } catch (error) {
                    console.log("Conversation create error", error);
                  }
                }}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#251D16] border-l-4 border-amber-500"
                    : "hover:bg-[#1A1612]"
                }`}
              >
                {/* Avatar with Online Badge */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-linear-to-tr from-amber-600 to-orange-500 text-white font-semibold flex items-center justify-center text-sm shadow-md">
                    {item.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#14110E]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-xs font-semibold text-gray-100 truncate">
                      {item.name}
                    </h3>
                    {item.lastMessage?.createdAt && (
                      <span className="text-[10px] text-gray-500">
                        {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {item.lastMessage?.text ||
                      (isUser
                        ? item.specialization || "Online Astrologer"
                        : "Click to start chat")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}