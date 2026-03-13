"use client";

import { useRef, useState, useEffect, useMemo } from "react";

interface CellData {
  w: number;
  d: number;
  level: number;
}

interface Props {
  contributions: CellData[] | null;
}

function generatePlaceholder(): CellData[] {
  const data: CellData[] = [];
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      data.push({ w, d, level: 0 });
    }
  }
  return data;
}

export default function GitHubGrid({ contributions }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 26, y: 3.5 });
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);

  const data = useMemo(
    () => contributions ?? generatePlaceholder(),
    [contributions]
  );

  // Track loading state for shimmer
  const isLoading = contributions === null;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMouse = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 52;
      const y = ((e.clientY - rect.top) / rect.height) * 7;
      mouseRef.current = { x, y };
    };
    const onLeave = () => {
      mouseRef.current = { x: 26, y: 3.5 };
    };
    wrap.addEventListener("mousemove", onMouse);
    wrap.addEventListener("mouseleave", onLeave);

    const els = cellRefs.current;

    const colors = [
      [245, 242, 237], // L0: bg
      [228, 195, 188], // L1: lightest
      [210, 140, 125], // L2: medium
      [200, 85, 60], // L3: strong
      [200, 65, 43], // L4: accent
    ];

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.0015;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < data.length; i++) {
        const { w, d, level } = data[i];
        const el = els[i];
        if (!el) continue;

        const dx = w - mx;
        const dy = d - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(dist * 0.5 - time) * 0.5 + 0.5;
        const boost = 0.7 + wave * 0.3;

        const c = colors[level];
        const r = Math.round(Math.min(255, c[0] * boost));
        const g = Math.round(Math.min(255, c[1] * boost));
        const b = Math.round(Math.min(255, c[2] * boost));

        const scalePulse = level >= 3 ? 1 + wave * 0.08 : 1;

        el.style.backgroundColor = `rgb(${r},${g},${b})`;
        el.style.transform = `scale(${scalePulse})`;

        if (level === 4 && wave > 0.7) {
          el.style.boxShadow = `0 0 ${4 * wave}px rgba(200,65,43,${wave * 0.3})`;
        } else {
          el.style.boxShadow = "none";
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      wrap.removeEventListener("mousemove", onMouse);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [data]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div ref={wrapRef} style={{ marginBottom: 20, cursor: "default", opacity: isLoading ? 0.4 : 1, transition: "opacity 0.5s" }}>
      {/* Month labels */}
      <div className="flex" style={{ paddingLeft: 32, marginBottom: 6 }}>
        {months.map((m, i) => (
          <span
            key={i}
            style={{
              fontSize: 9,
              fontWeight: 500,
              color: "var(--color-fg-secondary)",
              letterSpacing: "0.05em",
              width: `${100 / 12}%`,
              textAlign: "left",
            }}
          >
            {m}
          </span>
        ))}
      </div>
      <div className="flex" style={{ gap: 2 }}>
        {/* Day labels */}
        <div
          className="flex flex-col justify-between"
          style={{ paddingRight: 6, width: 28, flexShrink: 0 }}
        >
          {dayLabels.map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                color: "var(--color-fg-secondary)",
                height: "calc((100% - 12px) / 7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
        {/* Grid */}
        <div
          className="flex-1"
          style={{
            display: "grid",
            gridTemplateRows: "repeat(7, 1fr)",
            gridTemplateColumns: "repeat(52, 1fr)",
            gridAutoFlow: "column",
            gap: 2,
            aspectRatio: "52/7",
          }}
        >
          {data.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              style={{
                borderRadius: 2,
                backgroundColor: "#F5F2ED",
                transition: "box-shadow 0.3s",
                willChange: "background-color, transform",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
