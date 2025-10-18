/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn,  } from "react-icons/fa";

export default function Footer() {
  const glow =
    "hover:underline hover:text-orange-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-400";

  return (
    <footer className="w-full bg-black text-white mt-12 md:mt-20">
      {/* CTA Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-8 md:py-12 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Let's Transform</h2>
          <p className="text-gray-300 mt-2">
            Ready to launch your own product? Send us a message!
          </p>
          <p className="text-gray-300">We make the entire building process smooth for you!</p>
        </div>
        <Link
          href="/contact"
          className={`${glow} w-fit px-6 py-3 md:px-8 md:py-4 border-2 border-white rounded-md font-medium hover:bg-white hover:text-black`}
        >
          Contact Us
        </Link>
      </div>

      {/* Footer Links & Social */}
      <div className="border-t border-gray-700 px-4 pt-6 pb-10 md:pt-8 md:pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-lg md:text-xl font-bold tracking-wide">BYTARIS</span>
          </div>

          {/* Navigation */}
          <nav className="flex justify-center flex-wrap gap-4 text-sm font-medium">
            <Link href="/services" className={glow}>Services</Link>
            <Link href="/bytaris-AI" className={glow}>AI Pricing</Link>
            <Link href="/about-us" className={glow}>About Us</Link>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4">
            <Link href="#" aria-label="Facebook" className={glow}><FaFacebookF size={18} /></Link>
             {/* X (Twitter new logo) */}
  <Link href="#" aria-label="X" className={glow}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1227"
      fill="currentColor"
      className="w-[18px] h-[18px]"
    >
      <path d="M714.163 519.284L1160.89 0H1052.72L668.951 450.887L362.086 0H0L468.322 681.821L0 1226.37H108.171L515.511 747.693L847.915 1226.37H1200L714.137 519.284H714.163ZM571.211 687.828L521.757 617.709L147.196 79.611H310.483L610.24 509.203L659.694 579.322L1052.79 1150.39H889.5L571.211 687.828Z" />
    </svg>
  </Link>
            <Link href="#" aria-label="Instagram" className={glow}><FaInstagram size={18} /></Link>
            <Link href="#" aria-label="LinkedIn" className={glow}><FaLinkedinIn size={18} /></Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
          © 2025 BYTARIS SAL. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
