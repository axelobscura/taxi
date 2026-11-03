/**
 * Brand car mark: a front-on taxi with roof sign, windshield and headlights.
 * `cutout` is the colour of the tile behind it, used for the glass and
 * lights so they read as holes in the silhouette.
 */
export default function CarIcon({
  size = 24,
  color = "#111",
  cutout = "#ffc107",
}: {
  size?: number;
  color?: string;
  cutout?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="1.75" width="6" height="2.5" rx="1" fill={color} />
      <path
        d="M7.3 5.25h9.4a2 2 0 0 1 1.86 1.27L20 10.25H4l1.44-3.73A2 2 0 0 1 7.3 5.25Z"
        fill={color}
      />
      <path d="M8 6.9h8l1.15 2.6H6.85Z" fill={cutout} />
      <rect x="2.5" y="9.5" width="19" height="7" rx="2.5" fill={color} />
      <circle cx="6.6" cy="13" r="1.5" fill={cutout} />
      <circle cx="17.4" cy="13" r="1.5" fill={cutout} />
      <rect x="10" y="12.35" width="4" height="1.3" rx="0.65" fill={cutout} />
      <rect x="4" y="16" width="3.6" height="3.75" rx="1.3" fill={color} />
      <rect x="16.4" y="16" width="3.6" height="3.75" rx="1.3" fill={color} />
    </svg>
  );
}
