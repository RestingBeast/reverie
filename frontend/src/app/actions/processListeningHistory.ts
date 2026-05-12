"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentTracks } from "./fetchRecentTracks";
import { fetchArtistGenres } from "./fetchArtistGenres";

export async function processListeningHistory(){

	const session = await getServerSession(authOptions);
	if (!session?.access_token) throw new Error("Not authenticated");

	try {
		const { artistMap, trackMap } = await fetchRecentTracks();
		const genreMap = await fetchArtistGenres([...artistMap.keys()]);

		return {
			spotifyUserId: session.user.userId,
			displayName: session.user.name,
			tracks: trackMap,
			artists: artistMap,
			genres: genreMap,
		}
	} catch (err) {
		if (err instanceof Error) throw err;
		throw new Error("Internal Server Error");
	}
}
