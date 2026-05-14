"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

function Bar({ baseHeight, index }: { baseHeight: number; index: number }) {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      // 1. Immediate exit check
      if (cancelled) return;

      while (!cancelled) {
        const randomScale = 0.3 + Math.random() * 1.4;
        const randomDuration = 0.08 + Math.random() * 0.18;

        try {
          // 2. We wrap the start in a try/catch.
          // If the component unmounts during the await, this will prevent a crash.
          await controls.start({
            scaleY: randomScale,
            transition: { duration: randomDuration, ease: "easeInOut" },
          });

          // 3. Check again after the animation completes before the "hold"
          if (cancelled) break;

          await new Promise((r) => setTimeout(r, Math.random() * 80));
        } catch (error) {
          // Animation was likely interrupted by unmount
          break;
        }
      }
    };

    const timeout = setTimeout(() => {
      if (!cancelled) animate();
    }, index * 30);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controls.stop(); // 4. "Cut the power" immediately
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
