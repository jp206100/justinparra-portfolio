"use client";

import { useState, useEffect } from "react";

const navLinks = ["About", "Experience", "Work", "Contact"];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
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

        {/* Desktop nav links */}
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

        {/* Hamburger button (mobile/tablet only) */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            position: "relative",
            width: 24,
            height: 20,
          }}
        >
          <span
            style={{
              display: "block",
              position: "absolute",
              left: 0,
              width: 24,
              height: 1.5,
              background: "var(--color-fg)",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              top: menuOpen ? 9 : 0,
              transform: menuOpen ? "rotate(45deg)" : "rotate(0)",
            }}
          />
          <span
            style={{
              display: "block",
              position: "absolute",
              left: 0,
              width: 24,
              height: 1.5,
              background: "var(--color-fg)",
              transition: "opacity 0.3s ease",
              top: 9,
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              position: "absolute",
              left: 0,
              width: 24,
              height: 1.5,
              background: "var(--color-fg)",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              top: menuOpen ? 9 : 18,
              transform: menuOpen ? "rotate(-45deg)" : "rotate(0)",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="mobile-menu-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(245, 242, 237, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        {navLinks.map((s, i) => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              textDecoration: "none",
              fontWeight: 500,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.4s ease ${i * 0.05 + 0.1}s, transform 0.4s ease ${i * 0.05 + 0.1}s`,
            }}
          >
            {s}
          </a>
        ))}
      </div>
    </>
  );
}
