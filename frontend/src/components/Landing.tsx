"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogInButton from "./LogInButton";
import NeonLoading from "./animations/NeonLoading";
import RevealText from "./animations/RevealText";

export default function Landing() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [neonLit, setNeonLit] = useState(false);
  const showContent = bgLoaded && neonLit;

  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = "/bg-neon-waves.jpg";
  }, []);

  const handleNeonLit = useCallback(() => setNeonLit(true), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showContent && <NeonLoading key="neon" onLit={handleNeonLit} />}
      </AnimatePresence>

      {showContent && (
        <motion.section
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative flex items-center justify-center min-h-screen w-full overflow-hidden"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg-neon-waves.jpg')" }}
            aria-hidden="true"
          />

          {/* Warm overlay */}
          <div className="absolute inset-0 bg-[#0f0a1a]/50" aria-hidden="true" />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Headline */}
              <div className="space-y-1">
                <h1 className="font-display text-5xl md:text-7xl tracking-tighter uppercase">
                  <RevealText
                    text="One Echo"
                    className="block text-white drop-shadow-[0_0_15px_rgba(255,200,150,0.3)]"
                  />
                  <RevealText
                    text="Infinite Layers"
                    className="block text-transparent bg-clip-text bg-linear-to-r from-coral to-amber"
                    delay={0.7}
                  />
                </h1>
              </div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
                className="
                  font-body text-white/75 text-base md:text-xl
                  max-w-xs sm:max-w-sm md:max-w-md
                  leading-relaxed tracking-wide
                  mt-2 md:mt-4 mb-8 md:mb-10
                "
              >
                Your listening history, woven into a portrait only you could
                soundtrack
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
              >
                <LogInButton />
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </>
  );
}
