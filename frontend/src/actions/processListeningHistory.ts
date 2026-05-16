"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentTracks } from "./fetchRecentTracks";
import { fetchArtistGenres } from "./fetchArtistGenres";

export async function processListeningHistory() {
  const session = await getServerSession(authOptions);
  if (!session?.access_token) throw new Error("Not authenticated");

  try {
    const { artistMap, trackMap } = await fetchRecentTracks();
    const { genreMap, genreCountMap } = await fetchArtistGenres([
      ...artistMap.keys(),
    ]);

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
