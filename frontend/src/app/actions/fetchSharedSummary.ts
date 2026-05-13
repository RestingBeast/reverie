import { Summary } from "@/types/summary.types";

export async function fetchSharedSummary(shareId: string) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/summaries/${shareId}`,
		)
		if (!res.ok) throw new Error("Summary Not Found");
		const summary: Summary = await res.json()
		return summary;
	} catch (err) {
		if (err instanceof Error) throw err;
		throw new Error("Internal Server Error");
	}
}
