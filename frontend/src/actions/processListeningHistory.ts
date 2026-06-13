"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentTracks } from "./fetchRecentTracks";
import { fetchArtistGenres } from "./fetchArtistGenres";

const MIN_TRACKS = 3;

export async function processListeningHistory(opts?: { after?: number }) {
  const session = await getServerSession(authOptions);
  if (!session?.access_token) throw new Error("Not authenticated");

  try {
    const { artistMap, trackMap } = await fetchRecentTracks(opts);
    const { genreMap, genreCountMap } = await fetchArtistGenres([
      ...artistMap.keys(),
    ]);

    if (trackMap.size < MIN_TRACKS) {
      throw new Error(
        "Not enough listening in this window to weave a reverie. Try a broader time slot.",
      );
    }

    for (const item of artistMap) {
      artistMap.set(item[0], {
        artistId: item[1].artistId,
        name: item[1].name,
        playCount: item[1].playCount,
        genres: genreMap.get(item[0])?.genres || [],
        avatarUrl: genreMap.get(item[0])?.avatarUrl || "",
        popularity: genreMap.get(item[0])?.popularity || 0,
        spotifyUrl: item[1].spotifyUrl,
      });
    }

    return {
      spotifyUserId: session.user.userId,
      displayName: session.user.name,
      avatarUrl: session.user.image,
      tracks: trackMap,
      artists: artistMap,
      genres: genreCountMap,
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Internal Server Error");
  }
}
