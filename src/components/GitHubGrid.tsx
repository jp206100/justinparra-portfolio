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

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  intensity: number;
  label: string;
  count: number;
}

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

    // Build nodes from activity data
    const nodes: Node[] = [];
    const days = activityDays ?? [];
    const maxCount = Math.max(1, ...days.map((d) => d.count));

    if (days.length > 0) {
      // Place activity nodes in a flowing constellation
      const count = Math.min(days.length, 30);
      for (let i = 0; i < count; i++) {
        const day = days[i];
        const intensity = day.count / maxCount;
        // Distribute nodes in an organic arc pattern
        const t = i / Math.max(1, count - 1);
        const row = Math.floor(i / 8);
        const col = i % 8;
        const xSpread = 0.12 + col * 0.1 + (row % 2) * 0.05;
        const ySpread = 0.2 + row * 0.22 + Math.sin(i * 1.2) * 0.08;
        nodes.push({
          x: xSpread,
          y: ySpread,
          baseX: xSpread,
          baseY: ySpread,
          radius: 2 + intensity * 5,
          intensity,
          label: day.date.slice(5), // MM-DD
          count: day.count,
        });
      }
    } else {
      // Placeholder nodes while loading
      for (let i = 0; i < 12; i++) {
        const t = i / 11;
        nodes.push({
          x: 0.1 + t * 0.8,
          y: 0.4 + Math.sin(t * Math.PI * 2) * 0.2,
          baseX: 0.1 + t * 0.8,
          baseY: 0.4 + Math.sin(t * Math.PI * 2) * 0.2,
          radius: 3,
          intensity: 0,
          label: "",
          count: 0,
        });
      }
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const time = Date.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Animate node positions with gentle float
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const floatX = Math.sin(time * 0.5 + i * 0.8) * 0.008;
        const floatY = Math.cos(time * 0.4 + i * 1.1) * 0.01;
        n.x = n.baseX + floatX;
        n.y = n.baseY + floatY;

        // Mouse repulsion
        if (mouseRef.current.active) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const force = (0.15 - dist) * 0.3;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }
      }

      // Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * W;
          const dy = (a.y - b.y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            const avgIntensity = (a.intensity + b.intensity) / 2;
            const wave = Math.sin(time * 1.5 - dist * 0.02) * 0.5 + 0.5;

            // Flowing pulse along the connection
            const pulseAlpha = alpha * (0.5 + wave * 0.5);

            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.strokeStyle =
              avgIntensity > 0.3
                ? `rgba(200, 65, 43, ${pulseAlpha})`
                : `rgba(180, 170, 160, ${pulseAlpha * 0.6})`;
            ctx.lineWidth = 0.5 + avgIntensity * 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const px = n.x * W;
        const py = n.y * H;
        const wave = Math.sin(time * 2 + i * 0.9) * 0.5 + 0.5;

        // Outer glow for active nodes
        if (n.intensity > 0.2) {
          const glowRadius = n.radius + 6 + wave * 4;
          const glow = ctx.createRadialGradient(
            px, py, 0,
            px, py, glowRadius
          );
          glow.addColorStop(0, `rgba(200, 65, 43, ${n.intensity * 0.15})`);
          glow.addColorStop(1, "rgba(200, 65, 43, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        const pulseScale = 1 + wave * 0.15 * n.intensity;
        const r = n.radius * pulseScale;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);

        if (n.intensity > 0) {
          // Active: accent color gradient based on intensity
          const fillAlpha = 0.3 + n.intensity * 0.7;
          ctx.fillStyle = `rgba(200, 65, 43, ${fillAlpha})`;
        } else {
          ctx.fillStyle = "rgba(212, 207, 200, 0.3)";
        }
        ctx.fill();

        // Bright center dot
        if (n.intensity > 0.1) {
          ctx.beginPath();
          ctx.arc(px, py, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 65, 43, ${0.5 + wave * 0.5})`;
          ctx.fill();
        }
      }

      // Mouse convergence glow (matching hero style)
      if (mouseRef.current.active) {
        const gradient = ctx.createRadialGradient(
          mx * W, my * H, 0,
          mx * W, my * H, 100
        );
        gradient.addColorStop(0, "rgba(200, 65, 43, 0.04)");
        gradient.addColorStop(0.5, "rgba(200, 65, 43, 0.015)");
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
        height: 200,
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
