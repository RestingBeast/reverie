export type ArtistInfo = {
  artistId: string;
  name: string;
  playCount: number;
  genres: string[];
  avatarUrl: string;
  popularity?: number;
  spotifyUrl: string;
};

export type ArtistMap = Map<string, ArtistInfo>;
