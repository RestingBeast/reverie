"use server";

import type { Summary } from "@/types/summary.types";

export async function fetchSharedSummary(shareId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000"}/api/summaries/${shareId}`,
      { cache: "force-cache" },
    );
    if (!res.ok) throw new Error("Reverie Not Found");
    const summary: Summary = await res.json();
    return summary;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Internal Server Error");
  }
}
