'use client';

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AudioLines,
  Circle,
  LayoutGrid,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  AGENTS,
  SAMPLE_DEEP_DIVE,
  type DeepDive,
} from "@/lib/deep-dive";
import type { AgentMode } from "./BoardroomCanvas";
import { InfographicPanel } from "./InfographicPanel";
import { useDeepDivePlayback } from "./useDeepDivePlayback";

const BoardroomCanvas = dynamic(() => import("./BoardroomCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        <Loader2 className="h-6 w-6 animate-spin text-neon-red" />
        Booting boardroom
      </div>
    </div>
  ),
});

const MODES: { id: AgentMode; label: string; Icon: typeof Circle }[] = [
  { id: "orbs", label: "Orbs", Icon: Circle },
  { id: "nameplates", label: "Seats", Icon: LayoutGrid },
  { id: "audio", label: "Audio", Icon: AudioLines },
];

const SUGGESTIONS = [
  "Will small language models eat the frontier?",
  "The hidden economics of open source",
  "Is prompt engineering a real discipline?",
  "How agents will reshape SaaS pricing",
];

export function DeepDiveStudio() {
  const [deepDive, setDeepDive] = useState<DeepDive | null>(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AgentMode>("orbs");
  const [showTranscript, setShowTranscript] = useState(false);

  const { status, currentIndex, currentSegment, activeSpeaker, muted, controls } =
    useDeepDivePlayback(deepDive);

  const isPlaying = status === "playing";
  const total = deepDive?.segments.length ?? 0;

  async function generate(input: string) {
    const value = input.trim();
    if (!value || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deep-dive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Generation failed");
      setDeepDive(data as DeepDive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const speaker = currentSegment ? AGENTS[currentSegment.speaker] : null;
  const accent = speaker?.color ?? "#ff2b2b";

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* 3D backdrop */}
      <div className="absolute inset-0">
        <BoardroomCanvas activeSpeaker={activeSpeaker} mode={mode} isPlaying={isPlaying} />
      </div>

      {/* Vignette for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,5,0.75)_100%)]" />

      {/* Mode toggle (always available) */}
      <div className="pointer-events-auto absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-grey-medium bg-obsidian/80 p-1 backdrop-blur">
        {MODES.map(({ id, label, Icon }) => {
          const activeMode = mode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={activeMode}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                activeMode
                  ? "bg-neon-red text-obsidian"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Title card */}
      {deepDive && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-xs">
          <div className="pointer-events-auto rounded-lg border border-grey-medium bg-obsidian/80 p-4 backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-red">
              Deep Dive
            </div>
            <h1 className="mt-1 text-balance text-lg font-bold leading-tight text-white">
              {deepDive.title}
            </h1>
            <p className="mt-2 text-pretty text-xs leading-relaxed text-white/50">
              {deepDive.summary}
            </p>
            <button
              type="button"
              onClick={() => {
                controls.pause();
                setDeepDive(null);
                setTopic("");
                setError(null);
              }}
              className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/40 underline-offset-4 hover:text-neon-cyan hover:underline"
            >
              New deep dive
            </button>
          </div>
        </div>
      )}

      {/* Infographic hologram */}
      {deepDive && (
        <div className="pointer-events-none absolute bottom-28 right-4 z-10 h-[46%] max-h-[420px] w-[min(92vw,360px)] md:top-20 md:bottom-auto md:h-[52%]">
          <div className="pointer-events-auto h-full">
            <InfographicPanel
              infographic={currentSegment?.infographic ?? null}
              accent={accent}
              speakerName={speaker?.name}
            />
          </div>
        </div>
      )}

      {/* Transcript drawer */}
      {deepDive && showTranscript && (
        <Transcript
          deepDive={deepDive}
          currentIndex={currentIndex}
          onSelect={(i) => controls.goTo(i)}
          onClose={() => setShowTranscript(false)}
        />
      )}

      {/* Player control bar */}
      {deepDive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4">
          <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-grey-medium bg-obsidian/85 p-3 backdrop-blur-md">
            {/* Progress ticks */}
            <div className="flex items-center gap-1">
              {deepDive.segments.map((seg, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                const c = AGENTS[seg.speaker].color;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => controls.goTo(i)}
                    aria-label={`Go to segment ${i + 1}`}
                    className="group h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
                  >
                    <span
                      className="block h-full rounded-full transition-all"
                      style={{
                        width: active ? "100%" : done ? "100%" : "0%",
                        background: active || done ? c : "transparent",
                        opacity: active ? 1 : done ? 0.5 : 1,
                        boxShadow: active ? `0 0 10px ${c}` : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {/* Speaker badge */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background: accent,
                    boxShadow: isPlaying ? `0 0 10px ${accent}` : "none",
                  }}
                />
                <div className="min-w-0">
                  <div
                    className="truncate font-mono text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: accent }}
                  >
                    {speaker?.name ?? "Standby"}
                  </div>
                  <div className="truncate text-[11px] text-white/50">
                    {currentSegment?.text ?? ""}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex shrink-0 items-center gap-1">
                <IconBtn label="Restart" onClick={controls.restart}>
                  <RotateCcw className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Previous" onClick={controls.prev} disabled={currentIndex === 0}>
                  <SkipBack className="h-4 w-4" />
                </IconBtn>
                <button
                  type="button"
                  onClick={controls.toggle}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-neon-red text-obsidian transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Play className="h-5 w-5" fill="currentColor" />
                  )}
                </button>
                <IconBtn
                  label="Next"
                  onClick={controls.next}
                  disabled={currentIndex >= total - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label={muted ? "Unmute narration" : "Mute narration"}
                  onClick={controls.toggleMute}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </IconBtn>
              </div>

              {/* Transcript + counter */}
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <span className="font-mono text-[11px] tabular-nums text-white/40">
                  {String(currentIndex + 1).padStart(2, "0")}/
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setShowTranscript((s) => !s)}
                  className="rounded border border-grey-medium px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:border-neon-cyan hover:text-neon-cyan"
                >
                  Transcript
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composer / hero */}
      {!deepDive && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-2xl border border-grey-medium bg-obsidian/85 p-6 backdrop-blur-md md:p-8">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neon-red">
              <Sparkles className="h-3.5 w-3.5" />
              Vertical AI Notebook LM
            </div>
            <h1 className="mt-3 text-balance text-2xl font-bold leading-tight text-white md:text-3xl">
              Turn any topic into a visual boardroom deep dive.
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-white/50">
              Four AI agents debate your subject out loud while synced infographics
              project over the table. Paste a topic or source text to begin.
            </p>

            <div className="mt-5">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (e.metaKey || e.ctrlKey) &&
                    !e.nativeEvent.isComposing &&
                    e.keyCode !== 229
                  ) {
                    generate(topic);
                  }
                }}
                rows={3}
                placeholder="e.g. The economics of self-improving AI systems..."
                className="w-full resize-none rounded-lg border border-grey-medium bg-obsidian/60 p-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red"
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTopic(s)}
                    className="rounded-full border border-grey-medium px-3 py-1 text-[11px] text-white/50 transition-colors hover:border-neon-cyan hover:text-neon-cyan"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-3 font-mono text-xs text-neon-red">{error}</p>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => generate(topic)}
                  disabled={loading || !topic.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-neon-red px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-obsidian transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Convening board
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate deep dive
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeepDive(SAMPLE_DEEP_DIVE)}
                  disabled={loading}
                  className="rounded-lg border border-grey-medium px-4 py-3 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-40"
                >
                  Play sample
                </button>
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
                Tip: press {"\u2318"}/Ctrl + Enter to generate. Narration uses your
                browser voice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Transcript({
  deepDive,
  currentIndex,
  onSelect,
  onClose,
}: {
  deepDive: DeepDive;
  currentIndex: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  return (
    <div className="pointer-events-auto absolute bottom-28 left-4 z-20 flex max-h-[50%] w-[min(92vw,340px)] flex-col rounded-xl border border-grey-medium bg-obsidian/90 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-grey-dark px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Transcript
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close transcript"
          className="text-white/50 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {deepDive.segments.map((seg, i) => {
          const agent = AGENTS[seg.speaker];
          const active = i === currentIndex;
          return (
            <button
              key={seg.id}
              ref={active ? activeRef : null}
              type="button"
              onClick={() => onSelect(i)}
              className={`mb-1 w-full rounded-lg p-2 text-left transition-colors ${
                active ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div
                className="font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: agent.color }}
              >
                {agent.name}
              </div>
              <div
                className={`text-xs leading-relaxed ${
                  active ? "text-white" : "text-white/50"
                }`}
              >
                {seg.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
