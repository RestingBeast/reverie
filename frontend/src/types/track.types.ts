export type TrackInfo = {
	trackId: string,
	name: string,
	artist: string,
	playCount: number,
	albumCover: string,
}

export type TrackMap = Map<string, TrackInfo>;
