import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

const fallbackText =
  "Positions in the field of Digital Product Management, UX Program Management, Digital Strategy, AI Enablement, and Creative Services Production. Currently in Seattle, but open to move to San Francisco or Chicago.";

interface CurrentlySeekingProps {
  text?: string;
}

export default function CurrentlySeeking({ text }: CurrentlySeekingProps) {
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
          {text ?? fallbackText}
        </div>
      </Reveal>
    </section>
  );
}
