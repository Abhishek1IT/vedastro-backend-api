export const formatTime = {
  to12Hour: (timeString: string): string => {
    if (!timeString) return "";
    const source = timeString.includes("T") ? timeString : `1970-01-01T${timeString}`;
    const d = new Date(source);
    if (isNaN(d.getTime())) return timeString;

    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  },

  toDuration: (totalSeconds: number): string => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
};