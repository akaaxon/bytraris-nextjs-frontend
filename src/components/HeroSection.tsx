"use client";
import Link from "next/link";
import { useEffect } from "react";
import { FaInstagram } from "react-icons/fa";

const HeroSection = () => {
  useEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = true; // iOS Safari requires this to be set programmatically
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative snap-start h-screen w-full overflow-hidden bg-black text-white">
      {/* Background video */}
      <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          preload="auto"
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/heroSectionVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay to darken background */}
      <div className="absolute inset-0 w-full h-full bg-black/70 z-20" />

      {/* Content container */}
      <div className="relative z-30 w-full h-full mx-auto px-6 py-10 flex flex-col items-start justify-center text-left">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wide text-orange-500">
          Software and AI solutions{" "}
          <span className="block bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
            for everyone
          </span>
        </h1>

        <p className="mt-6 text-lg text-neutral-300 max-w-xl">
          Empower your creativity and bring your technology ideas to life with our
          intuitive development skills. Get started today and turn your imagination
          into immersive reality!
        </p>

        <div className="flex mt-6 space-x-6">
        <Link
  href="#"
  aria-label="X"
  className="group flex items-center justify-center w-12 h-12 rounded-full bg-black shadow-lg hover:bg-orange-500 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    width="24"
    height="24"
    fill="currentColor"
    className="text-orange-600 group-hover:text-black transition-transform duration-300 group-hover:scale-110"
  >
    <path d="M714.163 519.284L1160.89 0H1052.72L668.951 450.887L362.086 0H0L468.322 681.821L0 1226.37H108.171L515.511 747.693L847.915 1226.37H1200L714.137 519.284H714.163ZM571.211 687.828L521.757 617.709L147.196 79.611H310.483L610.24 509.203L659.694 579.322L1052.79 1150.39H889.5L571.211 687.828Z" />
  </svg>
</Link>

<Link
  href="#"
  className="group flex items-center justify-center w-12 h-12 rounded-full bg-black shadow-lg hover:bg-orange-500 transition"
>
  <FaInstagram
    size={24}
    className="text-orange-600 group-hover:text-black transition-transform duration-300 group-hover:scale-110"
  />
</Link>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
