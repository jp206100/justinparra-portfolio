import Reveal from "./Reveal";

interface SectionLabelProps {
  label: string;
  num: string;
}

export default function SectionLabel({ label, num }: SectionLabelProps) {
  return (
    <Reveal
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--color-fg-secondary)",
        marginBottom: 48,
        paddingBottom: 16,
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "inherit", fontWeight: "inherit", margin: 0 }}>{label}</h2>
      <span style={{ color: "var(--color-accent)" }}>{num}</span>
    </Reveal>
  );
}
