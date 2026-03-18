"use client";

import { useRef, useEffect } from "react";

const project = (x: number, y: number, z: number, cx: number, cy: number, fov = 500) => {
  const scale = fov / (fov + z);
  return { x: x * scale + cx, y: y * scale + cy, s: scale };
};

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId: number;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();

    // GRID A: Structured/precise (design strategy)
    const colsA = 35, rowsA = 30, spacingA = 16;
    const gridA: { ox: number; oz: number; y: number }[][] = [];
    for (let r = 0; r < rowsA; r++) {
      gridA[r] = [];
      for (let c = 0; c < colsA; c++) {
        gridA[r][c] = {
          ox: (c - colsA / 2) * spacingA - 120,
          oz: (r - rowsA / 2) * spacingA,
          y: 0,
        };
      }
    }

    // GRID B: Organic/flowing (technical leadership)
    const colsB = 28, rowsB = 24, spacingB = 22;
    const gridB: { ox: number; oz: number; y: number }[][] = [];
    for (let r = 0; r < rowsB; r++) {
      gridB[r] = [];
      for (let c = 0; c < colsB; c++) {
        gridB[r][c] = {
          ox: (c - colsB / 2) * spacingB + 120,
          oz: (r - rowsB / 2) * spacingB,
          y: 0,
        };
      }
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    document.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const drawGrid = (
      grid: { ox: number; oz: number; y: number }[][],
      cols: number,
      rows: number,
      time: number,
      fade: number,
      cx: number,
      cy: number,
      mx: number,
      my: number,
      flowOffset: number,
      convergeCx: number,
      convergeCy: number,
      isGridA: boolean
    ) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;

          if (isGridA) {
            const wave = Math.sin(flowX * 0.02 - time * 1.2) * 25;
            const cross = Math.cos(p.oz * 0.025 + time * 0.4) * 12;
            p.y = (wave + cross) * fade;
          } else {
            const dx = flowX - mx * 200;
            const dz = p.oz - my * 200;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const ripple = Math.sin(dist * 0.012 - time * 0.8) * 35;
            const noise =
              Math.sin(flowX * 0.008 + time * 0.3) *
              Math.cos(p.oz * 0.012 + time * 0.5) *
              18;
            p.y = (ripple + noise) * fade;
          }
        }
      }

      // Draw row lines
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
        const baseAlpha = isGridA ? 0.06 : 0.045;
        ctx.strokeStyle = `rgba(200, 65, 43, ${baseAlpha * fade})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw column lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, p.y, p.oz + 200, cx, cy);
          r === 0 ? ctx.moveTo(pr.x, pr.y) : ctx.lineTo(pr.x, pr.y);
        }
        const baseAlpha = isGridA ? 0.06 : 0.045;
        ctx.strokeStyle = `rgba(200, 65, 43, ${baseAlpha * fade})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Convergence glow
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
          const convergeRadius = 220;
          const inZone = Math.max(0, 1 - cDist / convergeRadius);

          if (inZone > 0.05) {
            const glowAlpha = inZone * 0.25 * fade;
            ctx.strokeStyle = `rgba(200, 65, 43, ${glowAlpha})`;
            ctx.lineWidth = 0.5 + inZone * 1.5;
            ctx.beginPath();
            ctx.moveTo(pr0.x, pr0.y);
            ctx.lineTo(pr1.x, pr1.y);
            ctx.stroke();
          }
        }
      }
    };

    const draw = () => {
      animId = requestAnimationFrame(draw);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const m = mouseRef.current;
      m.tx += (m.x - m.tx) * 0.04;
      m.ty += (m.y - m.ty) * 0.04;

      const time = Date.now() * 0.0008;
      const fade = Math.max(0, 1 - scrollRef.current / (H * 0.6));
      if (fade < 0.01) return;

      const cx = W / 2 + m.tx * 30;
      const cy = H * 0.38;

      const flowSpeed = time * 15;
      const flowA = flowSpeed % (spacingA * colsA);
      const flowB = (flowSpeed * 0.7) % (spacingB * colsB);

      const convergeCx = W * 0.38 + m.tx * 80;
      const convergeCy = H * 0.55 + m.ty * 40;

      drawGrid(gridA, colsA, rowsA, time, fade, cx, cy, m.tx, m.ty, flowA, convergeCx, convergeCy, true);
      drawGrid(gridB, colsB, rowsB, time, fade, cx, cy, m.tx, m.ty, flowB, convergeCx, convergeCy, false);

      // Convergence zone accent glow
      const gradient = ctx.createRadialGradient(convergeCx, convergeCy, 0, convergeCx, convergeCy, 180);
      gradient.addColorStop(0, `rgba(200, 65, 43, ${0.04 * fade})`);
      gradient.addColorStop(0.5, `rgba(200, 65, 43, ${0.015 * fade})`);
      gradient.addColorStop(1, "rgba(200, 65, 43, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    };
    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0, willChange: "transform" }}
      role="img"
      aria-label="Decorative animated grid background"
    />
  );
}
