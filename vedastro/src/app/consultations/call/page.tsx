/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import AudioCall from "../../../components/call/AudioCall";
import VideoCall from "../../../components/call/VideoCall";
import OutgoingCall from "../../../components/call/OutgoingCall";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import api from "../../../lib/axios";
import Link from "next/link";

interface DbCallParticipant {
  id: string;
  name: string;
  role: "user" | "astrologer";
  avatarUrl?: string;
  isOnline: boolean;
}

function CallSessionConsole() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const authState = useAuthStore() as any;
  const isAuthenticated = authState?.isAuthenticated;

  const targetId = searchParams.get("astroId") || searchParams.get("userId");

  const [callSessionState, setCallSessionState] = useState<
    "ringing" | "connected" | "ended"
  >("ringing");
  const [callMediaType] = useState<"audio" | "video">("video");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [participant, setParticipant] = useState<DbCallParticipant | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const isHydrated = useAuthStore((state: any) => state.isHydrated ?? true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(
        `/complete-profile?redirect=${encodeURIComponent(
          `/consultations/call?astroId=${targetId}`,
        )}`,
      );
    }
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    const fetchParticipantDetails = async () => {
      try {
        setLoading(true);

        const response = await api.get("/user/astrologers");

        const astrologers = response.data?.data || [];

        const astro = astrologers.find((item: any) => item._id === targetId);

        if (!astro) {
          setParticipant(null);
          return;
        }

        setParticipant({
          id: astro._id,
          name: astro.name,
          role: "astrologer",
          avatarUrl: astro.avatar,
          isOnline: astro.isOnline,
        });
      } catch (error) {
        console.error(error);
        setParticipant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [targetId]);

  useEffect(() => {
    if (callSessionState === "ringing" && participant) {
      const connectionTimer = setTimeout(() => {
        setCallSessionState("connected");
      }, 3500);

      return () => clearTimeout(connectionTimer);
    }
  }, [callSessionState, participant]);

  useEffect(() => {
    if (callSessionState === "connected") {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video:
            callMediaType === "video" ? { width: 1280, height: 720 } : false,
        })
        .then((stream) => {
          activeStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) =>
          console.error(
            "WebRTC hardware channel authorization fault loop:",
            err,
          ),
        );
    }

    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callSessionState, callMediaType]);

  const handleEndCall = () => {
    setCallSessionState("ended");
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  if (!isAuthenticated) return null;
  if (loading)
    return <Loader fullscreen message="Initializing Secure DB Line..." />;

  if (!targetId) {
    return (
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex flex-col items-center justify-center p-4">
        <EmptyState
          icon="⚠️"
          title="Missing Link Identifier"
          description="No active participant ID query parameter detected in route structure parameters index."
          actionLabel="Return to Directory"
          onActionClick={() => router.push("/consultations")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex items-center justify-center p-6 antialiased select-none">
      <Link
        href="/consultations"
        className="inline-flex items-center text-[11px] font-bold text-amber-500 hover:text-amber-400 tracking-wide gap-1 w-full"
      >
        <span className="transform group-hover:translate-x-0.5 transition">
          ← Back
        </span>
      </Link>
      {callSessionState === "ringing" && (
        <OutgoingCall
          userName={participant?.name || "Loading..."}
          callType={callMediaType}
          onCancelCall={() => setCallSessionState("ended")}
        />
      )}

      {callSessionState === "connected" && callMediaType === "video" && (
        <VideoCall
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleCamera={() => setIsCameraOff(!isCameraOff)}
          onEndCall={handleEndCall}
        />
      )}

      {callSessionState === "connected" && callMediaType === "audio" && (
        <AudioCall
          userName={participant?.name || "Expert"}
          duration="00:00"
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onEndCall={handleEndCall}
        />
      )}

      {callSessionState === "ended" && (
        <Card
          hoverEffect={false}
          className="text-center p-6 md:p-8 border border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-900/40 backdrop-blur-md max-w-sm w-full shadow-2xl animate-in fade-in duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 text-xs font-bold">
            🛑
          </div>
          <h3 className="text-xs font-black text-white dark:text-white light:text-slate-900 uppercase tracking-wide">
            Call Terminated
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-400 mt-1 mb-6 font-medium">
            Session history successfully synchronized inside databases logs
            telemetry pipelines.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 rounded-xl text-[10px] uppercase font-black tracking-wider"
              onClick={() => router.push("/consultations")}
            >
              Back
            </Button>
            <Button
              variant="primary"
              className="flex-1 rounded-xl text-[10px] uppercase font-black tracking-wider"
              onClick={() => setCallSessionState("connected")}
            >
              Recall Node
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ConsultationsCallPage() {
  return (
    <Suspense
      fallback={
        <Loader fullscreen message="Mounting Communication Matrix..." />
      }
    >
      <CallSessionConsole />
    </Suspense>
  );
}
