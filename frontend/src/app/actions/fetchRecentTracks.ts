"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { PlayHistory } from "@spotify/web-api-ts-sdk";
import type { ArtistMap } from "@/types/artist.types"
import type { TrackMap } from "@/types/track.types";

export async function fetchRecentTracks() {
  const trackMap: TrackMap = new Map();
  const artistMap: ArtistMap = new Map();

  const session = await getServerSession(authOptions);
  if (!session?.access_token) throw new Error("Not authenticated.");

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

    const data: {items: PlayHistory[]} = await res.json();
    if (!data.items || data.items.length === 0) {
      throw new Error(
        "No recent listening history found on your Spotify account.",
      );
    }

    for (const item of data.items) {
			const track = item.track;
			const artist = track.artists[0];

			trackMap.set(track.id, {
				trackId: track.id,
				name: track.name,
				artist: artist.name,
				playCount: (trackMap.get(track.id)?.playCount || 0) + 1,
        albumCover: track.album.images[0].url
			});

			artistMap.set(artist.id, {
				artistId: artist.id,
				name: artist.name,
				playCount: (artistMap.get(artist.id)?.playCount || 0) + 1,
        avatarUrl: "",
        genres: []
			})
		}

    return {
      artistMap,
      trackMap
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to reach Spotify. Check your connection.");
  }
}
