"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const StatsCounter = () => {
  const stats = [
    { value: 100, label: "Projects Completed", suffix: "+" },
    { value: 24, label: "Support Availability", suffix: "/7" },
    { value: 5.0, label: "Avg. Rating" },
    { value: 15, label: "Tech Experts", suffix: "+" }
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("stats-counter");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const increments = 60;
    const interval = duration / increments;

    const timers = stats.map((stat, index) => {
      const step = stat.value / increments;
      let current = 0;

      return setInterval(() => {
        current += step;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timers[index]);
        }

        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = stat.value % 1 === 0
            ? Math.floor(current)
            : parseFloat(current.toFixed(1));
          return newCounters;
        });
      }, interval);
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, [started]);

  return (
    <section className="relative snap-start h-screen w-full overflow-hidden" id="stats-counter">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/purplestat.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Stats content */}
      <div className="relative z-20 h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-orange-500 mb-2">
                {counters[index]}
                {stat.suffix}
              </h1>
              <p className="text-base md:text-lg font-medium text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
