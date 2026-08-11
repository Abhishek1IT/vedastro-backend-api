interface OnlineStatusProps {
  isOnline: boolean;
}

export default function OnlineStatus({ isOnline }: OnlineStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-500"
        }`}
      />

      <span className={isOnline ? "text-green-400" : "text-gray-500"}>
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}
