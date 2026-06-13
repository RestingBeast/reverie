"use client";

import { useState } from "react";
import type { Summary } from "@/types/summary.types";

interface SummaryHistoryProps {
  summaries: Summary[];
  onSelect: (summary: Summary) => void;
  onDelete: (shareId: string) => void;
  onShare: (shareId: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SummaryHistory({
  summaries,
  onSelect,
  onDelete,
  onShare,
}: SummaryHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (summaries.length === 0) return null;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-2">
      <p className="font-body text-white/40 text-xs tracking-mega uppercase px-1">
        Recent Reveries
      </p>

      {summaries.map((s) => (
        <div
          key={s.shareId}
          onClick={() => onSelect(s)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(s);
          }}
          role="button"
          tabIndex={0}
          className="w-full text-left group flex items-center gap-4 md:gap-5 px-4 md:px-6 py-3 md:py-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/6 hover:border-white/10 transition-all duration-200 cursor-pointer"
        >
          {/* Personality + date */}
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm md:text-lg text-white/80 truncate">
              {s.personality}
            </p>
            <p className="font-body text-xs md:text-sm text-white/30 mt-0.5">
              {formatDate(s.generatedAt)}
            </p>
          </div>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(s.shareId);
              setCopiedId(s.shareId);
              setTimeout(() => setCopiedId(null), 3000);
            }}
            className="shrink-0 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-body tracking-wide text-coral/70 hover:text-coral hover:bg-coral/10 transition-colors"
          >
            {copiedId === s.shareId ? "Copied!" : "Share"}
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete this reverie?")) {
                onDelete(s.shareId);
              }
            }}
            className="shrink-0 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-body tracking-wide text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
