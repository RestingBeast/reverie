export type ArtistInfo = {
  artistId: string;
  name: string;
  playCount: number;
  genres: string[];
  avatarUrl: string;
  popularity?: number;
};

export type ArtistMap = Map<string, ArtistInfo>;
