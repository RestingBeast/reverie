// frontend/src/app/dashboard/page.tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { processListeningHistory } from "@/app/actions/processListeningHistory";
import SummaryCard from "@/components/SummaryCard";
import GenerateButton from "@/components/GenerateButton"
import SignOutOverlay from "@/components/animations/SignOutOverlay";
import type { Summary } from "@/types/summary.types";

export default function Dashboard() {
  const { data: session } = useSession()
  const [summary, setSummary]   = useState<Summary | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch + process tracks in Next.js (access token stays here)
      const { spotifyUserId, displayName, tracks, artists, genres } = await processListeningHistory();
      // 2. Send processed data to Express for AI generation + DB save
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/summaries/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: `{
            "spotifyUserId": "${spotifyUserId}",
            "displayName": "${displayName}",
            "tracks": ${JSON.stringify(Array.from(tracks.values()))},
            "artists": ${JSON.stringify(Array.from(artists.values()))},
            "genres": ${JSON.stringify(Array.from(genres.values()))}
          }`
        }
      );

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to generate summary.")
      }

      const data: Summary = await res.json()
      setSummary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Internal Server Error.")
    } finally {
      setLoading(false)
    }
  }
  const triggerSignOut = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      signOut({ callbackUrl: '/'});
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 max-w-2xl mx-auto">
      <SignOutOverlay isLoggingOut={isLoggingOut} message="Good bye..." />
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">Hey, {session?.user?.name} 👋</h1>
          <p className="text-zinc-400 text-sm mt-1">Let's see what your music says about you.</p>
        </div>
        <button
          onClick={triggerSignOut}
          className="text-xs text-zinc-500 hover:text-white transition"
        >
          Sign out
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Pre-generation state */}
      {!summary && !loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-zinc-400 text-sm max-w-xs">
            We'll analyse your recent Spotify listening and generate your personal vibe summary.
          </p>
          <GenerateButton onClick={handleGenerate} loading={loading} />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Reading your vibes...</p>
        </div>
      )}

      {/* Summary */}
      {summary && !loading && (
        <div className="flex flex-col gap-6">
          <SummaryCard summary={summary} />
          <div className="flex gap-3">
            <GenerateButton onClick={handleGenerate} loading={loading} label="Regenerate" />
          </div>
        </div>
      )}

    </main>
  )
}
