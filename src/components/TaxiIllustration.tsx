/**
 * Side view of a yellow taxi for the home hero. Drawn in SVG so it stays
 * sharp at any size; swap for a photo by replacing this component.
 * The car faces right. `taxi-*` classes hook into the hero animation in
 * globals.css (drive-in, wheel spin, idle bob).
 */
const BODY =
  "M36 186 C34 158 48 146 78 140 L190 124 L252 74 C266 63 280 58 298 58 L430 58 C452 58 468 64 482 76 L548 124 L612 134 C640 139 650 152 650 172 L650 192 C650 202 644 208 634 208 L46 208 C38 208 36 200 36 186 Z";

const REAR_WINDOW = "M262 82 C272 72 282 70 296 70 L350 70 L350 124 L214 124 Z";
const FRONT_WINDOW = "M362 70 L428 70 C446 70 458 74 470 84 L522 124 L362 124 Z";

export default function TaxiIllustration({ className = "" }: { className?: string }) {
  const wheel = (cx: number) => (
    <g className="taxi-wheel">
      {/* Tyre, with tread marks so the spin reads */}
      <circle cx={cx} cy="196" r="44" fill="#0b0b0c" />
      <circle
        cx={cx}
        cy="196"
        r="41"
        fill="none"
        stroke="#232327"
        strokeWidth="5"
        strokeDasharray="6 5"
      />
      <circle cx={cx} cy="196" r="35" fill="#18181b" />
      <circle cx={cx} cy="196" r="35" fill="none" stroke="#2c2c31" strokeWidth="2" />
      {/* Rim */}
      <circle cx={cx} cy="196" r="27" fill="url(#rimMetal)" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <path
          key={deg}
          d={`M${cx - 5} 196 L${cx - 3} 172 L${cx + 3} 172 L${cx + 5} 196 Z`}
          fill="#7b818c"
          transform={`rotate(${deg} ${cx} 196)`}
        />
      ))}
      <circle cx={cx} cy="196" r="27" fill="none" stroke="#5b616b" strokeWidth="2" />
      <circle cx={cx} cy="196" r="27" fill="url(#rimShine)" />
      {/* Hub and lug nuts */}
      <circle cx={cx} cy="196" r="10" fill="#4b5260" />
      {[36, 108, 180, 252, 324].map((deg) => (
        <circle
          key={deg}
          cx={cx}
          cy="189"
          r="1.6"
          fill="#c9ced6"
          transform={`rotate(${deg} ${cx} 196)`}
        />
      ))}
      <circle cx={cx} cy="196" r="4" fill="#ffc107" />
    </g>
  );

  const arch = (cx: number) => (
    <>
      <path d={`M${cx - 62} 208 A62 62 0 0 1 ${cx + 62} 208 Z`} fill="#0b0b0c" />
      <path
        d={`M${cx - 66} 208 A66 66 0 0 1 ${cx + 66} 208`}
        fill="none"
        stroke="#b07c00"
        strokeWidth="4"
      />
    </>
  );

  return (
    <svg
      viewBox="0 0 680 260"
      className={`taxi-drive overflow-visible ${className}`}
      role="img"
      aria-label="Taxi amarillo de TAXI-MEX"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe07a" />
          <stop offset="0.35" stopColor="#ffc928" />
          <stop offset="0.7" stopColor="#ffb300" />
          <stop offset="1" stopColor="#c78a00" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a5d6c" />
          <stop offset="0.6" stopColor="#1f2a33" />
          <stop offset="1" stopColor="#10161c" />
        </linearGradient>
        <linearGradient id="shoulder" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rimMetal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#d7dbe1" />
          <stop offset="1" stopColor="#9aa0aa" />
        </radialGradient>
        <radialGradient id="rimShine" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="headGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tailGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff3b5c" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff3b5c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="signGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffc107" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffc107" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#111" />
          <rect width="8" height="8" fill="#ffc107" />
          <rect x="8" y="8" width="8" height="8" fill="#ffc107" />
        </pattern>
        <clipPath id="bodyClip">
          <path d={BODY} />
        </clipPath>
        <clipPath id="rearGlassClip">
          <path d={REAR_WINDOW} />
        </clipPath>
        <clipPath id="frontGlassClip">
          <path d={FRONT_WINDOW} />
        </clipPath>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="340" cy="240" rx="320" ry="16" fill="url(#ground)" />

      {/* Everything above the axles bobs gently while idling. */}
      <g className="taxi-body">
        {/* Roof sign: glow, mount, lit box */}
        <ellipse cx="344" cy="42" rx="80" ry="26" fill="url(#signGlow)" />
        <rect x="318" y="52" width="52" height="8" rx="2" fill="#1a1a1a" />
        <rect x="296" y="28" width="96" height="28" rx="6" fill="#111" />
        <rect x="300" y="32" width="88" height="20" rx="4" fill="#ffd54a" />
        <rect x="300" y="32" width="88" height="7" rx="4" fill="#fff" opacity="0.35" />
        <text
          x="344"
          y="47"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="2"
          fill="#111"
        >
          TAXI
        </text>

        {/* Antenna */}
        <path d="M424 58 L446 26" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="446" cy="26" r="2" fill="#1a1a1a" />

        {/* Body */}
        <path d={BODY} fill="url(#body)" />

        <g clipPath="url(#bodyClip)">
          {/* Soft reflection along the shoulder line */}
          <path
            d="M60 140 L190 122 L548 122 L640 136 L640 146 L60 150 Z"
            fill="url(#shoulder)"
            opacity="0.5"
          />
          {/* Checker stripe with thin black pinstripes */}
          <rect x="30" y="150" width="630" height="16" fill="url(#checker)" />
          <rect x="30" y="148" width="630" height="2" fill="#111" />
          <rect x="30" y="166" width="630" height="2" fill="#111" />
          {/* Darker rocker panel */}
          <rect x="30" y="196" width="630" height="14" fill="#9a6b00" opacity="0.55" />
        </g>

        {/* Windows with frames, B-pillar and reflections */}
        <path d={REAR_WINDOW} fill="url(#glass)" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <path d={FRONT_WINDOW} fill="url(#glass)" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <rect x="349" y="68" width="14" height="58" fill="#141414" />
        <g clipPath="url(#rearGlassClip)">
          <path d="M268 60 L300 60 L240 130 L208 130 Z" fill="#fff" opacity="0.14" />
          <path d="M312 60 L322 60 L262 130 L252 130 Z" fill="#fff" opacity="0.08" />
        </g>
        <g clipPath="url(#frontGlassClip)">
          <path d="M420 60 L452 60 L392 130 L360 130 Z" fill="#fff" opacity="0.12" />
          <path d="M466 60 L476 60 L416 130 L406 130 Z" fill="#fff" opacity="0.08" />
        </g>

        {/* Door seams */}
        <path d="M356 126 L356 204" stroke="#a87500" strokeWidth="2" />
        <path d="M208 128 L204 204" stroke="#a87500" strokeWidth="2" />
        <path d="M522 128 L528 142" stroke="#a87500" strokeWidth="2" />

        {/* Door handles */}
        <rect x="298" y="132" width="28" height="7" rx="3.5" fill="#7a5600" />
        <rect x="300" y="133" width="24" height="2" rx="1" fill="#fff" opacity="0.3" />
        <rect x="452" y="132" width="28" height="7" rx="3.5" fill="#7a5600" />
        <rect x="454" y="133" width="24" height="2" rx="1" fill="#fff" opacity="0.3" />

        {/* Door lettering */}
        <text
          x="412"
          y="190"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="13"
          letterSpacing="1"
          fill="#111"
        >
          TAXI<tspan fill="#7a5600">-MEX</tspan>
        </text>
        <text
          x="282"
          y="188"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="9"
          letterSpacing="1.5"
          fill="#111"
          opacity="0.75"
        >
          CDMX · 042
        </text>

        {/* Fuel cap */}
        <circle cx="178" cy="136" r="6" fill="none" stroke="#a87500" strokeWidth="1.5" />

        {/* Mirror */}
        <path
          d="M518 106 L536 98 C542 96 546 100 546 106 L546 112 C546 116 542 118 538 118 L522 118 Z"
          fill="#141414"
        />
        <path d="M528 102 L540 99" stroke="#fff" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />

        {/* Headlight with glow, and amber indicator */}
        <ellipse cx="640" cy="152" rx="34" ry="20" fill="url(#headGlow)" />
        <path d="M616 140 C634 142 644 150 647 162 L618 160 Z" fill="#fff7d1" stroke="#a87500" strokeWidth="1.5" />
        <path
          d="M624 144 C632 146 638 150 640 156"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          opacity="0.9"
          strokeLinecap="round"
        />
        <rect x="634" y="166" width="12" height="5" rx="2" fill="#f59e0b" />

        {/* Tail light with glow */}
        <ellipse cx="44" cy="160" rx="22" ry="20" fill="url(#tailGlow)" />
        <path d="M40 148 L58 144 L56 174 L38 174 Z" fill="#e11d48" stroke="#7f1027" strokeWidth="1.5" />
        <path d="M43 150 L54 148 L53 156 L42 158 Z" fill="#fff" opacity="0.35" />

        {/* Bumpers, front grille and number plate */}
        <rect x="588" y="184" width="66" height="16" rx="8" fill="#1a1a1a" />
        <path d="M606 189 H644 M606 194 H644" stroke="#3a3a3f" strokeWidth="1.5" />
        <rect x="28" y="184" width="62" height="16" rx="8" fill="#1a1a1a" />
        <rect x="40" y="187" width="28" height="10" rx="1.5" fill="#f4f4f5" />
        <rect x="40" y="187" width="28" height="2.5" fill="#2563eb" />

        {/* Highlights along the shoulder and roof */}
        <path d="M90 140 L196 126" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <path d="M548 126 L606 135" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <path d="M300 61 L428 61" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </g>

      {/* Wheel arches and wheels */}
      {arch(152)}
      {arch(528)}
      {wheel(152)}
      {wheel(528)}
    </svg>
  );
}
