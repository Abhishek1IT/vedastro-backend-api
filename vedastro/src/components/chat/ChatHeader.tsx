"use client";

import OnlineStatus from "./OnlineStatus";

interface ChatHeaderProps {
  receiverName: string;
  isOnline: boolean;
}

export default function ChatHeader({ receiverName, isOnline }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4">
      <div>
        <h3 className="text-sm font-bold text-white">{receiverName}</h3>
        <div className="mt-0.5">
          <OnlineStatus isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
}