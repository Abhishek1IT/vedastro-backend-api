"use client";

import OnlineStatus from "./OnlineStatus";

interface ChatHeaderProps {
  receiverName: string;
  isOnline: boolean;
}

export default function ChatHeader({
  receiverName,
  isOnline,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-[#23201C] bg-[#0E0C0A] px-5 py-4">
      {/* Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-bold text-black">
        {receiverName ? receiverName.charAt(0).toUpperCase() : "U"}
      </div>

      <div>
        <h2 className="font-semibold text-white">{receiverName || "User"}</h2>

        <div className="mt-1">
          <OnlineStatus isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
}
