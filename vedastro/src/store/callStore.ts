import { create } from "zustand";

interface CallState {
  callSessionState: "idle" | "ringing" | "connected" | "ended";
  callMediaType: "audio" | "video";
  targetParticipantId: string | null;
  isMuted: boolean;
  isCameraOff: boolean;
  initiateCall: (targetId: string, type: "audio" | "video") => void;
  setCallState: (sessionState: "idle" | "ringing" | "connected" | "ended") => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  resetCallStore: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  callSessionState: "idle",
  callMediaType: "video",
  targetParticipantId: null,
  isMuted: false,
  isCameraOff: false,

  initiateCall: (targetId, type) => set({ targetParticipantId: targetId, callMediaType: type, callSessionState: "ringing" }),
  setCallState: (sessionState) => set({ callSessionState: sessionState }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleCamera: () => set((state) => ({ isCameraOff: !state.isCameraOff })),
  resetCallStore: () => set({ callSessionState: "idle", targetParticipantId: null, isMuted: false, isCameraOff: false }),
}));