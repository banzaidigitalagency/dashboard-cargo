"use client";
import * as React from "react";

type Props = {
  data: number[];
  width?: number;
  height?: number;
  /** Couleur de la ligne (par défaut : --green). */
  stroke?: string;
  /** Couleur du remplissage sous la ligne (par défaut : --green à 25 %). */
  fill?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 120,
  height = 32,
  stroke = "var(--green)",
  fill = "color-mix(in srgb, var(--green) 25%, transparent)",
  className,
}: Props) {
  // Filter leading zeros so the curve isn't flat at the start
  let firstNonZero = data.findIndex((v) => v > 0);
  if (firstNonZero < 0) firstNonZero = data.length - 1;
  const filtered = data.slice(Math.max(0, firstNonZero));
  if (filtered.length < 2) {
    return <div style={{ width, height }} className={className} />;
  }
  const max = Math.max(...filtered);
  const min = Math.min(...filtered);
  const range = max - min || 1;
  const stepX = filtered.length > 1 ? width / (filtered.length - 1) : width;

  const points = filtered.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`))
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1][0].toFixed(1)} ${height} L ${points[0][0].toFixed(1)} ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path d={areaPath} fill={fill} stroke="none" />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
