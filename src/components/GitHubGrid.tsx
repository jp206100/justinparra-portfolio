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

export default function GitHubGrid({ activityDays }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1, active: false });
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

    /* ── Prepare bar data ────────────────────────────────── */
    const rawDays = activityDays ?? [];
    const maxCount = Math.max(1, ...rawDays.map((d) => d.count));

    // Take the last 60 days that had activity, oldest on left
    const bars = [...rawDays].slice(0, 60).reverse();

    /* ── Mouse handling ──────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("mousemove", onMouse, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    /* ── Animation loop ──────────────────────────────────── */
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      if (bars.length === 0) return;

      const time = Date.now() * 0.001;
      const mx = mouseRef.current.x;

      // Layout
      const padLeft = 40;
      const padRight = 20;
      const padTop = 16;
      const padBottom = 36;
      const chartW = W - padLeft - padRight;
      const chartH = H - padTop - padBottom;
      const barCount = bars.length;
      const gap = Math.max(2, Math.min(6, chartW / barCount * 0.25));
      const barW = Math.max(3, (chartW - gap * (barCount - 1)) / barCount);
      const baseY = padTop + chartH; // bottom of chart area

      // ── Background grid lines (horizontal, subtle, with gentle wave) ──
      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const yFrac = i / gridLines;
        const y = padTop + yFrac * chartH;
        ctx.beginPath();
        for (let px = padLeft; px <= padLeft + chartW; px += 2) {
          const wave = Math.sin(px * 0.015 + time * 0.6) * 1.5 * (1 - yFrac);
          const py = y + wave;
          px === padLeft ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(200, 65, 43, 0.04)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Draw bars ──
      const hoveredBar = mouseRef.current.active
        ? Math.floor((mx * W - padLeft + gap / 2) / (barW + gap))
        : -1;

      for (let i = 0; i < barCount; i++) {
        const day = bars[i];
        const intensity = day.count / maxCount;
        const x = padLeft + i * (barW + gap);

        // Animated height: breathing pulse — stronger on shorter bars so they're visible
        const pulseStrength = intensity > 0 ? 0.08 - intensity * 0.05 : 0;
        const breathe = 1 + Math.sin(time * 1.8 + i * 0.5) * pulseStrength;
        const targetH = intensity * chartH * 0.85 * breathe;
        const barH = Math.max(2, targetH); // minimum 2px for zero-activity days

        const isHovered = i === hoveredBar;

        // Bar glow (radial gradient behind bar for active days)
        if (intensity > 0.15) {
          const glowH = barH + 20;
          const glowAlpha = intensity * 0.12 + (isHovered ? 0.08 : 0);
          const glow = ctx.createRadialGradient(
            x + barW / 2,
            baseY - barH / 2,
            0,
            x + barW / 2,
            baseY - barH / 2,
            glowH
          );
          glow.addColorStop(0, `rgba(200, 65, 43, ${glowAlpha})`);
          glow.addColorStop(1, "rgba(200, 65, 43, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(
            x - 10,
            baseY - barH - 20,
            barW + 20,
            barH + 40
          );
        }

        // Bar fill — gradient from bottom to top
        const barGrad = ctx.createLinearGradient(0, baseY, 0, baseY - barH);
        if (intensity > 0) {
          const baseAlpha = 0.25 + intensity * 0.55 + (isHovered ? 0.15 : 0);
          const tipAlpha = 0.4 + intensity * 0.6 + (isHovered ? 0.15 : 0);
          barGrad.addColorStop(0, `rgba(200, 65, 43, ${baseAlpha * 0.4})`);
          barGrad.addColorStop(0.7, `rgba(200, 65, 43, ${baseAlpha})`);
          barGrad.addColorStop(1, `rgba(200, 65, 43, ${tipAlpha})`);
        } else {
          barGrad.addColorStop(0, "rgba(212, 207, 200, 0.1)");
          barGrad.addColorStop(1, "rgba(212, 207, 200, 0.2)");
        }

        ctx.fillStyle = barGrad;
        // Rounded top corners
        const radius = Math.min(barW / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, baseY - barH + radius);
        ctx.quadraticCurveTo(x, baseY - barH, x + radius, baseY - barH);
        ctx.lineTo(x + barW - radius, baseY - barH);
        ctx.quadraticCurveTo(
          x + barW,
          baseY - barH,
          x + barW,
          baseY - barH + radius
        );
        ctx.lineTo(x + barW, baseY);
        ctx.closePath();
        ctx.fill();

        // Bright cap line at top of bar
        if (intensity > 0.1) {
          const capAlpha = 0.5 + intensity * 0.5;
          ctx.fillStyle = `rgba(200, 65, 43, ${capAlpha})`;
          ctx.fillRect(x, baseY - barH, barW, 1.5);
        }

        // ── Hover tooltip ──
        if (isHovered && i >= 0 && i < barCount) {
          const dateStr = day.date.slice(5); // MM-DD
          const label = `${dateStr}  ${day.count} event${day.count !== 1 ? "s" : ""}`;
          ctx.font = "10px 'Inter Tight', sans-serif";
          const textW = ctx.measureText(label).width;
          const tipX = Math.min(
            Math.max(x + barW / 2 - textW / 2 - 6, 4),
            W - textW - 16
          );
          const tipY = baseY - barH - 22;

          // Tooltip background
          ctx.fillStyle = "rgba(26, 26, 26, 0.85)";
          const tipPad = 6;
          const tipW = textW + tipPad * 2;
          const tipH = 18;
          const tipR = 3;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(tipX, tipY, tipW, tipH, tipR);
          } else {
            // Fallback for browsers without roundRect support
            ctx.moveTo(tipX + tipR, tipY);
            ctx.lineTo(tipX + tipW - tipR, tipY);
            ctx.quadraticCurveTo(tipX + tipW, tipY, tipX + tipW, tipY + tipR);
            ctx.lineTo(tipX + tipW, tipY + tipH - tipR);
            ctx.quadraticCurveTo(tipX + tipW, tipY + tipH, tipX + tipW - tipR, tipY + tipH);
            ctx.lineTo(tipX + tipR, tipY + tipH);
            ctx.quadraticCurveTo(tipX, tipY + tipH, tipX, tipY + tipH - tipR);
            ctx.lineTo(tipX, tipY + tipR);
            ctx.quadraticCurveTo(tipX, tipY, tipX + tipR, tipY);
            ctx.closePath();
          }
          ctx.fill();

          // Tooltip text
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.textAlign = "left";
          ctx.fillText(label, tipX + tipPad, tipY + 13);
        }
      }

      // ── Flowing wave line connecting bar tops (visual connection to hero) ──
      ctx.beginPath();
      for (let i = 0; i < barCount; i++) {
        const intensity = bars[i].count / maxCount;
        const x = padLeft + i * (barW + gap) + barW / 2;
        const ps = intensity > 0 ? 0.08 - intensity * 0.05 : 0;
        const breathe = 1 + Math.sin(time * 1.8 + i * 0.5) * ps;
        const barH = Math.max(2, intensity * chartH * 0.85 * breathe);
        const y = baseY - barH;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Smooth curve through bar tops
          const prevIntensity = bars[i - 1].count / maxCount;
          const prevPs = prevIntensity > 0 ? 0.08 - prevIntensity * 0.05 : 0;
          const prevBreathe =
            1 +
            Math.sin(time * 1.8 + (i - 1) * 0.5) * prevPs;
          const prevBarH = Math.max(
            2,
            prevIntensity * chartH * 0.85 * prevBreathe
          );
          const prevX =
            padLeft + (i - 1) * (barW + gap) + barW / 2;
          const prevY = baseY - prevBarH;
          const cpX = (prevX + x) / 2;
          ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
      }
      // Flowing wave pulse along the line
      const waveAlpha = 0.08 + Math.sin(time * 1.2) * 0.03;
      ctx.strokeStyle = `rgba(200, 65, 43, ${waveAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Date labels along the bottom ──
      ctx.font = "9px 'Inter Tight', sans-serif";
      ctx.textAlign = "center";
      const labelInterval = Math.max(1, Math.floor(barCount / 7));
      for (let i = 0; i < barCount; i += labelInterval) {
        const x = padLeft + i * (barW + gap) + barW / 2;
        const dateStr = bars[i].date.slice(5);
        ctx.fillStyle = "rgba(107, 101, 96, 0.5)";
        ctx.fillText(dateStr, x, baseY + 16);
      }
      // Always label the last bar
      if (barCount > 1) {
        const lastX =
          padLeft + (barCount - 1) * (barW + gap) + barW / 2;
        ctx.fillStyle = "rgba(107, 101, 96, 0.5)";
        ctx.fillText(bars[barCount - 1].date.slice(5), lastX, baseY + 16);
      }

      // ── Mouse convergence glow (matching hero style) ──
      if (mouseRef.current.active) {
        const gx = mx * W;
        const gy = mouseRef.current.y * H;
        const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, 120);
        gradient.addColorStop(0, "rgba(200, 65, 43, 0.035)");
        gradient.addColorStop(0.5, "rgba(200, 65, 43, 0.012)");
        gradient.addColorStop(1, "rgba(200, 65, 43, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
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
        height: 220,
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
          touchAction: "pan-y",
        }}
      />
    </div>
  );
}
