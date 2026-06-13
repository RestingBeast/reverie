import z from "zod";

const maxChar = {
  error: "Maximum 256 characters",
};

const invalidPlayCount = {
  error: "Play count must be greater than 0",
};

const invalidUrl = {
  error: "Not a valid URL",
};

const track = z.object({
  trackId: z.string().max(256, maxChar),
  name: z.string().max(256, maxChar),
  artist: z.string().max(256, maxChar),
  playCount: z.number().gt(0, invalidPlayCount),
  albumCover: z.url(invalidUrl),
  spotifyUrl: z.url(invalidUrl),
});

const artist = z.object({
  artistId: z.string().max(256, maxChar),
  name: z.string().max(256, maxChar),
  playCount: z.number().gt(0, invalidPlayCount),
  genres: z.array(z.string().max(256, maxChar)).max(30),
  avatarUrl: z.url(invalidUrl).startsWith("https://", { error: "Must be an HTTPS URL" }),
  popularity: z.number().min(0).max(100),
  spotifyUrl: z.url(invalidUrl),
});

const genre = z.object({
  genre: z.string().max(256, maxChar),
  playCount: z.number().gt(0, invalidPlayCount),
});

export const generateSummarySchema = z.object({
  displayName: z.string().max(256, maxChar),
  avatarUrl: z.url(invalidUrl).startsWith("https://", { error: "Must be an HTTPS URL" }),
  tracks: z.array(track).max(50, {
    error: "Maximum 50 tracks",
  }),
  artists: z.array(artist).max(50, {
    error: "Maximum 50 artists",
  }),
  genres: z.array(genre).max(50, {
    error: "Maximum 50 genres",
  }),
  timeSlotLabel: z.string().optional(),
});

export const getSummarySchema = z.object({
  shareId: z.string().length(10, {
    error: "Not a valid shareId",
  }),
});
