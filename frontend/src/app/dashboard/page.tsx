"use client";

import Image from "next/image";
import SummaryCard from "@/components/SummaryCard";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { processListeningHistory } from "@/app/actions/processListeningHistory";
import { Summary } from "@/types/summary.types";
import GenerateButton from "@/components/GenerateButton";
import { SonicLoading } from "@/components/animations/SonicLoading";
import MainLayout from "@/components/layouts/MainLayout";

export default function ResultPage() {
  const { data: session, status } = useSession();
  const [summary, setSummary] = useState<Summary | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch + process tracks in Next.js (access token stays here)
      const { spotifyUserId, displayName, avatarUrl, tracks, artists, genres } =
        await processListeningHistory();
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
              "avatarUrl": "${avatarUrl}",
              "tracks": ${JSON.stringify(Array.from(tracks.values()))},
              "artists": ${JSON.stringify(Array.from(artists.values()))},
              "genres": ${JSON.stringify(Array.from(genres.values()))}
            }`,
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate summary.");
      }

      const data: Summary = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Internal Server Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Error */}
      {error && (
        <div
          className="z-10 absolute top-16 left-1/2 -translate-x-1/2
              bg-red-900/40 border border-red-700 text-red-300
              rounded-lg px-4 py-3 mb-6 text-sm"
        >
          {error}
        </div>
      )}

      {/* Pre-generation state */}
      {!summary && !loading && status == "authenticated" && (
        <div
          className="
              relative w-full max-w-sm sm:max-w-md md:max-w-lg
              bg-[#0e0c1e]/80 backdrop-blur-xl
              border border-white/10
              rounded-3xl
              shadow-[0_0_80px_-10px_rgba(120,80,255,0.35)]
              overflow-hidden
              mx-auto mt-24
              p-5 sm:p-6 md:p-8
              flex flex-col gap-5
              items-center justify-center
            "
        >
          <div className="relative w-32 h-32">
            <Image
              src={session?.user?.image!}
              alt="profile-image"
              fill
              className="rounded-full object-cover border-2 border-white/20"
            />
          </div>
          <h1 className="text-zinc-400 text-2xl">
            Hey, {session?.user.name} 👋
          </h1>
          <p className="text-zinc-400 text-center sm:test-sm">
            While we scan your sonic echoes, your unique narrative is beginning
            to take shape.
          </p>
          <GenerateButton
            onClick={handleGenerate}
            loading={loading}
            label={"Decode my Sonic Self"}
          />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <SonicLoading text="Extracting sonic blueprints..." />
        </div>
      )}

      {/* Card centered on page */}
      {summary && !loading && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-24">
          <SummaryCard
            summary={summary}
            onRegenerate={() => console.log("regenerate")}
          />
        </div>
      )}
    </MainLayout>
  );
}
