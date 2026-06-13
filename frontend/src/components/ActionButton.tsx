import { AnimatePresence, motion } from "framer-motion";

interface ActionButtonProps {
  buttonText: string;
  className?: string;
  onClick?: () => void;
}

const ActionButton = ({
  buttonText,
  className,
  onClick,
}: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={`
      font-display tracking-wide text-clip text-xs lg:text-sm
      py-3 rounded-full
      transition-all duration-300
      hover:scale-[1.02] active:scale-100
      ${className}
    `}
  >
    {/* AnimatePresence handles the exit/entry of the text strings */}
    <AnimatePresence mode="wait">
      <motion.span
        key={buttonText} // This is the "magic" - changing text triggers the swap
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-flex justify-center items-center gap-1"
      >
        {buttonText.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }} // The typewriter stagger
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  </button>
);

export default ActionButton;
