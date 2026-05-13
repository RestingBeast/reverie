"use client"

import { useState } from "react";
import type { Summary } from "@/types/summary.types";

export default function SummaryCard({ summary }: { summary: Summary }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/share/${summary.shareId}`

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const date = new Date(summary.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Personality + date */}
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{date}</p>
        <h2 className="text-3xl font-bold text-green-400">"{summary.personality}"</h2>
      </div>

      {/* AI Narrative */}
      <p className="text-zinc-300 leading-relaxed">{summary.aiNarrative}</p>

      {/* Stats — top 3 each */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Top Tracks" items={summary.topTracks.slice(0, 3).map(t => t.name)} />
        <StatCard title="Top Artists" items={summary.topArtists.slice(0, 3).map(a => a.name)} />
        <StatCard title="Top Genres" items={summary.topGenres.slice(0, 3).map(g => g.genre)} />
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full border border-zinc-700 hover:border-green-500 text-zinc-300
                   hover:text-green-400 rounded-full py-3 text-sm transition"
      >
        {copied ? "Link copied!" : "Share My Vibecheck"}
      </button>

    </div>
  )
}

function StatCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2">
      <p className="text-zinc-500 text-xs uppercase tracking-widest">{title}</p>
      <ol className="flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-white truncate">
            <span className="text-zinc-600 mr-1">{i + 1}.</span>{item}
          </li>
        ))}
      </ol>
    </div>
  )
}
