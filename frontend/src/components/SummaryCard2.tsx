"use client";

import { Summary } from "@/types/summary.types";
import StatCard from "./StatCard";
import { useState } from "react";

interface SummaryCardProps {
  summary: Summary;
  buttonText?: string;
  onRegenerate?: () => void;
  onSignOut?: () => void;
}

export default function SummaryCard({
  summary,
  buttonText,
  onRegenerate,
  onSignOut,
}: SummaryCardProps) {
  const [copied, setCopied] = useState<boolean>(false)
  const shareUrl = `${window.location.origin}/share/${summary.shareId}`
  const displayGreeting = `Greetings, ${summary.displayName}`;
  const date = new Date(summary.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  })

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="
        relative w-full max-w-sm sm:max-w-md md:max-w-lg
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
      {/* ── Sign Out ── */}
      <button
        onClick={onSignOut}
        className="
          absolute top-4 right-4
          font-body text-white/50 hover:text-white
          text-xs tracking-wide
          flex items-center gap-1.5
          transition-colors duration-200
        "
      >
        Sign Out
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Profile header ── */}
      <div className="flex items-center gap-4 pr-16">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/20 border-2 border-white/20 overflow-hidden flex items-center justify-center">
            {summary.avatarUrl ? (
              <img src={summary.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-9 h-9 text-white/30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          {/* Halo ring glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-400/20 to-cyan-300/10 blur-md -z-10" />
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
              bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300
              bg-clip-text text-transparent
            "
          >
            "{summary.personality}"
          </p>
        </div>
      </div>

      {/* ── Greeting + date ── */}
      <div className="flex flex-col gap-0.5">
        <p className="font-body text-white/60 text-xs sm:text-sm tracking-wide">
          {displayGreeting}
        </p>
        <p className="font-body text-white/40 text-xs tracking-wide">
          Date today: {date}
        </p>
      </div>

      {/* ── Narrative ── */}
      <p className="font-body text-white/60 text-xs sm:text-sm leading-relaxed">
        {summary.aiNarrative}
      </p>

      {/* ── Top Tracks ── */}
      <StatCard variant="tracks" tracks={summary.topTracks} />

      {/* ── Top Artists + Top Genres (side by side on sm+) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard variant="artists" artists={summary.topArtists} />
        <StatCard variant="genres" genres={summary.topGenres} />
      </div>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Primary: Share */}
        <button
          onClick={handleShare}
          className="
            font-display tracking-widest uppercase text-xs sm:text-sm
            bg-gradient-to-r from-purple-500 to-cyan-500
            hover:from-purple-400 hover:to-cyan-400
            text-white
            py-3 rounded-full
            shadow-[0_0_20px_2px_rgba(120,80,255,0.4)]
            hover:shadow-[0_0_28px_4px_rgba(120,80,255,0.6)]
            transition-all duration-300
            hover:scale-[1.02] active:scale-100
          "
        >
          Share My Vibe
        </button>

        {/* Secondary: Regenerate */}
        <button
          onClick={onRegenerate}
          className="
            font-display tracking-widest uppercase text-xs sm:text-sm
            bg-white/5 hover:bg-white/10
            border border-white/15 hover:border-white/30
            text-white/80 hover:text-white
            py-3 rounded-full
            transition-all duration-300
            hover:scale-[1.02] active:scale-100
          "
        >
          {buttonText ?? "Regenerate"}
        </button>
      </div>
    </div>
  );
}
