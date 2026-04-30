/* global React, ReactDOM */
const {
  IntroCurtain, TopNav, Hero, About, Philosophy, Contact, Footer,
  Work, useReveal,
} = window;

function App() {
  useReveal();

  // Scroll to the hash target once React has mounted the section. Needed
  // because the page renders client-side via Babel/unpkg, so the browser's
  // initial anchor scroll fires before #work / #contact exist in the DOM.
  React.useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    };
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  }, []);

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
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
