"use client";

import Image from "next/image";
import SummaryCard from "@/components/SummaryCard";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { processListeningHistory } from "@/actions/processListeningHistory";
import { Summary } from "@/types/summary.types";
import { SonicLoading } from "@/components/animations/SonicLoading";
import MainLayout from "@/components/layouts/MainLayout";
import ActionButton from "@/components/ActionButton";
import { generateSummary } from "@/actions/generateSummary";

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
      const data = await generateSummary({
        spotifyUserId,
        displayName,
        avatarUrl,
        tracks,
        artists,
        genres,
      });

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

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center min-h-[60vh]">
          <SonicLoading text="Booting up..." />
        </div>
      )}

      {/* Pre-generation state */}
      {!summary && !loading && status === "authenticated" && (
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
              loading="eager"
              alt="profile-image"
              fill
              sizes="200px"
              className="rounded-full object-cover border-2 border-white/20"
            />
          </div>
          <h1
            className="
              font-display text-[#f0ece4] text-2xl tracking-widest
              drop-shadow-[0_0_30px_rgba(220,200,255,0.3)]
            "
          >
            Hey, {session?.user.name}
          </h1>
          <p className="font-body text-[#b8a9c9]/60 text-lg tracking-mega mb-2 text-center">
            While we scan your sonic echoes, your unique narrative is beginning
            to take shape.
          </p>
          <ActionButton
            onClick={handleGenerate}
            buttonText={"Decode my Sonic Self"}
            className={`
              w-full
              bg-linear-to-r from-orange-400 to-pink-500
              hover:from-orange-300 hover:to-pink-400
              text-white
              shadow-[0_0_20px_2px_rgba(251,146,60,0.4)]
              hover:shadow-[0_0_28px_4px_rgba(251,146,60,0.6)]
            `}
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
          <SummaryCard summary={summary} onRegenerate={handleGenerate} />
        </div>
      )}
    </MainLayout>
  );
}
