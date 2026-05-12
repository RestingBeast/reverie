"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Artist } from "@spotify/web-api-ts-sdk";

export async function fetchArtistGenres(
	artistsIds: string[]
){
	const session = await getServerSession(authOptions);
	if (!session?.access_token) throw new Error("Not authenticated");

	try {
		const ids = artistsIds.join(",");
		const res = await fetch(
			`https://api.spotify.com/v1/artists/?ids=${ids}`,
			{
				headers: { Authorization: `Bearer ${session.access_token}`},
			}
		)
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
		const data: {artists: Artist[]} = await res.json();

		const genreMap = new Map<string, string[]>();
		for (const artist of data.artists) {
			genreMap.set(artist.id, artist.genres || []);
		}

		const genreCountMap = new Map<string, number>()
		for (const artist of data.artists) {
			for (const genre of artist.genres) {
				genreCountMap.set(genre, (genreCountMap.get(genre) || 0) + 1)
			}
		}

		return {
			genreMap,
			genreCountMap
		};
	} catch (err) {
		if (err instanceof Error) throw err;
		throw new Error("Failed to reach Spotify. Check your connection.");
	}
}
