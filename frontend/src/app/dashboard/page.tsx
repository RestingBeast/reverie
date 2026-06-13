"use client";

import Image from "next/image";
import SummaryCard from "@/components/SummaryCard";
import SummaryHistory from "@/components/SummaryHistory";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { processListeningHistory } from "@/actions/processListeningHistory";
import { fetchUserSummaries } from "@/actions/fetchUserSummaries";
import { deleteSummary } from "@/actions/deleteSummary";
import { generateSummary } from "@/actions/generateSummary";
import type { Summary } from "@/types/summary.types";
import { SonicLoading } from "@/components/animations/SonicLoading";
import MainLayout from "@/components/layouts/MainLayout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserSummaries()
        .then(setSummaries)
        .catch(() => {})
        .finally(() => setInitialLoading(false));
    }
  }, [status]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const { spotifyUserId, displayName, avatarUrl, tracks, artists, genres } =
        await processListeningHistory();
      const data = await generateSummary({
        spotifyUserId,
        displayName,
        avatarUrl,
        tracks,
        artists,
        genres,
      });
      setSummaries((prev) => [data, ...prev]);
      setSelectedSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Internal Server Error.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (shareId: string) => {
    setError(null);
    try {
      await deleteSummary(shareId);
      setSummaries((prev) => prev.filter((s) => s.shareId !== shareId));
      if (selectedSummary?.shareId === shareId) {
        setSelectedSummary(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleShare = async (shareId: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
    await navigator.clipboard.writeText(`${baseUrl}/share/${shareId}`);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === "loading" || initialLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center min-h-[60vh]">
          <SonicLoading text="Tuning in..." />
        </div>
      </MainLayout>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <MainLayout>
      {error && (
        <div className="z-10 absolute top-16 left-1/2 -translate-x-1/2 bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center pt-24 pb-16 px-4">
        <div className="w-full max-w-lg flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          <p className="font-body text-white/80 text-base flex-1 truncate">
            Hey, {session.user.name}
          </p>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="
              font-display text-xs tracking-wide
              px-5 py-2 rounded-full
              bg-linear-to-r from-coral to-amber
              text-white
              shadow-[0_0_16px_2px_rgba(255,107,138,0.35)]
              hover:shadow-[0_0_24px_4px_rgba(255,107,138,0.55)]
              hover:scale-[1.02] active:scale-100
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {generating ? "Generating..." : "New Reverie"}
          </button>
        </div>

        {generating && (
          <div className="mb-6">
            <SonicLoading text="Weaving your reverie..." />
          </div>
        )}

        <SummaryHistory
          summaries={summaries}
          onSelect={setSelectedSummary}
          onDelete={handleDelete}
          onShare={handleShare}
        />

        {summaries.length === 0 && !generating && (
          <div className="flex flex-col items-center gap-2 mt-12 text-center">
            <p className="font-body text-white/40 text-sm tracking-wide">
              No reveries yet. Tap the button above to create your first one.
            </p>
          </div>
        )}
      </div>

      {selectedSummary && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 pb-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedSummary(null)}
        >
          <div
            className="w-full max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedSummary(null)}
                className="text-white/50 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <SummaryCard
              summary={selectedSummary}
              readonly={false}
              buttonText="Close"
              onRegenerate={() => setSelectedSummary(null)}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
