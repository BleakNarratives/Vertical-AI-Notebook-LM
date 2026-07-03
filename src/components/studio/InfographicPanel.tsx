'use client';

import type { Infographic } from "@/lib/deep-dive";

/**
 * The infographic hologram overlay. Rendered as crisp DOM above the 3D canvas so
 * the data reads instantly, styled to look like it is projected from the table.
 */
export function InfographicPanel({
  infographic,
  accent,
  speakerName,
}: {
  infographic: Infographic | null;
  accent: string;
  speakerName?: string;
}) {
  if (!infographic) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
          Awaiting projection
        </div>
        <div className="h-px w-24 bg-white/10" />
      </div>
    );
  }

  return (
    <div
      key={infographic.title}
      className="animate-rise relative flex h-full flex-col overflow-hidden rounded-lg border bg-obsidian/70 p-5 backdrop-blur-md"
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 40px ${accent}22, inset 0 0 30px ${accent}11`,
      }}
    >
      {/* Scanline sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div
          className="absolute inset-x-0 h-24 animate-scan"
          style={{
            background: `linear-gradient(to bottom, transparent, ${accent}18, transparent)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {infographic.type}
          </div>
          <h3 className="mt-1 text-balance text-lg font-bold leading-tight text-white">
            {infographic.title}
          </h3>
        </div>
        {speakerName && (
          <div className="shrink-0 rounded border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-white/50">
            {speakerName}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="relative flex-1 overflow-y-auto">
        {infographic.type === "bars" && <Bars items={infographic.items} accent={accent} />}
        {infographic.type === "stat" && <Stats items={infographic.items} accent={accent} />}
        {infographic.type === "timeline" && (
          <Timeline items={infographic.items} accent={accent} />
        )}
        {infographic.type === "comparison" && (
          <Comparison items={infographic.items} accent={accent} />
        )}
        {infographic.type === "quote" && <Quote items={infographic.items} accent={accent} />}
      </div>

      {infographic.caption && (
        <div className="relative mt-3 border-t border-white/10 pt-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
          {infographic.caption}
        </div>
      )}
    </div>
  );
}

function Bars({
  items,
  accent,
}: {
  items: Infographic["items"];
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
            <span className="text-white/80">{it.label}</span>
            <span style={{ color: accent }}>{it.display ?? `${it.value ?? 0}`}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(4, Math.min(100, it.value ?? 0))}%`,
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Stats({
  items,
  accent,
}: {
  items: Infographic["items"];
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 rounded border border-white/10 bg-white/[0.03] px-3 py-2"
        >
          <div className="min-w-0">
            <div className="truncate font-mono text-[11px] uppercase tracking-wide text-white/60">
              {it.label}
            </div>
            {it.detail && (
              <div className="truncate text-[11px] text-white/40">{it.detail}</div>
            )}
          </div>
          <div
            className="shrink-0 text-2xl font-black tabular-nums"
            style={{ color: accent, textShadow: `0 0 16px ${accent}66` }}
          >
            {it.display ?? it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline({
  items,
  accent,
}: {
  items: Infographic["items"];
  accent: string;
}) {
  return (
    <ol className="relative ml-2 flex flex-col gap-3 border-l border-white/15 pl-4">
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              {it.label}
            </span>
            <span className="text-sm font-bold text-white">{it.display}</span>
          </div>
          {it.detail && <div className="text-[11px] text-white/40">{it.detail}</div>}
        </li>
      ))}
    </ol>
  );
}

function Comparison({
  items,
  accent,
}: {
  items: Infographic["items"];
  accent: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded border p-3"
          style={{
            borderColor: i === 0 ? "rgba(255,255,255,0.15)" : `${accent}55`,
            background: i === 0 ? "rgba(255,255,255,0.03)" : `${accent}10`,
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {it.label}
          </div>
          <div className="mt-1 text-sm font-bold text-white">{it.display}</div>
          {it.detail && <div className="text-[11px] text-white/40">{it.detail}</div>}
        </div>
      ))}
    </div>
  );
}

function Quote({
  items,
  accent,
}: {
  items: Infographic["items"];
  accent: string;
}) {
  return (
    <div className="flex h-full items-center">
      <blockquote
        className="text-balance text-xl font-semibold italic leading-snug text-white"
        style={{ textShadow: `0 0 24px ${accent}44` }}
      >
        {items[0]?.label}
      </blockquote>
    </div>
  );
}
