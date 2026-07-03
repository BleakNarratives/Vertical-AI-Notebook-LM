'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AGENTS,
  estimateDurationMs,
  type AgentId,
  type DeepDive,
} from "@/lib/deep-dive";

export type PlaybackStatus = "idle" | "playing" | "paused";

export function useDeepDivePlayback(deepDive: DeepDive | null) {
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);

  const segments = deepDive?.segments ?? [];
  const currentSegment = segments[currentIndex] ?? null;
  const activeSpeaker: AgentId | null =
    status === "playing" && currentSegment ? currentSegment.speaker : null;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef(0);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const supportsTTS =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices (async in most browsers).
  useEffect(() => {
    if (!supportsTTS) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, [supportsTTS]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelSpeech = useCallback(() => {
    if (supportsTTS) window.speechSynthesis.cancel();
  }, [supportsTTS]);

  // Reset when the deep dive changes.
  useEffect(() => {
    tokenRef.current++;
    clearTimer();
    cancelSpeech();
    setStatus("idle");
    setCurrentIndex(0);
  }, [deepDive, cancelSpeech]);

  useEffect(() => {
    return () => {
      clearTimer();
      cancelSpeech();
    };
  }, [cancelSpeech]);

  const pickVoice = (agentId: AgentId): SpeechSynthesisVoice | undefined => {
    const voices = voicesRef.current.filter((v) => v.lang.startsWith("en"));
    if (voices.length === 0) return undefined;
    const order: AgentId[] = ["higgins", "pytch", "twoie", "zeroclaw"];
    const idx = order.indexOf(agentId);
    return voices[idx % voices.length];
  };

  // Plays segment `index`, advancing when it finishes.
  const playFrom = useCallback(
    (index: number) => {
      if (!deepDive) return;
      const seg = deepDive.segments[index];
      if (!seg) {
        setStatus("idle");
        return;
      }

      const myToken = ++tokenRef.current;
      clearTimer();
      cancelSpeech();
      setCurrentIndex(index);
      setStatus("playing");

      const advance = () => {
        if (myToken !== tokenRef.current) return;
        if (index + 1 < deepDive.segments.length) {
          playFrom(index + 1);
        } else {
          setStatus("idle");
        }
      };

      if (supportsTTS && !mutedRef.current) {
        const utter = new SpeechSynthesisUtterance(seg.text);
        const agent = AGENTS[seg.speaker];
        utter.pitch = agent.voice.pitch;
        utter.rate = agent.voice.rate;
        const voice = pickVoice(seg.speaker);
        if (voice) utter.voice = voice;
        utter.onend = () => {
          if (myToken !== tokenRef.current) return;
          advance();
        };
        // Safety net in case onend never fires.
        timerRef.current = setTimeout(
          advance,
          estimateDurationMs(seg.text) + 6000,
        );
        window.speechSynthesis.speak(utter);
      } else {
        timerRef.current = setTimeout(advance, estimateDurationMs(seg.text));
      }
    },
    [deepDive, supportsTTS, cancelSpeech],
  );

  const play = useCallback(() => {
    if (!deepDive || deepDive.segments.length === 0) return;
    playFrom(currentIndex);
  }, [deepDive, currentIndex, playFrom]);

  const pause = useCallback(() => {
    tokenRef.current++;
    clearTimer();
    cancelSpeech();
    setStatus("paused");
  }, [cancelSpeech]);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, play, pause]);

  const goTo = useCallback(
    (index: number) => {
      if (!deepDive) return;
      const clamped = Math.max(
        0,
        Math.min(index, deepDive.segments.length - 1),
      );
      if (status === "playing") {
        playFrom(clamped);
      } else {
        tokenRef.current++;
        clearTimer();
        cancelSpeech();
        setCurrentIndex(clamped);
      }
    },
    [deepDive, status, playFrom, cancelSpeech],
  );

  const next = useCallback(
    () => goTo(currentIndex + 1),
    [goTo, currentIndex],
  );
  const prev = useCallback(
    () => goTo(currentIndex - 1),
    [goTo, currentIndex],
  );

  const restart = useCallback(() => {
    goTo(0);
  }, [goTo]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const nextMuted = !m;
      // If we turn sound on/off mid-playback, restart current line cleanly.
      if (status === "playing") {
        cancelSpeech();
      }
      return nextMuted;
    });
  }, [status, cancelSpeech]);

  return {
    status,
    currentIndex,
    currentSegment,
    activeSpeaker,
    muted,
    supportsTTS,
    controls: {
      play,
      pause,
      toggle,
      next,
      prev,
      goTo,
      restart,
      toggleMute,
    },
  };
}
