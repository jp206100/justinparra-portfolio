import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CurrentlySeeking from "@/components/CurrentlySeeking";
import Experience from "@/components/Experience";
import Clients from "@/components/Clients";
import GitHubActivity from "@/components/GitHubActivity";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <CurrentlySeeking />
      <Experience />
      <Clients />
      <GitHubActivity />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}
