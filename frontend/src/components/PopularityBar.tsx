import React from "react";

interface PopularityBarProps {
  score: number;
}

const PopularityBar = ({ score }: PopularityBarProps) => {
  return (
    <div className="w-full max-w-45 md:max-w-25 lg:max-w-45 flex flex-col gap-1.5">
      <div className="flex justify-between items-end px-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300/60">
          Popularity
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
              "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
          }}
        >
          {/* Animated Wave Highlight */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default PopularityBar;
