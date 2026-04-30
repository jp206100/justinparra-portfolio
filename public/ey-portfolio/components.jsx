/* global React */
const { useEffect, useRef, useState } = React;

/* ============================================
   CurtainCanvas — animated grid backdrop
   Ported from the home-page Hero canvas on justinparra.com so the
   curtain has gentle motion while the Zoom audience waits.
   ============================================ */
function CurtainCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId;

    const project = (x, y, z, cx, cy, fov) => {
      const f = fov || 500;
      const scale = f / (f + z);
      return { x: x * scale + cx, y: y * scale + cy, s: scale };
    };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();

    const colsA = 35, rowsA = 30, spacingA = 16;
    const gridA = [];
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

    const colsB = 28, rowsB = 24, spacingB = 22;
    const gridB = [];
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

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    if (!prefersReduced) {
      document.addEventListener("mousemove", onMouse, { passive: true });
    }

    const drawGrid = (
      grid, cols, rows, time, fade, cx, cy, mx, my,
      flowOffset, convergeCx, convergeCy, isGridA
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
              Math.cos(p.oz * 0.012 + time * 0.5) * 18;
            p.y = (ripple + noise) * fade;
          }
        }
      }

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
        ctx.strokeStyle = "rgba(10, 10, 10, " + (baseAlpha * fade) + ")";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = grid[r][c];
          const flowX = p.ox + flowOffset;
          const pr = project(flowX, p.y, p.oz + 200, cx, cy);
          if (r === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }
        const baseAlpha = isGridA ? 0.06 : 0.045;
        ctx.strokeStyle = "rgba(10, 10, 10, " + (baseAlpha * fade) + ")";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

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
            const glowAlpha = inZone * 0.32 * fade;
            ctx.strokeStyle = "rgba(232, 194, 0, " + glowAlpha + ")";
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
      if (!prefersReduced) {
        animId = requestAnimationFrame(draw);
      }
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const m = mouseRef.current;
      m.tx += (m.x - m.tx) * 0.04;
      m.ty += (m.y - m.ty) * 0.04;

      const time = Date.now() * 0.0008;
      const fade = 1;

      const cx = W / 2 + m.tx * 30;
      const cy = H * 0.5;

      const flowSpeed = time * 15;
      const flowA = flowSpeed % (spacingA * colsA);
      const flowB = (flowSpeed * 0.7) % (spacingB * colsB);

      const convergeCx = W * 0.5 + m.tx * 80;
      const convergeCy = H * 0.55 + m.ty * 40;

      drawGrid(gridA, colsA, rowsA, time, fade, cx, cy, m.tx, m.ty, flowA, convergeCx, convergeCy, true);
      drawGrid(gridB, colsB, rowsB, time, fade, cx, cy, m.tx, m.ty, flowB, convergeCx, convergeCy, false);

      const gradient = ctx.createRadialGradient(convergeCx, convergeCy, 0, convergeCx, convergeCy, 220);
      gradient.addColorStop(0, "rgba(255, 230, 0, " + (0.06 * fade) + ")");
      gradient.addColorStop(0.5, "rgba(255, 230, 0, " + (0.02 * fade) + ")");
      gradient.addColorStop(1, "rgba(255, 230, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    };
    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="intro-curtain__canvas"
      aria-hidden="true"
    />
  );
}

/* ============================================
   IntroCurtain — page-load animation
   ============================================ */
