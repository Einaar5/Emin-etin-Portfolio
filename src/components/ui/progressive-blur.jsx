import React from "react";

// Simple class name helper (cn) – joins truthy class strings
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
} // adjust import if needed

/**
 * ProgressiveBlur adds a fading blur effect on the left or right side of its container.
 * It accepts a `blurIntensity` (0‑5) and a `direction` ("left" or "right").
 * The component is a simple overlay that uses CSS `backdrop-filter` for a smooth blur.
 */
export function ProgressiveBlur({
  blurIntensity = 1,
  direction = "right",
  className = "",
  style = {},
}) {
  const blur = Math.min(Math.max(blurIntensity, 0), 5) * 2; // convert to px
  const gradient =
    direction === "left"
      ? `linear-gradient(to right, rgba(255,255,255,${blur / 10}) 0%, transparent 100%)`
      : `linear-gradient(to left, rgba(255,255,255,${blur / 10}) 0%, transparent 100%)`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 bottom-0",
        direction === "left" ? "left-0" : "right-0",
        className
      )}
      style={{
        ...style,
        width: "160px",
        background: gradient,
        backdropFilter: `blur(${blur}px)`,
      }}
    />
  );
}

export default ProgressiveBlur;
