import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

export default function CurrentlySeeking() {
  return (
    <section style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
      <SectionLabel label="Currently Seeking" num="02" />
      <Reveal>
        <div
          style={{
            fontSize: "clamp(20px, 2.2vw, 28px)",
            fontWeight: 300,
            lineHeight: 1.6,
            letterSpacing: "-0.01em",
            maxWidth: 700,
          }}
        >
          Positions in the field of{" "}
          <span style={{ fontWeight: 500 }}>Digital Product Management</span>,{" "}
          <span style={{ fontWeight: 500 }}>UX Program Management</span>,{" "}
          <span style={{ fontWeight: 500 }}>Digital Strategy</span>,{" "}
          <span style={{ fontWeight: 500 }}>AI Enablement</span>, and{" "}
          <span style={{ fontWeight: 500 }}>Creative Services Production</span>.
          Currently in Seattle, but open to move to San Francisco or Chicago.
        </div>
      </Reveal>
    </section>
  );
}
