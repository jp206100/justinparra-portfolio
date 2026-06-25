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
              color: "rgba(245,242,237,0.7)",
              cursor: "default",
            }}
          >
            {c}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
