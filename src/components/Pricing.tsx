"use client";
import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants/index";

const Pricing = () => {
  return (
    <section className="snap-start min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center bg-black px-4 py-16">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center text-orange-500 mb-12 tracking-wide">
        Pricing
      </h2>

      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-8">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className="
              w-full        
              sm:w-[300px]  
              bg-black/30 
              border border-neutral-700 
              rounded-xl 
              shadow-md hover:shadow-orange-500/20 
              transition 
              p-6 
              flex flex-col justify-between
              max-w-xs     /* prevent too wide on mobile */
              mx-auto      /* center cards on mobile */
            "
          >
            <div>
              <p className="text-2xl font-bold text-orange-400 mb-4">
                {option.title}
              </p>
              <p className="text-4xl text-white mb-6">
                {option.price}
                <span className="text-sm text-neutral-400"> /month</span>
              </p>

              <ul className="space-y-3 text-sm text-gray-300">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="text-orange-500 mr-2 mt-1" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#"
              className="mt-8 bg-orange-600 hover:bg-orange-500 transition text-white text-center py-2 rounded-lg"
            >
              Subscribe
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
