import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function SignOutOverlay({ isLoggingOut, message }: { isLoggingOut: boolean, message: string}) {
  // Variants for the container (staggering children)
  const containerVariants: Variants = {
    hidden: { backgroundColor: "rgba(0, 0, 0, 0)" },
    visible: {
      backgroundColor: "#0B0E14", // Deep Midnight
      transition: {
        duration: 0.8,
        staggerChildren: 0.1, // Time between each letter
        delayChildren: 0.3
      }
    }
  };

  // Variants for individual letters
  const letterVariants : Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "decay", damping: 12, stiffness: 200 }
    }
  };

  return (
    <AnimatePresence>
      {isLoggingOut && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center"
        >
          <div className="flex flex-wrap justify-center">
            {message.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-white-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
