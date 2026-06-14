"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Artist } from "@spotify/web-api-ts-sdk";
import type { GenreCountMap, GenreMap } from "@/types/genre.types";

export async function fetchArtistGenres(
  artists: { artistId: string; playCount: number }[],
) {
  const session = await getServerSession(authOptions);
  if (!session?.access_token) throw new Error("Not authenticated");

  try {
    const playCountByArtist = new Map(artists.map((a) => [a.artistId, a.playCount]));
    const ids = artists.map((a) => a.artistId).join(",");
    const res = await fetch(`https://api.spotify.com/v1/artists/?ids=${ids}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
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
    const data: { artists: Artist[] } = await res.json();

    const genreMap: GenreMap = new Map();
    for (const artist of data.artists) {
      genreMap.set(artist.id, {
        genres: artist.genres || [],
        avatarUrl:
          artist.images?.[0]?.url ??
          `${process.env.NEXT_PUBLIC_SITE_URL}/avatar-placeholder.svg`,
        popularity: artist.popularity,
      });
    }

    const genreCountMap: GenreCountMap = new Map();
    for (const artist of data.artists) {
      const count = playCountByArtist.get(artist.id) || 0;
      for (const genre of artist.genres) {
        genreCountMap.set(genre, {
          genre: genre,
          playCount: (genreCountMap.get(genre)?.playCount || 0) + count,
        });
      }
    }

    return {
      genreMap,
      genreCountMap,
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to reach Spotify. Check your connection.");
  }
}
