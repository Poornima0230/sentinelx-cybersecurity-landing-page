import { useEffect } from "react";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustedSection } from "./components/trustedSection";
import { FeatureSection } from "./components/FeatureSection";
import { Benefits } from "./components/Benefits";
import { Cta } from "./components/CtaBanner";
import { Footer } from "./components/Footer";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedSection />
      <FeatureSection />
      <Benefits />
      <Cta />
      <Footer />
    </>
  );
}

export default App;
