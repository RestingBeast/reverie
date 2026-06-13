"use client";

import { motion } from "framer-motion";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const letterVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 15, stiffness: 120 },
  },
};

export default function RevealText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.04,
}: RevealTextProps) {
  return (
    <motion.span
      className={className}
      style={{ isolation: "isolate", transform: "translateZ(0)" }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariants} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