function IntroCurtain() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (gone) return null;

  const handleStart = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setGone(true), 1100);
  };

  return (
    <div className={"intro-curtain" + (leaving ? " is-leaving" : "")}>
      <CurtainCanvas />
      <div className="intro-curtain__bar"></div>
      <div className="intro-curtain__inner">
        <div className="intro-curtain__name">
          <span>Justin</span>{" "}<span>Parra</span>
        </div>
        <div className="intro-curtain__sub">UX + AI Portfolio &nbsp;·&nbsp; 2026</div>
        <button
          type="button"
          className="intro-curtain__start"
          onClick={handleStart}
          aria-label="Start presentation"
        >
          <span className="intro-curtain__start-label">Start</span>
          <span className="intro-curtain__start-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================
   useReveal — IntersectionObserver hook
   ============================================ */
function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js-reveal-ready");
    const els = document.querySelectorAll(".reveal, .word-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ============================================
   WordReveal — splits into words with stagger
   ============================================ */
function WordReveal({ children, delay = 0, className = "" }) {
  const text = children;
  // accept array of {text, italic?, accent?} OR plain string
  const tokens = typeof text === "string"
    ? text.split(" ").map(w => ({ text: w }))
    : text;

  return (
    <span className={className}>
      {tokens.map((tok, i) => (
        <React.Fragment key={i}>
          <span
            className="word-reveal"
            style={{ transitionDelay: `${delay + i * 0.06}s` }}
          >
            <span
              className="word-reveal__inner"
              style={{
                fontStyle: tok.italic ? "italic" : undefined,
                transitionDelay: `${delay + i * 0.06}s`,
              }}
            >
              {tok.accent
                ? <span className="ink-accent">{tok.text}</span>
                : tok.text}
            </span>
          </span>
          {i < tokens.length - 1 && " "}
        </React.Fragment>
      ))}
    </span>
  );
}

/* ============================================
   TopNav
   ============================================ */
function TopNav() {
  const [onDark, setOnDark] = useState(false);
  useEffect(() => {
    const phil = document.getElementById("philosophy");
    if (!phil) return;
    let io;
    const setup = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver(
        ([entry]) => setOnDark(entry.isIntersecting),
        { rootMargin: `-80px 0px -${Math.max(0, window.innerHeight - 81)}px 0px` }
      );
      io.observe(phil);
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      if (io) io.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);
  return (
    <nav className={"topnav" + (onDark ? " is-on-dark" : "")}>
      <div className="topnav__wordmark">
        Justin Parra<span className="dot"></span>
      </div>
      <div className="topnav__meta">
        <span><span className="topnav__pulse"></span>Prepared for EY Studio+</span>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}

/* ============================================
   Hero
   ============================================ */
function Hero() {
  const heroRef = React.useRef(null);
  React.useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-paused", !entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__eyebrow reveal">
        <span>Portfolio &nbsp;/&nbsp; 2026</span>
      </div>

      <h1 className="hero__statement">
        <WordReveal>
          {[
            { text: "I'm" },
            { text: "Justin." },
            { text: "A", italic: true },
            { text: "UX", italic: true },
            { text: "Director", italic: true },
            { text: "and", italic: true },
            { text: "strategist", italic: true },
            { text: "who" },
            { text: "specializes" },
            { text: "in" },
            { text: "leading" },
            { text: "design," },
            { text: "content," },
            { text: "and" },
            { text: "development" },
            { text: "teams" },
            { text: "to" },
            { text: "create" },
            { text: "user-centered", accent: true },
            { text: "applications" },
            { text: "and" },
            { text: "campaigns." },
          ]}
        </WordReveal>
      </h1>

      <div className="hero__scroll">
        <span>Scroll</span>
        <div className="hero__scroll-bar"></div>
      </div>
    </section>
  );
}

/* ============================================
   About
   ============================================ */
function About() {
  return (
    <section className="section" id="about">
      <div className="shell">
        <div className="section-label reveal">
          <span className="section-label__num" aria-hidden="true">01</span>
          <span>About</span>
        </div>
        <div className="about__grid">
          <h2 className="about__heading reveal">
            My strengths lie in
            <em> simplifying technical concepts</em> for clients and
            collaborating with them to build digital solutions that
            prioritize user experience.
          </h2>
          <div className="about__body">
            <p className="reveal reveal--delay-2">
              Throughout the product lifecycle,
              I work closely with clients on applications, websites, and
              campaigns that align with integrated marketing, advertising,
              public relations, and lead-generation efforts.
            </p>
            <p className="reveal reveal--delay-3">
              My background in web development has allowed me to work within
              a myriad of platforms that host, distribute, and maintain
              interactive applications. With over 18 years of client-facing
              experience in both the private and public sectors, I leverage
              my expertise to make informed decisions that drive product
              success and improve outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Philosophy
   ============================================ */
function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="shell">
        <div className="section-label reveal">
          <span className="section-label__num" aria-hidden="true">02</span>
          <span>Approach</span>
        </div>
        <div className="philosophy__grid">
          <h2 className="philosophy__intro reveal">
            I believe great experiences are not designed in isolation; they
            are <em>orchestrated</em> across <span className="accent">people,
            policy, and platforms.</span>
          </h2>

          <div className="tenets">
            <div className="tenet reveal reveal--delay-1">
              <div className="tenet__num" aria-hidden="true">— 01</div>
              <h3 className="tenet__title">Translate complexity into clarity</h3>
              <p className="tenet__body">
                Whether the brief is federal policy, vehicle launch logistics,
                or an AI-enabled workflow, my job is to find the through-line
                and make it simple, without flattening what matters.
              </p>
            </div>
            <div className="tenet reveal reveal--delay-2">
              <div className="tenet__num" aria-hidden="true">— 02</div>
              <h3 className="tenet__title">Design with the team, not for them</h3>
              <p className="tenet__body">
                I lead designers, engineers, researchers, and account leads
                as a single craft team. Coaching and critique are how quality
                scales across regions, time zones, and engagement types.
              </p>
            </div>
            <div className="tenet reveal reveal--delay-3">
              <div className="tenet__num" aria-hidden="true">— 03</div>
              <h3 className="tenet__title">Trust as a unit of measurement</h3>
              <p className="tenet__body">
                Especially in human + AI experiences. I set standards for
                transparency, accessibility, and responsible design so the
                resulting product earns its place in someone's day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Contact
   ============================================ */
function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="shell">
        <div className="section-label reveal">
          <span className="section-label__num" aria-hidden="true">04</span>
          <span>Contact</span>
        </div>
        <div className="contact__grid">
          <h2 className="contact__statement reveal">
            Let's <em>shape what's</em>{" "}
            <span className="ink-accent">next.</span>
          </h2>
          <div className="contact__channels">
            <a
              className="contact__channel reveal reveal--delay-1"
              href="mailto:JustinParra206@gmail.com"
            >
              <span className="contact__channel-label">Email</span>
              <span className="contact__channel-value">JustinParra206@gmail.com</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
            <a
              className="contact__channel reveal reveal--delay-2"
              href="https://justinparra.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact__channel-label">Portfolio</span>
              <span className="contact__channel-value">justinparra.com</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
            <a
              className="contact__channel reveal reveal--delay-3"
              href="https://www.linkedin.com/in/justinparra"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact__channel-label">LinkedIn</span>
              <span className="contact__channel-value">/in/justinparra</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
            <a
              className="contact__channel reveal reveal--delay-4"
              href="https://github.com/jp206100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact__channel-label">GitHub</span>
              <span className="contact__channel-value">/jp206100</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Footer
   ============================================ */
function Footer() {
  return (
    <footer className="footer">
      <div>© 2026 Justin Parra <span className="footer__yellow-dot"></span> Prepared for EY Studio+</div>
    </footer>
  );
}

Object.assign(window, {
  IntroCurtain, TopNav, Hero, About, Philosophy, Contact, Footer,
  WordReveal, useReveal,
});
