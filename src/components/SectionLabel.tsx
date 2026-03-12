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
      <span>{label}</span>
      <span style={{ color: "var(--color-accent)" }}>{num}</span>
    </Reveal>
  );
}
