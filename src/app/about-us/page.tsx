// pages/about.tsx
"use client";
import SectionScroller from "@/components/AnimatedScroller";
import Image from "next/image";
import OurMission from "../../../public/mission.jpg";
import Footer from "@/components/Footer";
import AI from "../../../public/AIservice.jpeg";
import Mobile from "../../../public/mobile.jpg";
import software from "../../../public/software.jpg";
import web from "../../../public/website.jpg";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const sections = [
    // Hero Section
    <div
      key="hero"
      className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 md:px-36 gap-6"
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-orange-500">
        We Build Intelligent Digital Solutions
      </h1>
      <p className="text-base sm:text-lg md:text-2xl text-white max-w-full sm:max-w-2xl md:max-w-3xl px-2">
        At Bytaris, we specialize in AI-powered software, web, and mobile
        applications that transform businesses and empower users. Our solutions
        streamline operations, enhance customer experiences, and provide
        actionable insights to drive growth. By combining cutting-edge
        technology with deep industry expertise, we help companies stay
        competitive in an increasingly digital world.
      </p>
    </div>,

    // Our Mission
    <div
      key="mission"
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4 sm:px-6 md:px-24 py-12"
    >
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-4">
          Our Mission
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white mb-4">
          Our mission is to empower businesses with intelligent digital
          solutions that drive efficiency, innovation, and growth. We leverage
          AI, machine learning, and modern software technologies to build tools
          that are intuitive, scalable, and highly effective. Each project is
          approached with a commitment to quality, ensuring solutions solve
          immediate challenges while providing long-term value.
        </p>
        <p className="text-base sm:text-lg md:text-xl text-white">
          We aim to bridge the gap between cutting-edge technology and practical
          business outcomes, creating products that not only function flawlessly
          but also enhance productivity and competitive advantage.
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
        <Image
          src={OurMission}
          alt="Mission Image"
          width={500}
          height={350}
          className="rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-full h-auto"
        />
      </div>
    </div>,

    // Our Expertise
    <div
      key="expert"
      className="flex flex-col md:flex-row-reverse items-center justify-center mb-16 gap-6 md:gap-8 px-4 sm:px-6 md:px-24 py-12"
    >
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-4">
          Our Expertise
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white mb-6">
          We specialize in building end-to-end AI and software solutions for
          businesses of all sizes. Our team develops web applications to
          streamline workflows, mobile apps to enhance user engagement, and
          custom software tailored to specific operational needs. By combining
          advanced technology with intuitive design, we ensure our solutions are
          powerful yet user-friendly.
        </p>
      </div>
      <div className="md:w-1/2 grid grid-cols-2 gap-4 mb-16 w-full max-w-lg sm:max-w-xl md:max-w-full">
        <Image
          src={web}
          alt="Web"
          width={300}
          height={200}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <Image
          src={Mobile}
          alt="Mobile"
          width={300}
          height={200}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <Image
          src={AI}
          alt="AI"
          width={300}
          height={200}
          className="rounded-lg shadow-md w-full h-auto"
        />
        <Image
          src={software}
          alt="Software"
          width={300}
          height={200}
          className="rounded-lg shadow-md w-full h-auto"
        />
      </div>
    </div>,

    // Footer
    <Footer key="footer" />,
  ];

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <SectionScroller sections={sections} />
    </main>
  );
}
