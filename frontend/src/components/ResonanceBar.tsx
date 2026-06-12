interface ResonanceBarProps {
  score: number;
}

const ResonanceBar = ({ score }: ResonanceBarProps) => {
  return (
    <div className="w-full max-w-1/4 sm:max-w-45 md:max-w-60 lg:max-w-38 flex flex-col gap-1.5">
        <div className="flex justify-between items-end px-0.5">
        <span className="text-xs font-bold uppercase tracking-widest text-coral/60">
          Resonance
        </span>
      </div>

      {/* Outer Track */}
      <div className="h-2 w-full bg-slate-900/50 rounded-full border border-white/5 overflow-hidden">
        {/* Glowing Progress Fill */}
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${score}%`,
            background:
              "linear-gradient(90deg, #ff6b8a 0%, #fbbf5e 50%, #a78bfa 100%)",
            boxShadow: "0 0 12px rgba(255, 107, 138, 0.5)",
          }}
        >
          {/* Animated Wave Highlight */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ResonanceBar;
