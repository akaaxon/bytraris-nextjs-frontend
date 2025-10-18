/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState, ReactNode } from "react";

interface SectionScrollerProps {
  sections: ReactNode[];
}

export default function SectionScroller({ sections }: SectionScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Animate html elements on scroll
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.querySelectorAll("h1, p").forEach((child, i) =>
              child.animate(
                [
                  { opacity: 0, transform: "translateY(20px)" },
                  { opacity: 1, transform: "translateY(0)" }
                ],
                { duration: 800, delay: i * 200, fill: "forwards", easing: "ease-out" }
              )
            );
          } else {
            el.querySelectorAll("h1, p").forEach((child) =>
              child.getAnimations().forEach((a) => a.cancel())
            );
          }
        });
      },
      { root: containerRef.current, threshold: 0.2 }
    );
    sectionRefs.current.forEach((sec) => sec && obs.observe(sec));
    return () => obs.disconnect();
  }, [sections]);

  // Track active section
  useEffect(() => {
    const onScroll = () => {
      const root = containerRef.current;
      if (!root) return;
      const midY = root.scrollTop + root.clientHeight / 2;
      sectionRefs.current.forEach((sec, idx) => {
        if (!sec) return;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (midY >= top && midY < bottom) setActiveIndex(idx);
      });
    };
    containerRef.current?.addEventListener("scroll", onScroll, { passive: true });
    return () => containerRef.current?.removeEventListener("scroll", onScroll);
  }, []);

 const scrollTo = (idx: number) => {
  const root = containerRef.current;
  if (!root) return;

  root.scrollTo({
    top: idx * root.clientHeight,
    behavior: "smooth",      // matches the `scroll-smooth` timing
  });
};


  // Save refs
  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  return (
    <div className="relative w-full  h-screen overflow-x-hidden overflow-y-hidden">
      {/* Scroll Indicators */}
      <div
        className="
          fixed right-1 md:right-4 top-1/2 transform -translate-y-1/2
          h-[60vh] md:h-[70vh]
          flex flex-col items-center justify-center space-y-7
          z-50 pointer-events-auto
        "
      >
        {sections.map((_, i) => (
          <div
            key={i}
            role="button"
            aria-label={`Go to section ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`
              w-3 md:w-4 h-1 transition-transform duration-300 transform origin-center
              ${i === activeIndex
                ? "bg-orange-500 scale-x-125"
                : "bg-gray-600/70 hover:bg-gray-500"}
              cursor-pointer
            `}
          />
        ))}
      </div>

      {/* Main Sections */}
      <div
        ref={containerRef}
        className="snap-y snap-mandatory h-screen overflow-y-auto overscroll-none scrollbar-hide w-full"
        
      >
        {sections.map((SectionComponent, idx) => (
          <section
            key={idx}
            ref={setSectionRef(idx)}
            className={`
              snap-start min-h-screen w-full
              flex flex-col items-center justify-center
              ${idx % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} md:justify-between
              relative
            `}
          >
            {SectionComponent}
          </section>
        ))}
      </div>
    </div>
  );
}
