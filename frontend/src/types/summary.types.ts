import type { TrackInfo } from "./track.types";
import type { ArtistInfo } from "./artist.types";
import type { GenreCountInfo } from "./genre.types";

export type Summary = {
	spotifyUserId: string;
	displayName: string;
	avatarUrl: string;
	topTracks: TrackInfo[];
	topArtists: ArtistInfo[];
	topGenres: GenreCountInfo[];
	aiNarrative: string;
	personality: string;
	shareId: string;
	generatedAt: string;
}
