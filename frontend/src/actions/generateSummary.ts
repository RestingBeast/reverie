"use server";

import { getServerSession } from "next-auth";
import { SignJWT } from "jose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { ArtistMap } from "@/types/artist.types";
import type { GenreCountMap } from "@/types/genre.types";
import type { Summary } from "@/types/summary.types";
import type { TrackMap } from "@/types/track.types";

interface Props {
  spotifyUserId: string;
  displayName: string | null | undefined;
  avatarUrl: string | null | undefined;
  tracks: TrackMap;
  artists: ArtistMap;
  genres: GenreCountMap;
}

async function mintInternalToken(spotifyUserId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return new SignJWT({ sub: spotifyUserId, iss: "Sonic-Self Client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30s")
    .sign(secret);
}

export const generateSummary = async ({
  spotifyUserId,
  displayName,
  avatarUrl,
  tracks,
  artists,
  genres,
}: Props): Promise<Summary> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Not Authenticated");
    const token = await mintInternalToken(spotifyUserId);
    const body = JSON.stringify({
      displayName,
      avatarUrl,
      tracks: [...tracks.values()],
      artists: [...artists.values()],
      genres: [...genres.values()],
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000"}/api/summaries/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body,
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
