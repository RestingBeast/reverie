import mongoose from "mongoose";
import { nanoid } from "nanoid";

const SummarySchema = new mongoose.Schema({
  spotifyUserId: { type: String, required: true },
  displayName: { type: String },
  topTracks: [
    {
      trackId: String,
      name: String,
      artist: String,
      playCount: Number,
    },
  ],
  topArtists: [
    {
      artistId: String,
      name: String,
      playCount: Number,
      genres: [String],
    },
  ],
  topGenres: [
    {
      genre: String,
      playCount: Number,
    },
  ],
  aiNarrative: { type: String, required: true },
  shareId: { type: String, default: () => nanoid(10), unique: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Summary", SummarySchema);
