import React from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Generations from "../components/landing/Generations";
import Contact from "../components/landing/Contact";
import Footer from "../components/common/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />        {/* Buttons are now inside Hero */}
      <Features />
      <Generations />
      <Contact/>
      <Footer />
    </>
  );
}
