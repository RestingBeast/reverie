"use client";

import { processListeningHistory } from "@/app/actions/processListeningHistory";
import { Dispatch, SetStateAction } from "react";

export function GenerateButton({
  setError,
}: {
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const handleGenerate = async () => {
    try {
      const info = await processListeningHistory();
      console.log(info);
      // forward tracks to the backend
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };
  return <button onClick={handleGenerate}>Generate My Vibecheck</button>;
}
