"use server";

import { ArtistMap } from "@/types/artist.types";
import { GenreCountMap } from "@/types/genre.types";
import { Summary } from "@/types/summary.types";
import { TrackMap } from "@/types/track.types";

interface Props {
  spotifyUserId: string;
  displayName: string | null | undefined;
  avatarUrl: string | null | undefined;
  tracks: TrackMap;
  artists: ArtistMap;
  genres: GenreCountMap;
}

export const generateSummary = async ({
  spotifyUserId,
  displayName,
  avatarUrl,
  tracks,
  artists,
  genres,
}: Props) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/summaries/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": process.env.INTERNAL_API_SECRET!,
        },
        body: `{
                  "spotifyUserId": "${spotifyUserId}",
                  "displayName": "${displayName}",
                  "avatarUrl": "${avatarUrl}",
                  "tracks": ${JSON.stringify(Array.from(tracks.values()))},
                  "artists": ${JSON.stringify(Array.from(artists.values()))},
                  "genres": ${JSON.stringify(Array.from(genres.values()))}
                }`,
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate summary.");
    }
    const data: Summary = await res.json();

    return data;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Internal Server Error");
  }
};
