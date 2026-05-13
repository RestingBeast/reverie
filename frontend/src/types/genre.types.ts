export type GenreInfo = {
	genres: string[],
	avatarUrl: string
}

export type GenreCountInfo = {
	genre: string;
	playCount: number;
}

export type GenreMap = Map<string, GenreInfo>;

export type GenreCountMap = Map<string, GenreCountInfo>;
