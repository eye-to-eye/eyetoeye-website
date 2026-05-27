// -----------------------------------------------------------------------------
// CircularRevealHeading — a permanent-iris ring with curved labels around the
// outside. Clicking a label toggles its "locked" highlight.
// -----------------------------------------------------------------------------

import { useState } from "react";

const RING_SIZES = {
  sm: { box: 300, radius: 160, gap: 40, font: 12, tracking: ".25em" },
  md: { box: 400, radius: 160, gap: 30, font: 13.5, tracking: ".30em" },
  lg: { box: 500, radius: 160, gap: 20, font: 16, tracking: ".35em" },
};

export default function CircularRevealHeading({
  items,
  centerText,
  size = "md",
  className = "",
  defaultImage = null,
}) {
  const cfg = RING_SIZES[size] || RING_SIZES.md;
  const [locked, setLocked] = useState(null);

  const total = items.length;
  const totalGap = cfg.gap * total;
  const available = 360 - totalGap;
  const segDeg = available / total;

  return (
    <div
      className={
        "circular-reveal " +
        (defaultImage ? "has-default-image " : "") +
        className
      }
      style={{
        width: cfg.box + "px",
        height: cfg.box + "px",
        backgroundImage: defaultImage ? `url("${defaultImage}")` : undefined,
      }}
    >
      <div className="cr-center">
        <div className="cr-center-inner">{centerText}</div>
      </div>

      <div className="cr-rotor">
        <svg viewBox="0 0 400 400" className="cr-svg">
          <defs>
            <linearGradient id="cr-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cfe9ef" />
              <stop offset="100%" stopColor="#6fd7e8" />
            </linearGradient>
          </defs>
          <path
            id={"cr-curve-" + size}
            fill="none"
            d={
              "M 200,200 m -" +
              cfg.radius +
              ",0 a " +
              cfg.radius +
              "," +
              cfg.radius +
              " 0 1,1 " +
              cfg.radius * 2 +
              ",0 a " +
              cfg.radius +
              "," +
              cfg.radius +
              " 0 1,1 -" +
              cfg.radius * 2 +
              ",0"
            }
          />
          {items.map((item, i) => {
            const start = i * (segDeg + cfg.gap);
            const startOffset = (start / 360) * 100 + "%";
            return (
              <text
                key={i}
                className={
                  "cr-text " + (locked === item.text ? "is-locked" : "")
                }
                style={{
                  fontSize: cfg.font + "px",
                  letterSpacing: cfg.tracking,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setLocked((cur) => (cur === item.text ? null : item.text));
                }}
                tabIndex={-1}
              >
                <textPath
                  href={"#cr-curve-" + size}
                  startOffset={startOffset}
                  textLength={segDeg * 1.8}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {item.text}
                </textPath>
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
