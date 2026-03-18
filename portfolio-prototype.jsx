import { useState, useEffect, useRef, useCallback } from "react";

// Shared projection utility
const project = (x, y, z, cx, cy, fov = 500) => {
  const scale = fov / (fov + z);
  return { x: x * scale + cx, y: y * scale + cy, s: scale };
};

// ========== HERO CANVAS ==========
// Two grid systems converging with forward momentum:
// Grid A (left): Structured, precise, tight spacing - represents "design strategy"
// Grid B (right): Organic, flowing, wider spacing - represents "technical leadership"
// Where they overlap: lines brighten, geometry sharpens - the "intersection"
// Both flow left-to-right: "moving people forward"
function HeroCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();

    // GRID A: Structured/precise (design strategy)
    const colsA = 35, rowsA = 30, spacingA = 16;
    const gridA = [];
    for (let r = 0; r < rowsA; r++) {
      gridA[r] = [];
      for (let c = 0; c < colsA; c++) {
        gridA[r][c] = {
          ox: (c - colsA / 2) * spacingA - 120, // offset left
          oz: (r - rowsA / 2) * spacingA,
          y: 0
        };
      }
    }

    // GRID B: Organic/flowing (technical leadership)
    const colsB = 28, rowsB = 24, spacingB = 22;
    const gridB = [];
    for (let r = 0; r < rowsB; r++) {
      gridB[r] = [];
      for (let c = 0; c < colsB; c++) {
        gridB[r][c] = {
          ox: (c - colsB / 2) * spacingB + 120, // offset right
          oz: (r - rowsB / 2) * spacingB,
          y: 0
        };
      }
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);

    // Helper: draw a grid with per-segment alpha based on convergence zone
    const drawGrid = (grid, cols, rows, time, fade, cx, cy, mx, my, flowOffset, waveStyle, convergeCx, convergeCy, isGridA) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          // Apply forward flow (left to right drift)
          const flowX = p.ox + flowOffset;

          if (isGridA) {
            // Grid A: structured, geometric waves - clean sine patterns
            const wave = Math.sin(flowX * 0.02 - time * 1.2) * 25;
            const cross = Math.cos(p.oz * 0.025 + time * 0.4) * 12;
            p.y = (wave + cross) * fade;
          } else {
            // Grid B: organic, flowing - layered, slower, more chaotic
            const dx = flowX - mx * 200;
            const dz = p.oz - my * 200;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const ripple = Math.sin(dist * 0.012 - time * 0.8) * 35;
            const noise = Math.sin(flowX * 0.008 + time * 0.3) * Math.cos(p.oz * 0.012 + time * 0.5) * 18;
            p.y = (ripple + noise) * fade;
          }
        }
      }

      // Draw row lines with convergence-aware alpha
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, p.y, p.oz + 200, cx, cy);

          // Distance from convergence zone center
          const cdx = pr.x - convergeCx;
          const cdy = pr.y - convergeCy;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          const convergeRadius = 250;
          const inZone = Math.max(0, 1 - cDist / convergeRadius);

          if (!started) {
            ctx.moveTo(pr.x, pr.y);
            started = true;
          } else {
            ctx.lineTo(pr.x, pr.y);
          }
        }
        // Base alpha + brightening in convergence zone
        const baseAlpha = isGridA ? 0.06 : 0.045;
        // We'll draw at a middle alpha; convergence glow drawn separately
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

      // Convergence glow: redraw segments near the convergence zone brighter
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

      // Forward flow: both grids drift left-to-right over time
      const flowSpeed = time * 15;
      const flowA = (flowSpeed % (spacingA * colsA));
      const flowB = (flowSpeed * 0.7 % (spacingB * colsB));

      // Convergence point: influenced by mouse, biased toward center-left
      // (near where the name text sits)
      const convergeCx = W * 0.38 + m.tx * 80;
      const convergeCy = H * 0.55 + m.ty * 40;

      // Draw Grid A (structured, from left)
      drawGrid(gridA, colsA, rowsA, time, fade, cx, cy, m.tx, m.ty, flowA, "structured", convergeCx, convergeCy, true);

      // Draw Grid B (organic, from right)
      drawGrid(gridB, colsB, rowsB, time, fade, cx, cy, m.tx, m.ty, flowB, "organic", convergeCx, convergeCy, false);

      // Convergence zone accent: a subtle radial glow at the intersection point
      const gradient = ctx.createRadialGradient(convergeCx, convergeCy, 0, convergeCx, convergeCy, 180);
      gradient.addColorStop(0, `rgba(200, 65, 43, ${0.04 * fade})`);
      gradient.addColorStop(0.5, `rgba(200, 65, 43, ${0.015 * fade})`);
      gradient.addColorStop(1, "rgba(200, 65, 43, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    };
    draw();

    const onResize = () => { resize(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

// ========== GITHUB ANIMATED CONTRIBUTION GRID ==========
// Flat 52x7 grid (instantly recognizable) with a ripple wave
// that passes through the cells, modulating brightness.
// Same red accent palette, mouse-reactive wave origin like the hero.
function GitHubGrid() {
  const wrapRef = useRef(null);
  const mouseRef = useRef({ x: 26, y: 3.5 }); // center
  const [cells, setCells] = useState([]);
  const animRef = useRef(null);
  const cellRefs = useRef([]);

  // Generate contribution data once
  const contribsRef = useRef(null);
  if (!contribsRef.current) {
    const weeks = 52, days = 7;
    const data = [];
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const base = Math.random();
        const weekday = (d >= 1 && d <= 5) ? 0.2 : 0;
        const burst = Math.sin(w * 0.4) > 0.6 ? 0.4 : 0;
        const recent = w > 38 ? 0.15 : 0;
        let val = Math.min(1, Math.max(0, base * 0.5 + weekday + burst + recent - 0.25));
        if (val < 0.05) val = 0;
        // Map to 0-4 levels like GitHub
        let level = 0;
        if (val > 0.05) level = 1;
        if (val > 0.3) level = 2;
        if (val > 0.55) level = 3;
        if (val > 0.75) level = 4;
        data.push({ w, d, level, val });
      }
    }
    contribsRef.current = data;
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMouse = (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 52;
      const y = ((e.clientY - rect.top) / rect.height) * 7;
      mouseRef.current = { x, y };
    };
    const onLeave = () => { mouseRef.current = { x: 26, y: 3.5 }; };
    wrap.addEventListener("mousemove", onMouse);
    wrap.addEventListener("mouseleave", onLeave);

    const els = cellRefs.current;
    const data = contribsRef.current;

    // Color levels using the accent red palette
    const colors = [
      [245, 242, 237],   // L0: bg
      [228, 195, 188],   // L1: lightest red
      [210, 140, 125],   // L2: medium
      [200, 85, 60],     // L3: strong
      [200, 65, 43],     // L4: accent
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

        // Distance from mouse position on grid
        const dx = w - mx;
        const dy = d - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Ripple wave from mouse, like the hero grid
        const wave = Math.sin(dist * 0.5 - time) * 0.5 + 0.5; // 0-1
        const boost = 0.7 + wave * 0.3; // subtle brightness modulation

        const c = colors[level];
        const r = Math.round(Math.min(255, c[0] * boost));
        const g = Math.round(Math.min(255, c[1] * boost));
        const b = Math.round(Math.min(255, c[2] * boost));

        // Slight scale pulse on high-activity cells
        const scalePulse = level >= 3 ? 1 + wave * 0.08 : 1;

        el.style.backgroundColor = `rgb(${r},${g},${b})`;
        el.style.transform = `scale(${scalePulse})`;

        // Border glow on highest cells when wave peaks
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
  }, []);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels = ["","Mon","","Wed","","Fri",""];
  const data = contribsRef.current;

  return (
    <div ref={wrapRef} style={{ marginBottom: 20, cursor: "default" }}>
      {/* Month labels */}
      <div style={{ display: "flex", paddingLeft: 32, marginBottom: 6 }}>
        {months.map((m, i) => (
          <span key={i} style={{
            fontFamily: "'Inter Tight', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 9,
            fontWeight: 500,
            color: "#6B6560",
            letterSpacing: "0.05em",
            width: `${100/12}%`,
            textAlign: "left"
          }}>{m}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 6, width: 28, flexShrink: 0 }}>
          {dayLabels.map((label, i) => (
            <span key={i} style={{
              fontFamily: "'Inter Tight', 'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 9,
              color: "#6B6560",
              height: "calc((100% - 12px) / 7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              letterSpacing: "0.02em"
            }}>{label}</span>
          ))}
        </div>
        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 1fr)",
          gridTemplateColumns: "repeat(52, 1fr)",
          gridAutoFlow: "column",
          gap: 2,
          flex: 1,
          aspectRatio: "52/7"
        }}>
          {data.map((cell, i) => (
            <div
              key={i}
              ref={el => cellRefs.current[i] = el}
              style={{
                borderRadius: 2,
                backgroundColor: "#F5F2ED",
                transition: "box-shadow 0.3s",
                willChange: "background-color, transform"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== SCROLL REVEAL WRAPPER ==========
function Reveal({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)"
    }}>
      {children}
    </div>
  );
}

// ========== MAIN APP ==========
const mono = "'Inter Tight', 'Helvetica Neue', Helvetica, sans-serif"; // unified — same face, styled via weight/spacing
const sans = "'Inter Tight', 'Helvetica Neue', Helvetica, sans-serif";
const accent = "#C8412B";
const fg = "#1A1A1A";
const fgSec = "#6B6560";
const border = "#D4CFC8";
const bg = "#F5F2ED";
const cardBg = "#FFFEF9";
const pagePad = "clamp(20px, 5vw, 80px)";

const SectionLabel = ({ label, num }) => (
  <Reveal style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: fgSec, marginBottom: 48, paddingBottom: 16, borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span>{label}</span>
    <span style={{ color: accent }}>{num}</span>
  </Reveal>
);

const experience = [
  { role: "VP, Digital", company: "Allison Worldwide", url: "https://www.allisonworldwide.com/", date: "2024 \u2013 2026" },
  { role: "Digital Director", company: "Allison Worldwide", url: "https://www.allisonworldwide.com/", date: "2018 \u2013 2024" },
  { role: "Sr. Interactive Producer", company: "PRR", url: "https://www.prrbiz.com/", date: "2016 \u2013 2018" },
  { role: "Sr. Producer & Co-Founder", company: "Creation-1 Interactive", url: "https://c1studios.com/int/", date: "2006 \u2013 2016" },
  { role: "Digital Archivist", company: "Mark Seliger Photography", url: "https://markseliger.com/", date: "2006 \u2013 2007" },
];

const clients = ["Toyota North America","US Fire Administration","US EPA","Lexus","Sound Transit","Cond\u00e9 Nast","Vanity Fair","Getty Images","CAA","Toyota Connected","Toyota AMRD","Dexcom"];

const categories = ["All", "Case Studies", "Work in Progress", "Experiments", "Personal Projects"];

const workPosts = [
  { title: "NERIS: Modernizing Fire Data for 2,900+ Departments", desc: "Led the GTM and onboarding UX for the US Fire Administration\u2019s national fire information platform, resulting in adoption across thousands of departments.", date: "11-13-24", categories: ["Case Studies"] },
  { title: "Toyota Newsroom CMS", desc: "Custom content management system that cut lead time for new press content by 50%.", date: "08-22-24", categories: ["Case Studies"] },
  { title: "EPA Water Resilience Tool", desc: "Digital training platform that expanded national access to utility training while cutting federal costs.", date: "03-15-17", categories: ["Case Studies"] },
  { title: "Sound Transit Light Rail Microsites", desc: "Multi-language public engagement platforms with scalable design systems serving diverse communities.", date: "06-04-17", categories: ["Case Studies"] },
  { title: "AI-Powered Content Workflow Prototype", desc: "Exploring how large language models can streamline editorial review cycles for enterprise press teams.", date: "01-28-25", categories: ["Experiments", "Work in Progress"] },
  { title: "Personal Portfolio Site", desc: "Designing and building this site with Next.js, Sanity, and React Three Fiber. Swiss design meets interactive 3D.", date: "02-10-25", categories: ["Personal Projects", "Work in Progress"] },
  { title: "Design System Audit Framework", desc: "A reusable methodology for evaluating and scoring component library maturity across distributed teams.", date: "09-05-24", categories: ["Experiments", "Case Studies"] },
  { title: "Interactive Data Storytelling Toolkit", desc: "Prototyping a lightweight library for narrative-driven data visualizations in public engagement contexts.", date: "03-01-25", categories: ["Experiments"] },
  { title: "Accessible Wayfinding for Transit", desc: "Research and prototyping for inclusive digital wayfinding tools supporting multilingual transit riders.", date: "07-19-23", categories: ["Personal Projects", "Case Studies"] },
  { title: "Claude Code Publishing Workflow", desc: "Building an AI-assisted content pipeline that publishes directly to a headless CMS from the command line.", date: "02-25-25", categories: ["Experiments", "Personal Projects"] },
];

export default function Portfolio() {
  const [hoveredExp, setHoveredExp] = useState(null);
  const [hoveredClient, setHoveredClient] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <div style={{ fontFamily: sans, background: bg, color: fg, lineHeight: 1.6, WebkitFontSmoothing: "antialiased", overflowX: "hidden", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: `24px ${pagePad}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(245, 242, 237, 0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", color: fg, textTransform: "uppercase" }}>Justin Parra</div>
        <div style={{ display: "flex", gap: 32 }}>
          {["About","Experience","Work","Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: fg, textDecoration: "none", opacity: 0.6 }}>{s}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "80vh", minHeight: 560, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: pagePad, paddingBottom: "clamp(40px, 6vh, 80px)", overflow: "hidden" }}>
        <HeroCanvas />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: fgSec, marginBottom: 20, animation: "fadeUp 0.8s ease 0.3s both" }}>UX Leader & Digital Strategist, Seattle, WA</div>
          <h1 style={{ fontFamily: sans, fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, animation: "fadeUp 0.8s ease 0.5s both" }}>
            <strong style={{ fontWeight: 500 }}>Justin Parra</strong><br/>Building digital experiences<br/>that move people forward.
          </h1>
          <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 300, color: fgSec, maxWidth: 560, lineHeight: 1.6, animation: "fadeUp 0.8s ease 0.7s both" }}>18+ years leading design, development, and strategy teams across private and public sectors. From Toyota to the US EPA.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <SectionLabel label="About" num="01" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 100px)", alignItems: "start" }}>
          <Reveal>
            <div style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 300, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
              I simplify the complex. My work lives at the intersection of <em style={{ fontStyle: "italic", color: accent }}>design strategy</em>, <em style={{ fontStyle: "italic", color: accent }}>technical leadership</em>, and <em style={{ fontStyle: "italic", color: accent }}>user advocacy</em>, translating business goals into intuitive digital products.
            </div>
          </Reveal>
          <Reveal>
            <p style={{ fontSize: 15, color: fgSec, marginBottom: 20, lineHeight: 1.7 }}>With early career roots in web development, I bring a rare blend of creative and technical fluency to every project.</p>
            <p style={{ fontSize: 15, color: fgSec, marginBottom: 20, lineHeight: 1.7 }}>I've led cross-functional teams to ship apps, VR experiences, websites, analytics dashboards, and public engagement tools for clients ranging from Toyota North America to the US Fire Administration.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40, paddingTop: 32, borderTop: `1px solid ${border}` }}>
              <div><span style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}>18+</span><br/><span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: fgSec }}>Years Experience</span></div>
              <div><span style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}>100+</span><br/><span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: fgSec }}>Projects Shipped</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CURRENTLY SEEKING */}
      <section style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <SectionLabel label="Currently Seeking" num="02" />
        <Reveal>
          <div style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 300, lineHeight: 1.6, letterSpacing: "-0.01em", maxWidth: 700 }}>
            Positions in the field of <span style={{ fontWeight: 500 }}>Digital Product Management</span>, <span style={{ fontWeight: 500 }}>UX Program Management</span>, <span style={{ fontWeight: 500 }}>Digital Strategy</span>, <span style={{ fontWeight: 500 }}>AI Enablement</span>, and <span style={{ fontWeight: 500 }}>Creative Services Production</span>. Currently in Seattle, but open to move to San Francisco or Chicago.
          </div>
        </Reveal>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <SectionLabel label="Experience" num="03" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {experience.map((e, i) => (
            <Reveal key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 32, padding: "32px 0", borderBottom: `1px solid ${border}`, borderTop: i === 0 ? `1px solid ${border}` : "none", alignItems: "baseline", background: hoveredExp === i ? "rgba(200,65,43,0.03)" : "transparent", transition: "background 0.3s", cursor: "default" }} onMouseEnter={() => setHoveredExp(i)} onMouseLeave={() => setHoveredExp(null)}>
              <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>{e.role}</span>
              <span style={{ fontSize: 15, color: fgSec }}>{e.url ? <a href={e.url} target="_blank" style={{ color: fgSec, textDecoration: "none", borderBottom: `1px solid ${border}`, transition: "color 0.3s, border-color 0.3s" }} onMouseOver={ev => { ev.target.style.color = accent; ev.target.style.borderColor = accent; }} onMouseOut={ev => { ev.target.style.color = fgSec; ev.target.style.borderColor = border; }}>{e.company}</a> : e.company}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: fgSec, textAlign: "right", letterSpacing: "0.02em" }}>{e.date}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLIENTS */}
      <div style={{ background: fg, color: bg, padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,242,237,0.5)", marginBottom: 48, paddingBottom: 16, borderBottom: "1px solid rgba(245,242,237,0.15)", display: "flex", justifyContent: "space-between" }}>
          <span>Select Clients</span><span style={{ color: accent }}>04</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {clients.map((c, i) => (
            <Reveal key={i} style={{ padding: "20px 0", borderBottom: "1px solid rgba(245,242,237,0.08)", fontSize: 15, fontWeight: 300, color: hoveredClient === i ? bg : "rgba(245,242,237,0.7)", paddingLeft: hoveredClient === i ? 8 : 0, transition: "color 0.3s, padding-left 0.3s", cursor: "default" }} onMouseEnter={() => setHoveredClient(i)} onMouseLeave={() => setHoveredClient(null)}>
              {c}
            </Reveal>
          ))}
        </div>
      </div>

      {/* GITHUB ACTIVITY */}
      <section style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <SectionLabel label="GitHub Activity" num="05" />
        <Reveal style={{ background: cardBg, border: `1px solid ${border}`, padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Contribution Activity</span>
            <a href="https://github.com/justinparra" target="_blank" style={{ fontFamily: mono, fontSize: 11, color: accent, textDecoration: "none", letterSpacing: "0.05em" }}>View Profile &rarr;</a>
          </div>
          <GitHubGrid />
          <div style={{ display: "flex", gap: 32 }}>
            <div><div style={{ fontSize: 20, fontWeight: 300 }}>47</div><div style={{ fontFamily: mono, fontSize: 10, color: fgSec, letterSpacing: "0.08em", textTransform: "uppercase" }}>Contributions this month</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 300 }}>12</div><div style={{ fontFamily: mono, fontSize: 10, color: fgSec, letterSpacing: "0.08em", textTransform: "uppercase" }}>Repositories</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 300 }}>3</div><div style={{ fontFamily: mono, fontSize: 10, color: fgSec, letterSpacing: "0.08em", textTransform: "uppercase" }}>Active Projects</div></div>
          </div>
        </Reveal>
      </section>

      {/* WORK */}
      <section id="work" style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
        <SectionLabel label="Work" num="06" />

        {/* Category Filter Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
          {categories.map(cat => {
            const isActive = activeFilter === cat;
            return (
              <button key={cat} onClick={() => { setActiveFilter(cat); setVisibleCount(5); }} style={{
                fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "8px 16px", border: `1px solid ${isActive ? accent : border}`,
                background: isActive ? accent : "transparent",
                color: isActive ? "#fff" : fgSec,
                cursor: "pointer", transition: "all 0.3s ease",
                borderRadius: 0, outline: "none"
              }}>{cat}</button>
            );
          })}
        </div>

        {/* Filtered Posts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(16px, 2vw, 32px)" }}>
          {(() => {
            const filtered = activeFilter === "All" ? workPosts : workPosts.filter(p => p.categories.includes(activeFilter));
            const visible = filtered.slice(0, visibleCount);
            const hasMore = filtered.length > visibleCount;

            return (
              <>
                {visible.map((post, i) => {
                  const isHovered = hoveredCard === `work-${post.title}`;
                  return (
                    <div key={post.title} style={{
                      background: cardBg,
                      border: `1px solid ${isHovered ? accent : border}`,
                      cursor: "pointer", position: "relative", overflow: "hidden",
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                      boxShadow: isHovered ? "0 20px 60px rgba(0,0,0,0.08)" : "none",
                      opacity: 1,
                      animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                      transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s",
                      display: "flex", flexDirection: "column"
                    }} onMouseEnter={() => setHoveredCard(`work-${post.title}`)} onMouseLeave={() => setHoveredCard(null)}>
                      {/* Image preview */}
                      <div style={{
                        background: "linear-gradient(135deg, #E8E4DF 0%, #D4CFC8 100%)",
                        aspectRatio: "16/9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: mono, fontSize: 11, color: fgSec,
                        letterSpacing: "0.1em", textTransform: "uppercase"
                      }}>Project Image</div>
                      <div style={{ padding: 32 }}>
                        {/* Multi-category tags */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          {post.categories.map(cat => (
                            <span key={cat} style={{
                              fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                              color: accent, padding: "3px 8px", border: `1px solid rgba(200,65,43,0.2)`,
                              background: "rgba(200,65,43,0.04)", lineHeight: 1.4
                            }}>{cat}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 12 }}>{post.title}</div>
                        <div style={{ fontSize: 14, color: fgSec, lineHeight: 1.6, marginBottom: 24 }}>{post.desc}</div>
                        <div style={{ fontFamily: mono, fontSize: 11, color: fgSec, letterSpacing: "0.02em" }}>{post.date}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Load More Button */}
                {hasMore && (
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", paddingTop: 16 }}>
                    <button onClick={() => setVisibleCount(v => v + 5)} style={{
                      fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "14px 40px", border: `1px solid ${border}`, background: "transparent",
                      color: fg, cursor: "pointer", transition: "all 0.3s ease", outline: "none"
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = accent; e.target.style.color = accent; }}
                    onMouseLeave={e => { e.target.style.borderColor = border; e.target.style.color = fg; }}
                    >Load More</button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ textAlign: "center", padding: `clamp(80px, 15vh, 160px) ${pagePad}` }}>
        <Reveal><h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 24 }}>Let's build something<br/>worth using.</h2></Reveal>
        <Reveal><p style={{ fontSize: 16, color: fgSec, marginBottom: 40 }}>Currently open to new opportunities in UX leadership and digital strategy.</p></Reveal>
        <Reveal style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          {[["Email","mailto:justinparra206@gmail.com"],["LinkedIn","https://www.linkedin.com/in/justin-parra/"],["GitHub","https://github.com/justinparra"]].map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: fg, textDecoration: "none", paddingBottom: 4, borderBottom: `1px solid ${accent}` }}>{label}</a>
          ))}
        </Reveal>
      </section>

      <footer style={{ padding: `32px ${pagePad}`, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${border}` }}>
        <span style={{ fontFamily: mono, fontSize: 11, color: fgSec, letterSpacing: "0.05em" }}>&copy; 2026 Justin Parra</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: fgSec, letterSpacing: "0.05em" }}>Seattle, WA</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${accent}; color: white; }
      `}</style>
    </div>
  );
}
