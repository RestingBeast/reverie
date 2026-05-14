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
      font-display tracking-widest uppercase text-xs sm:text-sm
      py-3 rounded-full
      transition-all duration-300
      hover:scale-[1.02] active:scale-100
      ${className}
    `}
  >
    {buttonText}
  </button>
);

export default ActionButton;
