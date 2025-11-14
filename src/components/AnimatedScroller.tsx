  /* eslint-disable @typescript-eslint/no-unused-vars */
  "use client";
  import { useEffect, useRef, useState, ReactNode } from "react";
  import gsap from "gsap";
  import { ScrollToPlugin } from "gsap/ScrollToPlugin";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

  interface SectionScrollerProps {
    sections: ReactNode[];
  }

  export default function SectionScroller({ sections }: SectionScrollerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const isAnimating = useRef(false);

  // === Animate h1, p, etc. every time section enters viewport ===
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up previous triggers
    ScrollTrigger.getAll().forEach((t) => t.kill());

    sectionRefs.current.forEach((section) => {
      if (!section) return;
      const elements = section.querySelectorAll("h1, h2, h3, p, span");
      if (!elements.length) return;

      // Create a paused timeline for the section
      const tl = gsap.timeline({ paused: true });
      tl.from(elements, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Create ScrollTrigger for each section
      ScrollTrigger.create({
        trigger: section,
        scroller: container,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play reverse play reverse", // 👈 replays every time
        onEnter: () => {
          tl.pause(0);
          gsap.delayedCall(0.5, () => {
            if (!tl.isActive()) tl.play(0);
          });
        },
        onEnterBack: () => {
          tl.pause(0);
          gsap.delayedCall(0.5, () => {
            if (!tl.isActive()) tl.play(0);
          });
        },
        onLeave: () => {
          gsap.delayedCall(0.5, () => {
            if (!tl.isActive()) tl.reverse();
          });
        },
        onLeaveBack: () => {
          gsap.delayedCall(0.5, () => {
            if (!tl.isActive()) tl.reverse();
          });
        },
      });
    });

    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [sections]);


    // === Track active section for indicators ===
    useEffect(() => {
      const root = containerRef.current;
      if (!root) return;

      const onScroll = () => {
        const midY = root.scrollTop + root.clientHeight / 2;
        sectionRefs.current.forEach((sec, idx) => {
          if (!sec) return;
          const top = sec.offsetTop;
          const bottom = top + sec.offsetHeight;
          if (midY >= top && midY < bottom) setActiveIndex(idx);
        });
      };

      root.addEventListener("scroll", onScroll, { passive: true });
      return () => root.removeEventListener("scroll", onScroll);
    }, []);

    // === Smooth GSAP scroll to a section ===
    const gsapScrollTo = (idx: number) => {
      const root = containerRef.current;
      const targetSection = sectionRefs.current[idx];
      if (!root || !targetSection || isAnimating.current) return;

      isAnimating.current = true;
      gsap.to(root, {
        duration: 1.2,
        ease: "power3.inOut",
        scrollTo: { y: targetSection, offsetY: 0 },
        onComplete: () => {
          isAnimating.current = false;
          setActiveIndex(idx);
        },
      });
    };

    // === Handle trackpad / mouse wheel (debounced) ===
    useEffect(() => {
      const root = containerRef.current;
      if (!root) return;

      let lastScrollTime = 0;
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const now = Date.now();
        const timeSinceLast = now - lastScrollTime;

        // Prevent rapid multiple triggers (trackpads send bursts)
        if (isAnimating.current || timeSinceLast < 200) return;

        if (e.deltaY > 3 && activeIndex < sections.length - 1) {
          gsapScrollTo(activeIndex + 1);
          lastScrollTime = now;
        } else if (e.deltaY < -3 && activeIndex > 0) {
          gsapScrollTo(activeIndex - 1);
          lastScrollTime = now;
        }
      };

      root.addEventListener("wheel", handleWheel, { passive: false });
      return () => root.removeEventListener("wheel", handleWheel);
    }, [activeIndex, sections.length]);

    // === Arrow key navigation ===
    useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
        if (isAnimating.current) return;

        if (e.key === "ArrowDown" && activeIndex < sections.length - 1) {
          gsapScrollTo(activeIndex + 1);
        } else if (e.key === "ArrowUp" && activeIndex > 0) {
          gsapScrollTo(activeIndex - 1);
        }
      };

      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [activeIndex, sections.length]);

    // === Save section refs ===
    const setSectionRef = (i: number) => (el: HTMLElement | null) => {
      sectionRefs.current[i] = el;
    };

    return (
      <div className="relative w-full h-screen overflow-x-hidden overflow-y-hidden">
        {/* === Scroll Indicators === */}
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
              onClick={() => gsapScrollTo(i)}
              className={`w-3 md:w-4 h-1 cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "bg-orange-500 scale-x-125"
                  : "bg-gray-600/70 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* === Main Sections === */}
        <div
          ref={containerRef}
          className="h-screen overflow-y-auto overscroll-none scrollbar-hide w-full"
        >
          {sections.map((SectionComponent, idx) => (
            <section
              key={idx}
              ref={setSectionRef(idx)}
              className={`min-h-screen w-full flex flex-col items-center justify-center ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
              } md:justify-between relative px-8`}
            >
              {SectionComponent}
            </section>
          ))}
        </div>
      </div>
    );
  }
