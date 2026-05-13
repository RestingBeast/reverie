"use client";

import SummaryCard2 from "@/components/SummaryCard";
import { use, useEffect, useState } from "react";
import type { Summary } from "@/types/summary.types";
import { fetchSharedSummary } from "@/app/actions/fetchSharedSummary";
import MainLayout from "@/components/layouts/MainLayout";

export default function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = use(params);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const getSummary = async () => {
      if (shareId) {
        const sum: Summary = await fetchSharedSummary(shareId);
        setSummary(sum);
      }
    };
    getSummary();
  }, [shareId]);

  return (
    <MainLayout>
      {summary && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-24">
          <SummaryCard2 summary={summary} buttonText="Generate my something" />
        </div>
      )}
    </MainLayout>
  );
}
