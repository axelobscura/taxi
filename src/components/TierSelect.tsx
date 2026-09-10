"use client";

import { TIERS, type TierId, fareFor, mxn } from "@/lib/data";

type Props = {
  selected: TierId;
  onSelect: (id: TierId) => void;
  km: number;
  min: number;
};

const ACCENT: Record<
  string,
  { ring: string; text: string; glow: string; badge: string }
> = {
  rosa: { ring: "border-rosa", text: "text-rosa", glow: "shadow-[0_0_30px_-8px_var(--color-rosa)]", badge: "bg-rosa text-white" },
  jade: { ring: "border-jade", text: "text-jade", glow: "shadow-[0_0_30px_-8px_var(--color-jade)]", badge: "bg-jade text-ink" },
  violet: { ring: "border-violet", text: "text-violet", glow: "shadow-[0_0_30px_-8px_var(--color-violet)]", badge: "bg-violet text-white" },
  gold: { ring: "border-gold", text: "text-gold", glow: "shadow-[0_0_30px_-8px_var(--color-gold)]", badge: "bg-gold text-ink" },
};

export default function TierSelect({ selected, onSelect, km, min }: Props) {
  return (
    <div className="space-y-2">
      {TIERS.map((tier) => {
        const isOn = tier.id === selected;
        const accent = ACCENT[tier.accent];
        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            aria-pressed={isOn}
            className={`cut-tr flex w-full items-center gap-3 border-2 p-3 text-left transition-all duration-200 active:scale-[0.99] ${
              isOn
                ? `${accent.ring} bg-ink-raised ${accent.glow}`
                : "border-transparent bg-ink-soft/80 hover:bg-ink-raised"
            }`}
          >
            <CarMark accent={tier.accent} active={isOn} seats={tier.seats} />

            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="font-display text-sm font-extrabold uppercase tracking-wide">
                  {tier.name}
                </span>
                <span
                  className={`px-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    isOn ? accent.badge : "text-muted"
                  }`}
                >
                  {tier.eta} min
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted">
                {tier.tagline}
              </span>
            </span>

            <span className="shrink-0 text-right">
              <span className="block font-display text-lg font-extrabold tabular-nums">
                {mxn(fareFor(tier, km, min))}
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-muted">
                {tier.seats} plazas
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Small car glyph; XL gets a longer body to read as a bigger vehicle. */
function CarMark({ accent, active, seats }: { accent: string; active: boolean; seats: number }) {
  const color = active ? `var(--color-${accent})` : "#6c6a7a";
  const wide = seats > 4;
  return (
    <span className="grid size-12 shrink-0 place-items-center bg-ink">
      <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
        <path
          d={
            wide
              ? "M3 13h24v-3.2l-3.4-4.4a2 2 0 0 0-1.6-.8H8.2a2 2 0 0 0-1.6.8L3 9.8Z"
              : "M4 13h22v-3.4l-3.6-4.2a2 2 0 0 0-1.5-.7H9.1a2 2 0 0 0-1.5.7L4 9.6Z"
          }
          fill={color}
          opacity={active ? 1 : 0.55}
        />
        <circle cx={wide ? 8 : 9} cy="14.6" r="2.2" fill="#0b0b0f" stroke={color} strokeWidth="1.2" />
        <circle cx={wide ? 22 : 21} cy="14.6" r="2.2" fill="#0b0b0f" stroke={color} strokeWidth="1.2" />
      </svg>
    </span>
  );
}
