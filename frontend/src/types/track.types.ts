type TrackInfo = {
	trackId: string,
	name: string,
	artist: string,
	playCount: number,
}

export type TrackMap = Map<string, TrackInfo>;
