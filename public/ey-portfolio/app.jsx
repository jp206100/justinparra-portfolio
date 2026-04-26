/* global React, ReactDOM */
const {
  IntroCurtain, TopNav, Hero, About, Philosophy, Contact, Footer,
  Work, useReveal,
} = window;
const {
  TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect,
} = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "pairing": "akzidenz-archivo"
}/*EDITMODE-END*/;

function App() {
  useReveal();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.body.setAttribute("data-pairing", tweaks.pairing);
  }, [tweaks.pairing]);

  return (
    <React.Fragment>
      <IntroCurtain />
      <div className="app">
        <TopNav />
        <Hero />
        <About />
        <Philosophy />
        <Work />
        <Contact />
        <Footer />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Typography Pairing" subtitle="Swiss-minimalist forward; editorial below">
          <TweakSelect
            label="Pairing"
            value={tweaks.pairing}
            onChange={(v) => setTweak("pairing", v)}
            options={[
              { value: "swiss-classic", label: "Swiss Classic — Inter Tight (Helvetica)" },
              { value: "akzidenz-archivo", label: "Akzidenz × Archivo — heavy grotesk" },
              { value: "ibm-plex", label: "IBM Plex — disciplined technical" },
              { value: "work-sans", label: "Work Sans × Inter — Müller-Brockmann" },
              { value: "manrope-mono", label: "Manrope × Plex Mono — geometric" },
              { value: "editorial-serif", label: "Editorial — Fraunces × Inter" },
              { value: "instrument-classic", label: "Instrument × DM Sans" },
              { value: "modern-grotesk", label: "Space Grotesk × Inter" },
              { value: "playfair-clean", label: "Playfair × DM Sans" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
