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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  const shareUrl = `${baseUrl}/share/${summary.shareId}`;
  const displayGreeting = `Greetings, ${summary.displayName}`;
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
        bg-[#0e0c1e]/80 backdrop-blur-xl
        border border-white/10
        rounded-3xl
        shadow-[0_0_80px_-10px_rgba(120,80,255,0.35)]
        overflow-hidden
        mx-auto
        p-5 sm:p-6 md:p-8
        flex flex-col gap-5
      "
    >
      {/* ── Profile header ── */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-purple-500/40 to-cyan-500/20 border-2 border-white/20 overflow-hidden flex items-center justify-center">
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
          <div className="absolute -inset-1 rounded-full bg-linear-to-br from-purple-400/20 to-cyan-300/10 blur-md -z-10" />
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
              bg-linear-to-r from-cyan-300 via-purple-300 to-pink-300
              bg-clip-text text-transparent
            "
          >
            {summary.personality}
          </p>
        </div>
      </div>

      {/* ── Greeting + date ── */}
      <div className="flex flex-col gap-0.5 px-3">
        <p className="font-body text-white/60 text-xs sm:text-sm md:text-base tracking-wide">
          {displayGreeting}
        </p>
        <p className="font-body text-white/40 text-xs md:text-sm tracking-wide">
          Date today: {date}
        </p>
      </div>

      {/* ── Narrative ── */}
      <p className="font-body text-white/60 text-xs sm:text-sm md:text-base leading-relaxed px-3">
        {summary.aiNarrative}
      </p>

      {/* ── Top Tracks ── */}
      <StatCard variant="tracks" tracks={summary.topTracks} />

      {/* ── Top Artists + Top Genres (side by side on sm+) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                : `bg-linear-to-r from-purple-500 to-cyan-500 hover:from-purple-400
                hover:to-cyan-400 shadow-[0_0_20px_2px_rgba(120,80,255,0.4)] 
                  hover:shadow-[0_0_28px_4px_rgba(120,80,255,0.6)]`
            }
          `}
        />
        {/* Secondary: Regenerate */}
        <ActionButton
          buttonText={buttonText ?? "Recalibrate Narrative"}
          onClick={readonly ? handleRegenerate : onRegenerate}
          className="
            bg-linear-to-r from-yellow-400 via-pink-400 to-purple-500
            hover:from-yellow-300 hover:via-pink-300 hover:to-purple-400
            text-white
            shadow-[0_0_20px_2px_rgba(251,191,36,0.4)]
            hover:shadow-[0_0_28px_4px_rgba(251,191,36,0.6)]
          "
        />
      </div>
    </div>
  );
}
