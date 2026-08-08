/** Hand-authored HH Goa decorative SVGs — no AI imagery. */

export function PalmSilhouette({
  className,
  color = "#0b6839",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 120"
      fill={color}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M38 118 V52" stroke={color} strokeWidth="3" fill="none" />
      <ellipse cx="38" cy="28" rx="28" ry="10" transform="rotate(-35 38 28)" />
      <ellipse cx="38" cy="26" rx="26" ry="9" transform="rotate(20 38 26)" />
      <ellipse cx="38" cy="24" rx="24" ry="8" transform="rotate(55 38 24)" />
      <ellipse cx="40" cy="30" rx="22" ry="8" transform="rotate(-70 40 30)" />
      <ellipse cx="36" cy="22" rx="20" ry="7" transform="rotate(90 36 22)" />
    </svg>
  );
}

export function SunRays({
  className,
  color = "#fee101",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 70"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="70" r="36" fill={color} />
      {[...Array(9)].map((_, i) => {
        const a = (-90 + i * 22.5) * (Math.PI / 180);
        const x1 = 60 + Math.cos(a) * 42;
        const y1 = 70 + Math.sin(a) * 42;
        const x2 = 60 + Math.cos(a) * 58;
        const y2 = 70 + Math.sin(a) * 58;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function WaveLine({
  className,
  color = "#0b6839",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 14 Q25 4 50 14 T100 14 T150 14 T200 14"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M0 20 Q25 10 50 20 T100 20 T150 20 T200 20"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.45"
      />
    </svg>
  );
}

export function SurfboardIcon({
  className,
  color = "#ff0080",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 64"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="12" cy="32" rx="8" ry="30" fill={color} stroke="#000" strokeWidth="1.5" />
      <line x1="12" y1="8" x2="12" y2="56" stroke="#fffbe8" strokeWidth="1.5" />
    </svg>
  );
}

export function TicketPerforation({
  className,
  color = "#00000033",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 8"
      preserveAspectRatio="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(40)].map((_, i) => (
        <circle key={i} cx={4 + i * 8} cy="4" r="2.2" fill={color} />
      ))}
    </svg>
  );
}

/** Imperfect circular passport stamp (CSS/SVG, not a photo). */
export function PassportStamp({
  label,
  sublabel,
  rotate = -12,
  variant = "green",
  size = 72,
}: {
  label: string;
  sublabel?: string;
  rotate?: number;
  variant?: "green" | "pink" | "yellow" | "red";
  size?: number;
}) {
  const colors = {
    green: { stroke: "#0b6839", fill: "#0b683914" },
    pink: { stroke: "#ff0080", fill: "#ff008014" },
    yellow: { stroke: "#c4a800", fill: "#fee10122" },
    red: { stroke: "#e40014", fill: "#e4001414" },
  }[variant];

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        borderRadius: "50%",
        border: `2.5px solid ${colors.stroke}`,
        background: colors.fill,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `inset 0 0 0 1px ${colors.stroke}55`,
        opacity: 0.88,
        flexShrink: 0,
      }}
      aria-hidden
    >
      <div
        style={{
          width: "82%",
          height: "82%",
          borderRadius: "50%",
          border: `1px dashed ${colors.stroke}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-imbue), Imbue, serif",
            fontWeight: 800,
            fontSize: size * 0.14,
            lineHeight: 1.05,
            color: colors.stroke,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
        {sublabel ? (
          <span
            style={{
              fontFamily: "var(--font-victor-mono), monospace",
              fontSize: size * 0.09,
              color: colors.stroke,
              marginTop: 2,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
