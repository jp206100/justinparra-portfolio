export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between"
      style={{
        padding: "32px clamp(20px, 5vw, 80px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "var(--color-fg-secondary)",
          letterSpacing: "0.05em",
        }}
      >
        &copy; 2026 Justin Parra
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--color-fg-secondary)",
          letterSpacing: "0.05em",
        }}
      >
        Seattle, WA
      </span>
    </footer>
  );
}
