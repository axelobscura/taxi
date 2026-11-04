/**
 * Side view of a yellow taxi for the home hero. Drawn in SVG so it stays
 * sharp at any size; swap for a photo by replacing this component.
 * The car faces right. `taxi-*` classes hook into the hero animation in
 * globals.css (drive-in, wheels rolling while it moves, idle bob).
 *
 * Geometry: ground at y=236, wheels r=38 centred on y=198 so they touch
 * the ground, body sill at y=212 with arch cutouts (r=46) around each wheel.
 */
const GROUND = 236;
const WHEEL_Y = 198;
const WHEEL_R = 38;
const REAR_X = 158;
const FRONT_X = 522;

/** Body outline, rear (left) to front (right), with both wheel arches cut out. */
const BODY = [
  "M70 212 L114 212",
  "A46 46 0 1 1 202 212", // rear arch
  "L478 212",
  "A46 46 0 1 1 566 212", // front arch
  "L628 212 C644 212 652 204 652 192 L652 172 C652 156 644 148 628 144", // nose
  "L556 130 C540 128 530 122 520 114 L470 76 C458 66 446 62 430 62", // hood, windshield
  "L300 62 C284 62 272 66 262 74", // roof
  "L206 120 C198 126 190 128 178 128 L84 136 C64 140 52 150 50 166", // rear glass, trunk
  "L50 196 C50 206 58 212 70 212 Z", // tail
].join(" ");

const REAR_WINDOW = "M268 82 C276 76 286 74 298 74 L348 74 L348 118 L222 118 Z";
const FRONT_WINDOW = "M362 74 L428 74 C442 74 452 78 462 86 L502 118 L362 118 Z";

