"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

const fallbackClients = [
  "Toyota North America",
  "US Fire Administration",
  "US EPA",
  "Lexus",
  "Sound Transit",
  "Condé Nast",
  "Vanity Fair",
  "Getty Images",
  "CAA",
  "Toyota Connected",
  "Toyota AMRD",
  "Dexcom",
];

interface ClientsProps {
  clients?: string[];
}

export default function Clients({ clients }: ClientsProps) {
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const clientList = clients ?? fallbackClients;

  return (
    <section
      aria-label="Select Clients"
      style={{
        background: "var(--color-fg)",
        color: "var(--color-bg)",
        padding: `clamp(60px, 10vh, 120px) ${pagePad}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(245,242,237,0.5)",
          marginBottom: 48,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(245,242,237,0.15)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Select Clients</span>
        <span style={{ color: "var(--color-accent)" }}>04</span>
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
      >
        {clientList.map((c, i) => (
          <Reveal
            key={i}
            style={{
              padding: "20px 0",
              borderBottom: "1px solid rgba(245,242,237,0.08)",
              fontSize: 15,
              fontWeight: 300,
              color:
                hoveredClient === i
                  ? "var(--color-bg)"
                  : "rgba(245,242,237,0.7)",
              paddingLeft: hoveredClient === i ? 8 : 0,
              transition: "color 0.3s, padding-left 0.3s",
              cursor: "default",
            }}
            onMouseEnter={() => setHoveredClient(i)}
            onMouseLeave={() => setHoveredClient(null)}
          >
            {c}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
