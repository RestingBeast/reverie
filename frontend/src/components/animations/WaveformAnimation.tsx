"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

function Bar({ baseHeight, index }: { baseHeight: number; index: number }) {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      while (!cancelled) {
        const randomScale = 0.3 + Math.random() * 1.4;
        const randomDuration = 0.08 + Math.random() * 0.18;

        await controls.start({
          scaleY: randomScale,
          transition: { duration: randomDuration, ease: "easeInOut" },
        });

        // Brief random hold before next jump
        await new Promise((r) => setTimeout(r, Math.random() * 80));
      }
    };

    // Stagger start so bars don't all jump at once on mount
    const timeout = setTimeout(animate, index * 30);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [controls, index]);

  return (
    <motion.span
      animate={controls}
      className="w-2.5 rounded-sm bg-linear-to-t from-purple-400 to-cyan-300"
      style={{
        height: `${baseHeight}px`,
        originY: 1,
      }}
    />
  );
}

export default function WaveformDecoration() {
  const heights = [
    16, 20, 24, 20, 28, 22, 30, 24, 20, 28, 24, 18, 26, 22, 16, 20, 24, 28, 20,
    18,
  ];

  return (
    <div className="flex items-end gap-0.5 h-10 opacity-70">
      {heights.map((h, i) => (
        <Bar key={i} baseHeight={h} index={i} />
      ))}
    </div>
  );
}
