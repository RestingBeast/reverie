import { fetchSharedSummary } from "@/actions/fetchSharedSummary";
import SummaryCard from "@/components/SummaryCard";
import MainLayout from "@/components/layouts/MainLayout";
import { notFound } from "next/navigation";
import type { Summary } from "@/types/summary.types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  let summary: Summary | null = null;
  try {
    summary = await fetchSharedSummary(shareId);
  } catch (err) {
    notFound();
  }

  if (!summary) {
    notFound();
  }

  return (
    <MainLayout isPublic>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-24">
        <SummaryCard
          summary={summary}
          buttonText="Find your own Reverie"
          readonly
        />
      </div>
    </MainLayout>
  );
}
