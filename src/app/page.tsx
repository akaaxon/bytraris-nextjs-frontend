// app/page.tsx
import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsCounter from "@/components/StatsCounter";
import Navbar from "@/components/Navbar";
import SectionScroller from "../components/AnimatedScroller";
import Footer from "@/components/Footer";


export default function Page() {
  const sections = [
    <HeroSection key="hero"/>,
    <FeaturesSection key="features" />,
    <StatsCounter key="stats"/>,
    <Footer key="footer"/>
    
  ]
  return (
    <>
     
    <div className="bg-black min-h-screen">
      <Navbar/>
      <SectionScroller sections={sections} />
      </div>
      
    </>
  );
}