export default function TaxiIllustration({ className = "" }: { className?: string }) {
  const wheel = (cx: number) => (
    <g className="taxi-wheel">
      <circle cx={cx} cy={WHEEL_Y} r={WHEEL_R} fill="#0b0b0c" />
      <circle cx={cx} cy={WHEEL_Y} r="32" fill="#1c1c1f" />
      <circle cx={cx} cy={WHEEL_Y} r="24" fill="url(#rimMetal)" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <path
          key={deg}
          d={`M${cx - 4} ${WHEEL_Y} L${cx - 2.5} ${WHEEL_Y - 22} L${cx + 2.5} ${WHEEL_Y - 22} L${cx + 4} ${WHEEL_Y} Z`}
          fill="#7b818c"
          transform={`rotate(${deg} ${cx} ${WHEEL_Y})`}
        />
      ))}
      <circle cx={cx} cy={WHEEL_Y} r="24" fill="none" stroke="#5b616b" strokeWidth="2" />
      <circle cx={cx} cy={WHEEL_Y} r="24" fill="url(#rimShine)" />
      <circle cx={cx} cy={WHEEL_Y} r="8" fill="#4b5260" />
      <circle cx={cx} cy={WHEEL_Y} r="3.5" fill="#ffc107" />
    </g>
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
          <stop offset="0.4" stopColor="#ffc928" />
          <stop offset="0.75" stopColor="#ffb300" />
          <stop offset="1" stopColor="#d99500" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a5d6c" />
          <stop offset="0.6" stopColor="#1f2a33" />
          <stop offset="1" stopColor="#10161c" />
        </linearGradient>
        <radialGradient id="rimMetal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dfe3e8" />
          <stop offset="1" stopColor="#9aa0aa" />
        </radialGradient>
        <radialGradient id="rimShine" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="signGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffc107" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffc107" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <pattern id="checker" width="14" height="14" patternUnits="userSpaceOnUse" y="150">
          <rect width="14" height="14" fill="#111" />
          <rect width="7" height="7" fill="#ffc107" />
          <rect x="7" y="7" width="7" height="7" fill="#ffc107" />
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
      <ellipse cx="350" cy={GROUND + 2} rx="310" ry="12" fill="url(#ground)" />

      {/* Wheel wells: dark discs behind the body, seen through the arch cutouts. */}
      <circle cx={REAR_X} cy={WHEEL_Y} r="45" fill="#0b0b0c" />
      <circle cx={FRONT_X} cy={WHEEL_Y} r="45" fill="#0b0b0c" />

      {/* Everything above the axles bobs gently while idling. */}
      <g className="taxi-body">
        {/* Roof sign */}
        <ellipse cx="365" cy="44" rx="74" ry="22" fill="url(#signGlow)" />
        <rect x="341" y="54" width="48" height="9" rx="2" fill="#1a1a1a" />
        <rect x="317" y="30" width="96" height="27" rx="6" fill="#111" />
        <rect x="321" y="34" width="88" height="19" rx="4" fill="#ffd54a" />
        <rect x="321" y="34" width="88" height="6" rx="3" fill="#fff" opacity="0.35" />
        <text
          x="365"
          y="48.5"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="13"
          letterSpacing="2"
          fill="#111"
        >
          TAXI
        </text>

        {/* Body */}
        <path d={BODY} fill="url(#body)" />

        {/* Paint details, clipped to the body so nothing crosses the outline */}
        <g clipPath="url(#bodyClip)">
          {/* Soft reflection on the upper body */}
          <rect x="40" y="126" width="620" height="18" fill="#fff" opacity="0.12" />
          {/* Checker stripe between two pinstripes */}
          <rect x="40" y="148" width="620" height="2" fill="#111" />
          <rect x="40" y="150" width="620" height="14" fill="url(#checker)" />
          <rect x="40" y="164" width="620" height="2" fill="#111" />
          {/* Darker sill */}
          <rect x="40" y="202" width="620" height="12" fill="#a87300" opacity="0.5" />
          {/* Arch lips, so the cutouts read as wheel arches */}
          <circle cx={REAR_X} cy={WHEEL_Y} r="47" fill="none" stroke="#b07c00" strokeWidth="3" />
          <circle cx={FRONT_X} cy={WHEEL_Y} r="47" fill="none" stroke="#b07c00" strokeWidth="3" />

          {/* Headlight and indicator on the nose */}
          <path d="M618 147 C632 148 643 153 649 161 L647 168 L620 166 Z" fill="#fff7d1" />
          <path d="M624 151 C633 152 640 155 644 160" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="630" y="172" width="16" height="5" rx="2" fill="#f59e0b" />

          {/* Tail light */}
          <path d="M48 150 L68 146 L68 170 L48 170 Z" fill="#e11d48" />
          <path d="M51 152 L64 149 L64 156 L51 158 Z" fill="#fff" opacity="0.3" />
        </g>

        {/* Windows with dark frames and a B-pillar */}
        <path d={REAR_WINDOW} fill="url(#glass)" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <path d={FRONT_WINDOW} fill="url(#glass)" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <rect x="348" y="72" width="14" height="48" fill="#141414" />
        <g clipPath="url(#rearGlassClip)">
          <path d="M282 70 L310 70 L262 122 L234 122 Z" fill="#fff" opacity="0.14" />
        </g>
        <g clipPath="url(#frontGlassClip)">
          <path d="M424 70 L452 70 L404 122 L376 122 Z" fill="#fff" opacity="0.12" />
        </g>

        {/* Door seams */}
        <path d="M214 124 L214 208" stroke="#a87500" strokeWidth="2" />
        <path d="M355 122 L355 210" stroke="#a87500" strokeWidth="2" />
        <path d="M470 120 L470 210" stroke="#a87500" strokeWidth="2" />

        {/* Door handles */}
        <rect x="300" y="132" width="26" height="6" rx="3" fill="#7a5600" />
        <rect x="420" y="132" width="26" height="6" rx="3" fill="#7a5600" />

        {/* Side mirror on a short stem at the front of the door window */}
        <path d="M494 119 L497 112" stroke="#141414" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M492 106 C492 103 494 101 497 101 L507 101 C510 101 512 103 511 106 L510 110 C509 112 507 113 505 113 L495 113 C493 113 492 111 492 109 Z"
          fill="#141414"
        />

        {/* Door lettering */}
        <text
          x="412"
          y="192"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="1"
          fill="#111"
        >
          TAXI<tspan fill="#7a5600">-MEX</tspan>
        </text>
        <text
          x="284"
          y="190"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="9"
          letterSpacing="1.5"
          fill="#111"
          opacity="0.7"
        >
          CDMX · 042
        </text>

        {/* Bumpers */}
        <rect x="604" y="190" width="52" height="14" rx="7" fill="#1a1a1a" />
        <rect x="44" y="190" width="48" height="14" rx="7" fill="#1a1a1a" />

        {/* Highlights along the shoulder and roof */}
        <path d="M92 137 L176 130" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        <path d="M560 133 L622 145" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        <path d="M302 65 L428 65" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </g>

      {wheel(REAR_X)}
      {wheel(FRONT_X)}
    </svg>
  );
}
