"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface NeonLoadingProps {
  onLit: () => void;
}

const LIGHT_UP_DURATION = 2.8;

export default function NeonLoading({ onLit }: NeonLoadingProps) {
  const calledRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onLit();
      }
    }, LIGHT_UP_DURATION * 1000);
    return () => clearTimeout(timer);
  }, [onLit]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f0a1a]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow frame */}
        <motion.div
          className="absolute -inset-8 rounded-3xl border"
          animate={{
            opacity: [0, 0.1, 0, 0.2, 0, 0.4, 0.1, 0.6, 0.3, 0.8, 0.6, 1],
            borderColor: [
              "rgba(255,107,138,0.02)",
              "rgba(255,107,138,0.1)",
              "rgba(255,107,138,0.02)",
              "rgba(255,107,138,0.2)",
              "rgba(255,107,138,0.02)",
              "rgba(255,107,138,0.4)",
              "rgba(255,107,138,0.1)",
              "rgba(255,107,138,0.6)",
              "rgba(255,107,138,0.3)",
              "rgba(255,107,138,0.8)",
              "rgba(255,107,138,0.6)",
              "rgba(255,107,138,0.5)",
            ],
          }}
          transition={{
            duration: LIGHT_UP_DURATION,
            times: [
              0, 0.05, 0.08, 0.15, 0.18, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1,
            ],
            ease: "easeInOut",
          }}
        />

        {/* Glow layer */}
        <motion.span
          className="absolute font-display text-6xl md:text-8xl tracking-ultra uppercase text-coral select-none"
          aria-hidden="true"
          animate={{
            opacity: [
              0.03, 0.15, 0.03, 0.3, 0.03, 0.5, 0.08, 0.7, 0.2, 0.85, 0.5,
              0.95,
            ],
            filter: [
              "blur(8px)",
              "blur(6px)",
              "blur(8px)",
              "blur(5px)",
              "blur(8px)",
              "blur(4px)",
              "blur(6px)",
              "blur(3px)",
              "blur(5px)",
              "blur(2px)",
              "blur(3px)",
              "blur(1px)",
            ],
            scale: [0.98, 1, 0.98, 1.01, 0.98, 1.02, 0.99, 1.02, 1, 1.01, 1, 1],
          }}
          transition={{
            duration: LIGHT_UP_DURATION,
            times: [
              0, 0.04, 0.06, 0.1, 0.13, 0.18, 0.22, 0.3, 0.4, 0.5, 0.7, 1,
            ],
            ease: "easeInOut",
          }}
        >
          REVERIE
        </motion.span>

        {/* Core text */}
        <motion.span
          className="relative z-10 font-display text-6xl md:text-8xl tracking-ultra uppercase text-white select-none"
          animate={{
            opacity: [
              0.03, 0.1, 0.03, 0.25, 0.03, 0.4, 0.08, 0.6, 0.15, 0.75, 0.4,
              1,
            ],
            textShadow: [
              "0 0 0px transparent",
              "0 0 0px transparent",
              "0 0 0px transparent",
              "0 0 4px rgba(255,107,138,0.3)",
              "0 0 0px transparent",
              "0 0 6px rgba(255,107,138,0.4)",
              "0 0 2px rgba(255,107,138,0.1)",
              "0 0 8px rgba(255,107,138,0.5), 0 0 20px rgba(255,107,138,0.2)",
              "0 0 4px rgba(255,107,138,0.3)",
              "0 0 10px rgba(255,107,138,0.6), 0 0 30px rgba(255,107,138,0.3)",
              "0 0 6px rgba(255,107,138,0.4), 0 0 15px rgba(255,107,138,0.2)",
              "0 0 10px rgba(255,107,138,0.5), 0 0 30px rgba(255,107,138,0.3), 0 0 60px rgba(255,107,138,0.15)",
            ],
          }}
          transition={{
            duration: LIGHT_UP_DURATION,
            times: [
              0, 0.04, 0.06, 0.1, 0.13, 0.18, 0.22, 0.3, 0.4, 0.5, 0.7, 1,
            ],
            ease: "easeInOut",
          }}
        >
          REVERIE
        </motion.span>
      </div>
    </motion.div>
  );
}
