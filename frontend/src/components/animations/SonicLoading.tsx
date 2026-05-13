import { motion, Variants } from "framer-motion";

type Props = {
  text: string;
}

export const SonicLoading = ({text} : Props) => {
  // Container for the stagger effect
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  // Individual letter animation
  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(8px)",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex overflow-hidden text-white font-mono md:text-xl text-lg tracking-widest"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>

      {/* Visual Accent: Pulsing Glow Bar */}
      <motion.div
        className="w-48 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          opacity: [0.2, 1, 0.2],
          scaleX: [0.8, 1.1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
