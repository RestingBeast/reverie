"use server";

import { getServerSession } from "next-auth";
import { SignJWT } from "jose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { ArtistMap } from "@/types/artist.types";
import type { GenreCountMap } from "@/types/genre.types";
import type { Summary } from "@/types/summary.types";
import type { TrackMap } from "@/types/track.types";

interface Props {
  displayName: string | null | undefined;
  avatarUrl: string | null | undefined;
  tracks: TrackMap;
  artists: ArtistMap;
  genres: GenreCountMap;
  timeSlotLabel?: string;
}

interface GenSuccess {
  success: true;
  data: Summary;
}

interface GenError {
  success: false;
  error: string;
}

type GenResult = GenSuccess | GenError;

async function mintInternalToken(spotifyUserId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return new SignJWT({ sub: spotifyUserId, iss: "Reverie Client" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60s")
    .sign(secret);
}

export const generateSummary = async ({
  displayName,
  avatarUrl,
  tracks,
  artists,
  genres,
  timeSlotLabel,
}: Props): Promise<GenResult> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Not Authenticated" };
    }
    const token = await mintInternalToken(session.user.userId);
    const body = JSON.stringify({
      displayName,
      avatarUrl,
      tracks: [...tracks.values()],
      artists: [...artists.values()],
      genres: [...genres.values()],
      timeSlotLabel,
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
      return {
        success: false,
        error: err.error || "Failed to generate summary.",
      };
    }
    const data: Summary = await res.json();

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal Server Error",
    };
  }
};
