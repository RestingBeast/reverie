"use client";

import SummaryCard from "@/components/SummaryCard";
import SummaryHistory from "@/components/SummaryHistory";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { processListeningHistory } from "@/actions/processListeningHistory";
import { fetchUserSummaries } from "@/actions/fetchUserSummaries";
import { deleteSummary } from "@/actions/deleteSummary";
import { generateSummary } from "@/actions/generateSummary";
import type { Summary } from "@/types/summary.types";
import { TIME_SLOTS, type TimeSlot } from "@/config/timeSlots";
import { SonicLoading } from "@/components/animations/SonicLoading";
import MainLayout from "@/components/layouts/MainLayout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserSummaries()
        .then(setSummaries)
        .catch(() => {})
        .finally(() => setInitialLoading(false));
    }
  }, [status]);

  const handleGenerate = async (slot: TimeSlot) => {
    setGenerating(true);
    setGeneratingLabel(slot.loadingLabel);
    setError(null);
    try {
      const after = slot.getAfter();
      const { spotifyUserId, displayName, avatarUrl, tracks, artists, genres } =
        await processListeningHistory({ after });
      const data = await generateSummary({
        spotifyUserId,
        displayName,
        avatarUrl,
        tracks,
        artists,
        genres,
        timeSlotLabel: slot.loadingLabel,
      });
      setSummaries((prev) => [data, ...prev]);
      setSelectedSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Internal Server Error.");
    } finally {
      setGenerating(false);
      setGeneratingLabel("");
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
    await navigator.clipboard.writeText(`${baseUrl}/share/${shareId}`);
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

  const isLowTrackError = error?.startsWith("Not enough listening") ?? false;

  return (
    <MainLayout>
      {error && (
        <div
          className={`z-10 absolute top-16 left-1/2 -translate-x-1/2 rounded-lg px-4 py-3 mb-6 text-sm ${
            isLowTrackError
              ? "bg-amber-900/30 border border-amber-700/50 text-amber-300"
              : "bg-red-900/40 border border-red-700 text-red-300"
          }`}
        >
          {error}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center pt-24 pb-16 px-4">
        {/* Compact header */}
        <div className="w-full max-w-xl flex flex-col items-center gap-4 mb-8">
          <div className="shrink-0 animate-float">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden">
              <img
                src="/everknight-dance.webp"
                alt="Animated character dancing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Time slot picker */}
        {!generating && (
          <div className="w-full max-w-xl mx-auto flex flex-col gap-6 mb-8">
            <p className="font-body text-white/40 text-xs tracking-mega uppercase px-1">
              Pick a moment to genereate your reverie
            </p>

            {/* Today */}
            <div>
              <p className="font-body text-white/30 text-xs tracking-wide px-1 mb-2">
                Today
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.filter((s) => s.group === "today").map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleGenerate(slot)}
                    className="
                      font-display text-sm tracking-wide
                      px-4 py-2 rounded-full
                      bg-white/4 border border-white/10
                      text-white/70
                      hover:bg-white/8 hover:border-coral/40 hover:text-white
                      active:scale-95
                      transition-all duration-200
                      cursor-pointer
                    "
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Yesterday */}
            <div>
              <p className="font-body text-white/30 text-xs tracking-wide px-1 mb-2">
                Yesterday
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.filter((s) => s.group === "yesterday").map(
                  (slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleGenerate(slot)}
                      className="
                      font-display text-sm tracking-wide
                      px-4 py-2 rounded-full
                      bg-white/4 border border-white/10
                      text-white/70
                      hover:bg-white/8 hover:border-coral/40 hover:text-white
                      active:scale-95
                      transition-all duration-200
                      cursor-pointer
                    "
                    >
                      {slot.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generating */}
        {generating && (
          <div className="mb-8">
            <SonicLoading text={`Weaving your ${generatingLabel} reverie...`} />
          </div>
        )}

        {/* History */}
        <SummaryHistory
          summaries={summaries}
          onSelect={setSelectedSummary}
          onDelete={handleDelete}
          onShare={handleShare}
        />

        {summaries.length === 0 && !generating && (
          <div className="flex flex-col items-center gap-2 mt-8 text-center">
            <p className="font-body text-white/40 text-sm tracking-wide">
              No reveries yet. Pick a time slot above to create your first one.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
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
