import mongoose from "mongoose";
import { nanoid } from "nanoid";

const SummarySchema = new mongoose.Schema({
  spotifyUserId: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  topTracks: [
    {
      trackId: String,
      name: String,
      artist: String,
      playCount: Number,
      albumCover: String,
    },
  ],
  topArtists: [
    {
      artistId: String,
      name: String,
      playCount: Number,
      genres: [String],
      avatarUrl: String,
      popularity: Number,
    },
  ],
  topGenres: [
    {
      genre: String,
      playCount: Number,
    },
  ],
  aiNarrative: { type: String, required: true },
  personality: { type: String, required: true },
  shareId: { type: String, default: () => nanoid(10), unique: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Summary", SummarySchema);
