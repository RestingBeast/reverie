"use client";

import { fetchRecentTracks } from "@/app/actions/fetchRecentTracks";
import { Dispatch, SetStateAction } from "react";

export function GenerateButton({
  setError,
}: {
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const handleGenerate = async () => {
    try {
      const tracks = fetchRecentTracks();
      // forward tracks to the backend
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };
  return <button onClick={handleGenerate}>Generate My Vibecheck</button>;
}
