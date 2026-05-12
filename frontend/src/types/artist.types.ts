type ArtistInfo = {
	artistId: string;
	name: string;
	playCount: number;
	genres: string[];
}

export type ArtistMap = Map<string, ArtistInfo>;
