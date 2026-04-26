/* global React */
const { useEffect, useRef, useState } = React;

/* ============================================
   IntroCurtain — page-load animation
   ============================================ */
function IntroCurtain() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1900);
    const t2 = setTimeout(() => setGone(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div className={"intro-curtain" + (leaving ? " is-leaving" : "")}>
      <div className="intro-curtain__bar"></div>
      <div className="intro-curtain__inner">
        <div className="intro-curtain__name">
          <span>Justin</span>{" "}<span><em>Parra</em></span>
        </div>
        <div className="intro-curtain__sub">Portfolio &nbsp;·&nbsp; 2026</div>
      </div>
    </div>
  );
}

/* ============================================
   useReveal — IntersectionObserver hook
   ============================================ */
function useReveal() {
  useEffect(() => {
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
    const onScroll = () => {
      const r = phil.getBoundingClientRect();
      // header sits in the top ~80px — flip when the dark panel covers it
      setOnDark(r.top <= 80 && r.bottom >= 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
  return (
    <section className="hero" id="top">
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
          <span className="section-label__num">01</span>
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
          <span className="section-label__num">02</span>
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
              <div className="tenet__num">— 01</div>
              <h3 className="tenet__title">Translate complexity into clarity</h3>
              <p className="tenet__body">
                Whether the brief is federal policy, vehicle launch logistics,
                or an AI-enabled workflow, my job is to find the through-line
                and make it simple, without flattening what matters.
              </p>
            </div>
            <div className="tenet reveal reveal--delay-2">
              <div className="tenet__num">— 02</div>
              <h3 className="tenet__title">Design with the team, not for them</h3>
              <p className="tenet__body">
                I lead designers, engineers, researchers, and account leads
                as a single craft team. Coaching and critique are how quality
                scales across regions, time zones, and engagement types.
              </p>
            </div>
            <div className="tenet reveal reveal--delay-3">
              <div className="tenet__num">— 03</div>
              <h3 className="tenet__title">Trust is the unit of measurement</h3>
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
          <span className="section-label__num">04</span>
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
              rel="noreferrer"
            >
              <span className="contact__channel-label">Portfolio</span>
              <span className="contact__channel-value">justinparra.com</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
            <a
              className="contact__channel reveal reveal--delay-3"
              href="https://www.linkedin.com/in/justinparra"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__channel-label">LinkedIn</span>
              <span className="contact__channel-value">/in/justinparra</span>
              <span className="contact__channel-arrow">↗</span>
            </a>
            <a
              className="contact__channel reveal reveal--delay-4"
              href="https://github.com/jp206100"
              target="_blank"
              rel="noreferrer"
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
