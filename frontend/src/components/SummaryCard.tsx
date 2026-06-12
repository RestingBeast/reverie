"use client";

import { Summary } from "@/types/summary.types";
import StatCard from "./StatCard";
import { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { useRouter } from "next/navigation";

interface SummaryCardProps {
  summary: Summary;
  buttonText?: string;
  readonly?: boolean;
  onRegenerate?: () => void;
}

export default function SummaryCard({
  summary,
  buttonText,
  readonly,
  onRegenerate,
}: SummaryCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const shareUrl = `${baseUrl}/share/${summary.shareId}`;
  const sharer = `Identified: ${summary.displayName}`;
  const date = new Date(summary.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    router.push("/");
  };

  return (
    <div
      className="
        relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl
        bg-[#140d24]/80 backdrop-blur-xl
        border border-white/5
        rounded-3xl
        shadow-[0_0_80px_-10px_rgba(255,107,138,0.2)]
        overflow-hidden
        mx-auto
        p-5 sm:p-6 md:p-8
        flex flex-col gap-5
      "
    >
      {/* ── Sharer header ── */}
      {readonly && (
        <div className="flex flex-col items-center gap-1 mb-6 text-center">
          <p className="font-body text-white/40 text-xs tracking-mega uppercase">
            [Signal Captured]
          </p>
          <h2 className="font-display text-white/80 text-2xl sm:text-3xl tracking-widest uppercase">
            {summary.displayName}'s Sonic Portrait
          </h2>
          <p className="font-body text-white/40 text-base mt-1">
            This is their story. What would yours sound like?
          </p>
        </div>
      )}

      {/* ── Profile header ── */}
      <div className="flex items-center px-3 gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-coral/40 to-amber/20 border-2 border-white/20 overflow-hidden flex items-center justify-center">
            {summary.avatarUrl ? (
              <img
                src={summary.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-9 h-9 text-white/30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          {/* Halo ring glow */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-br from-coral/20 to-amber/10 blur-md -z-10" />
        </div>

        {/* Name + vibe */}
        <div className="min-w-0">
          <h2 className="font-display text-white text-xl sm:text-2xl tracking-wider leading-none">
            {summary.displayName}
          </h2>
          <p
            className="
              font-display
              text-lg sm:text-xl
              tracking-wide leading-snug mt-1
              bg-linear-to-r from-coral via-amber to-lavender
              bg-clip-text text-transparent
            "
          >
            {summary.personality}
          </p>
        </div>
      </div>

      {/* ── Greeting + date ── */}
      <div className="flex flex-col gap-0.5 px-3">
        <p className="font-body text-white/40 text-xs md:text-sm tracking-wide">
          Timestamp: {date}
        </p>
      </div>

      {/* ── Narrative ── */}
      <p className="font-body text-white/60 text-xs sm:text-sm md:text-base leading-relaxed px-3">
        {summary.aiNarrative}
      </p>

      {/* ── Top Tracks ── */}
      <StatCard variant="tracks" tracks={summary.topTracks} />

      {/* ── Top Artists + Top Genres (side by side on sm+) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <StatCard variant="artists" artists={summary.topArtists} />
        <StatCard variant="genres" genres={summary.topGenres} />
      </div>

      {/* ── Action buttons ── */}
      <div className="grid md:grid-cols-2 gap-3 pt-1">
        {/* Primary: Share */}
        <ActionButton
          buttonText={copied ? "Signal Captured" : "Broadcast my Narrative"}
          onClick={handleShare}
          className={`
          text-white transition-all duration-500
            ${
              copied
                ? `bg-linear-to-r from-emerald-600 to-green-400 font-bold border
                 border-white/10 opacity-80 shadow-none pointer-events-none`
                : `bg-linear-to-r from-coral to-amber hover:from-coral/90
                hover:to-amber/90 shadow-[0_0_20px_2px_rgba(255,107,138,0.4)] 
                  hover:shadow-[0_0_28px_4px_rgba(255,107,138,0.6)]`
            }
          `}
        />
        {/* Secondary: Regenerate */}
        <ActionButton
          buttonText={buttonText ?? "Recalibrate Narrative"}
          onClick={readonly ? handleRegenerate : onRegenerate}
          className="
            bg-linear-to-r from-amber via-coral to-lavender
            hover:from-amber/90 hover:via-coral/90 hover:to-lavender/90
            text-white
            shadow-[0_0_20px_2px_rgba(251,191,94,0.4)]
            hover:shadow-[0_0_28px_4px_rgba(251,191,94,0.6)]
          "
        />
      </div>
    </div>
  );
}
