"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { PlayHistory } from "@spotify/web-api-ts-sdk";

export async function fetchRecentTracks() {
  const session = await getServerSession(authOptions);

  if (!session?.access_token) throw new Error("Not authenticated.");

  let data: { items: PlayHistory[] };
  try {
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      },
    );
    if (res.status === 401) {
      throw new Error("Spotify session expired. Please log in again.");
    }
    if (res.status === 403) {
      throw new Error("Missing Spotify permissions.");
    }
    if (res.status === 429) {
      throw new Error("Too many requests to Spotify. Please wait a moment.");
    }
    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.status}`);
    }
    data = await res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to reach Spotify. Check your connection.");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error(
      "No recent listening history found on your Spotify account.",
    );
  }

  return {
    tracks: data.items,
    spotifyUserId: session.user.userId,
    displayName: session.user.name,
  };
}
