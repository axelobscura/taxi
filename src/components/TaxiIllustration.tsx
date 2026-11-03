/**
 * Side view of a yellow taxi for the home hero. Drawn in SVG so it stays
 * sharp at any size; swap for a photo by replacing this component.
 */
export default function TaxiIllustration({ className = "" }: { className?: string }) {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy="196" r="44" fill="#0b0b0c" />
      <circle cx={cx} cy="196" r="34" fill="#1c1c1f" />
      <circle cx={cx} cy="196" r="24" fill="#b8bcc4" />
      <circle cx={cx} cy="196" r="24" fill="url(#rim)" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <rect
          key={deg}
          x={cx - 3}
          y="174"
          width="6"
          height="22"
          rx="3"
          fill="#6b7280"
          transform={`rotate(${deg} ${cx} 196)`}
        />
      ))}
      <circle cx={cx} cy="196" r="7" fill="#374151" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 680 260"
      className={className}
      role="img"
      aria-label="Taxi amarillo de TAXI_MEX"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd54a" />
          <stop offset="0.55" stopColor="#ffc107" />
          <stop offset="1" stopColor="#d99a00" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a4a57" />
          <stop offset="1" stopColor="#141b22" />
        </linearGradient>
        <radialGradient id="rim" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#111" />
          <rect width="8" height="8" fill="#ffc107" />
          <rect x="8" y="8" width="8" height="8" fill="#ffc107" />
        </pattern>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="340" cy="238" rx="300" ry="14" fill="#000" opacity="0.45" />

      {/* Roof sign */}
      <rect x="296" y="30" width="96" height="26" rx="5" fill="#111" />
      <rect x="300" y="34" width="88" height="18" rx="3" fill="#ffc107" />
      <text
        x="344"
        y="48"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="14"
        letterSpacing="2"
        fill="#111"
      >
        TAXI
      </text>

      {/* Body */}
      <path
        d="M36 186 C34 158 48 146 78 140 L190 124 L252 74 C266 63 280 58 298 58 L430 58 C452 58 468 64 482 76 L548 124 L612 134 C640 139 650 152 650 172 L650 192 C650 202 644 208 634 208 L46 208 C38 208 36 200 36 186 Z"
        fill="url(#body)"
      />

      {/* Windows */}
      <path d="M262 82 C272 72 282 70 296 70 L350 70 L350 124 L214 124 Z" fill="url(#glass)" />
      <path d="M362 70 L428 70 C446 70 458 74 470 84 L522 124 L362 124 Z" fill="url(#glass)" />
      <path d="M270 80 L300 72 L240 122 L226 122 Z" fill="#fff" opacity="0.12" />

      {/* Checker stripe */}
      <rect x="60" y="150" width="580" height="16" fill="url(#checker)" opacity="0.95" />

      {/* Door seams and handles */}
      <path d="M356 124 L356 204" stroke="#b07c00" strokeWidth="2" />
      <path d="M208 128 L204 204" stroke="#b07c00" strokeWidth="2" />
      <path d="M520 128 L526 196" stroke="#b07c00" strokeWidth="2" />
      <rect x="300" y="132" width="26" height="6" rx="3" fill="#8a6100" />
      <rect x="452" y="132" width="26" height="6" rx="3" fill="#8a6100" />

      {/* Mirror */}
      <path d="M520 104 L540 100 L544 114 L524 118 Z" fill="#111" />

      {/* Lights and bumpers */}
      <path d="M618 140 C634 142 644 150 646 162 L620 160 Z" fill="#fff7d1" />
      <path d="M40 150 L58 146 L56 172 L38 172 Z" fill="#e11d48" />
      <rect x="590" y="186" width="62" height="14" rx="7" fill="#1a1a1a" />
      <rect x="32" y="186" width="56" height="14" rx="7" fill="#1a1a1a" />

      {/* Highlight along the shoulder */}
      <path d="M90 140 L196 126" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M548 126 L606 135" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" />

      {/* Wheel wells and wheels */}
      <path d="M90 208 A62 62 0 0 1 214 208 Z" fill="#0b0b0c" />
      <path d="M466 208 A62 62 0 0 1 590 208 Z" fill="#0b0b0c" />
      {wheel(152)}
      {wheel(528)}
    </svg>
  );
}
