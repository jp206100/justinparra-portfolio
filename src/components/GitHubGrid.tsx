"use client";

import { useRef, useEffect } from "react";

interface ActivityDay {
  date: string;
  count: number;
  repos: string[];
}

interface Props {
  activityDays: ActivityDay[] | null;
}

/* Same 3-D helper used by HeroCanvas */
const project = (
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  fov = 500
) => {
  const scale = fov / (fov + z);
  return { x: x * scale + cx, y: y * scale + cy, s: scale };
};

export default function GitHubGrid({ activityDays }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();

    /* ── Build the terrain grid ───────────────────────────── */
    const days = activityDays ?? [];
    const maxCount = Math.max(1, ...days.map((d) => d.count));

    // Grid dimensions – columns map to days, rows add depth
    const cols = Math.max(days.length, 14); // at least 14 columns
    const rows = 18;
    const spacingX = 20;
    const spacingZ = 14;

    // Pre-compute per-column intensity (0-1) from activity data
    const colIntensity: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (c < days.length) {
        colIntensity.push(days[c].count / maxCount);
      } else {
        colIntensity.push(0);
      }
    }

    // Reverse so oldest is on the left, newest on the right
    colIntensity.reverse();
    const reversedDays = [...days].reverse();

    const grid: { ox: number; oz: number; y: number; intensity: number }[][] =
      [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          ox: (c - cols / 2) * spacingX,
          oz: (r - rows / 2) * spacingZ,
          y: 0,
          intensity: colIntensity[c],
        };
      }
    }

    /* ── Mouse handling ──────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    /* ── Animation loop ──────────────────────────────────── */
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const time = Date.now() * 0.0008;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cx = W / 2 + mx * 20;
      const cy = H * 0.38;

      const flowOffset = time * 8;

      // Update grid Y displacements
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const intensity = p.intensity;

          // Base wave motion (like hero Grid A)
          const baseWave =
            Math.sin(flowX * 0.02 - time * 1.2) * 8 +
            Math.cos(p.oz * 0.03 + time * 0.4) * 5;

          // Activity displacement – peaks for high-activity days
          // Shaped as a ridge that spans the depth rows with a smooth falloff
          const ridgeCenter = rows / 2;
          const ridgeDist = Math.abs(r - ridgeCenter) / (rows / 2);
          const ridgeShape = Math.max(0, 1 - ridgeDist * ridgeDist);
          const activityPeak = -intensity * 55 * ridgeShape; // negative Y = upward

          p.y = baseWave + activityPeak;
        }
      }

      // ── Draw row lines ──
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, p.y, p.oz + 200, cx, cy);
          if (!started) {
            ctx.moveTo(pr.x, pr.y);
            started = true;
          } else {
            ctx.lineTo(pr.x, pr.y);
          }
        }
        ctx.strokeStyle = `rgba(200, 65, 43, 0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Draw column lines ──
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, p.y, p.oz + 200, cx, cy);
          r === 0 ? ctx.moveTo(pr.x, pr.y) : ctx.lineTo(pr.x, pr.y);
        }
        // Columns with higher intensity get brighter accent lines
        const intensity = colIntensity[c];
        const alpha = 0.04 + intensity * 0.12;
        ctx.strokeStyle = `rgba(200, 65, 43, ${alpha})`;
        ctx.lineWidth = 0.5 + intensity * 1;
        ctx.stroke();
      }

      // ── Convergence glow on peaks (matching hero style) ──
      const convergeCx = W / 2 + mx * 60;
      const convergeCy = H * 0.5 + my * 30;

      for (let r = 0; r < rows; r++) {
        for (let c = 1; c < cols; c++) {
          const p0 = grid[r][c - 1];
          const p1 = grid[r][c];
          const f0x = p0.ox + flowOffset;
          const f1x = p1.ox + flowOffset;
          const pr0 = project(f0x, p0.y, p0.oz + 200, cx, cy);
          const pr1 = project(f1x, p1.y, p1.oz + 200, cx, cy);

          const midX = (pr0.x + pr1.x) / 2;
          const midY = (pr0.y + pr1.y) / 2;
          const cdx = midX - convergeCx;
          const cdy = midY - convergeCy;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          const convergeRadius = 180;
          const inZone = Math.max(0, 1 - cDist / convergeRadius);

          if (inZone > 0.05) {
            const avgIntensity = (colIntensity[c - 1] + colIntensity[c]) / 2;
            const glowAlpha = inZone * (0.15 + avgIntensity * 0.2);
            ctx.strokeStyle = `rgba(200, 65, 43, ${glowAlpha})`;
            ctx.lineWidth = 0.5 + inZone * 1.5;
            ctx.beginPath();
            ctx.moveTo(pr0.x, pr0.y);
            ctx.lineTo(pr1.x, pr1.y);
            ctx.stroke();
          }
        }
      }

      // ── Radial glow at mouse position ──
      if (mouseRef.current.active) {
        const gradient = ctx.createRadialGradient(
          convergeCx,
          convergeCy,
          0,
          convergeCx,
          convergeCy,
          140
        );
        gradient.addColorStop(0, "rgba(200, 65, 43, 0.04)");
        gradient.addColorStop(0.5, "rgba(200, 65, 43, 0.015)");
        gradient.addColorStop(1, "rgba(200, 65, 43, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Date labels along the bottom ──
      if (reversedDays.length > 0) {
        ctx.font = "9px 'Inter Tight', sans-serif";
        ctx.textAlign = "center";

        // Show labels for a subset of days to avoid overlap
        const labelInterval = Math.max(1, Math.floor(reversedDays.length / 7));
        for (let i = 0; i < reversedDays.length; i += labelInterval) {
          if (i >= cols) break;
          const p = grid[rows - 1][i];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, 0, p.oz + 200 + 40, cx, cy);

          const dateStr = reversedDays[i].date.slice(5); // MM-DD
          const count = reversedDays[i].count;
          const intensity = colIntensity[i];

          ctx.fillStyle = `rgba(107, 101, 96, ${0.4 + intensity * 0.4})`;
          ctx.fillText(dateStr, pr.x, H - 8);

          // Show event count above the label for active days
          if (count > 0) {
            ctx.fillStyle = `rgba(200, 65, 43, ${0.4 + intensity * 0.5})`;
            ctx.fillText(`${count}`, pr.x, H - 20);
          }
        }
      }
    };

    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [activityDays]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 240,
        marginBottom: 24,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "default",
        }}
      />
    </div>
  );
}
