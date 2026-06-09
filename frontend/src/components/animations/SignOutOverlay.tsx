import { motion, AnimatePresence, Variants } from "framer-motion";

export default function SignOutOverlay({
  isLoggingOut,
  message,
}: {
  isLoggingOut: boolean;
  message: string;
}) {
  // Variants for the container (staggering children)
  const containerVariants: Variants = {
    hidden: { opacity: 0 }, // Start transparent
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Variants for individual letters
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "decay", damping: 12, stiffness: 200 },
    },
  };

  return (
    <AnimatePresence>
      {isLoggingOut && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden" // Smooth fade out
          className="fixed inset-0 z-100 flex items-center justify-center p-6 text-center bg-black/40 backdrop-blur-xl"
        >
          <div className="flex flex-wrap justify-center">
            {message.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="font-display text-xl md:text-3xl lg:text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
