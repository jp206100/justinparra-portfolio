"use client";

const navLinks = ["About", "Experience", "Work", "Contact"];

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between"
      style={{
        padding: "24px clamp(20px, 5vw, 80px)",
        background: "rgba(245, 242, 237, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-fg)",
        }}
      >
        Justin Parra
      </div>
      <div className="nav-links flex gap-8">
        {navLinks.map((s) => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              textDecoration: "none",
              opacity: 0.6,
            }}
          >
            {s}
          </a>
        ))}
      </div>
    </nav>
  );
}
