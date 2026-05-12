import Summary from "../models/summary.model.js";
import { generateNarrative } from "../services/ai/index.js";

export const GetSummary = async (req, res) => {
  try {
    const { shareId } = req.params;
    const summary = await Summary.findOne({ shareId }).exec();
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function buildPrompt({ tracks, artists, genres, displayName}){
  const trackLines = tracks
    .sort((a, b) => b.playCount - a.playCount)
    .map((t, i) => ` ${i + 1}. "${t.name}" by ${t.artist} - played ${t.playCount}x`)
    .join("\n");

  const artistLines = artists
    .sort((a, b) => b.playCount - a.playCount)
    .map((a, i) => {
      const genres = a.genres.length > 0 ? `[${a.genres.join(", ")}]` : "";
      return ` ${i + 1}. ${a.name} ${genres} - played ${a.playCount}x`;
    })
    .join("\n");

    const genreLines = genres
      .sort((a, b) => b.playCount - a.playCount)
      .map((g, i) => ` ${i + 1}. ${g.genre} - played ${g.playCount}x`)
      .join("\n");

    return `
    You are Vibecheck, a witty and insightful music personality analyser.
    Based on the listening data below, write two things:

    1. PERSONALITY: A short, punchy label for this listener's music personality (max 6 words).
      Examples: "The Midnight Overthinker", "Caffeinated Indie Daydreamer"
      - Try to draw inspiration from the top genres in the data

    2. NARRATIVE: A personal, engaging summary (3-5 sentences) of ${displayName}'s recent listening.
      - Reference specific artists, tracks, and genres from the data
      - Be observational and fun, like a friend who really knows their music taste
      - Avoid generic statements like "you have eclectic taste"
      - Do not mention play counts or numbers directly — weave them naturally into the narrative
      - Tone: warm, witty, slightly poetic

    Return your response in this exact JSON format with no extra text:
    {
      "personality": "...",
      "narrative": "..."
    }

    ---
    LISTENING DATA FOR ${displayName}:

    Tracks played recently (full history, ranked by play count):
    ${trackLines}

    Artists (with genres, ranked by play count):
    ${artistLines}

    Genre breakdown (weighted by plays):
    ${genreLines}
    `
}

export async function generateSummary(req, res) {
  const { spotifyUserId, displayName, tracks, artists, genres } = req.body;

  if (!tracks?.length || !artists?.length || !spotifyUserId) {
    return res.status(400).json({error: "Missing required listening data."});
  }

  try {
    const prompt = buildPrompt({ tracks, artists, genres, displayName});
    const raw = await generateNarrative(prompt);
    const parsed = JSON.parse(raw);
    const personality = parsed.personality;
    const narrative = parsed.narrative;

    if (!personality || !narrative) throw new Error("Missing fields in AI response");

    const summary = await Summary.create({
      spotifyUserId,
      displayName,
      topTracks: tracks.sort((a, b) => b.playCount - a.playCount).splice(0, 3),
      topArtists: artists.sort((a, b) => b.playCount - a.playCount).splice(0, 3),
      topGenres: genres.sort((a, b) => b.playCount - a.playCount).splice(0, 3),
      personality,
      aiNarrative: narrative
    })

    return res.status(201).json({
      shareId: summary.shareId,
    })
  } catch (err) {
    console.log("Summary generation failed", err);
    return res.status(500).json({ error: "Internal Server Error."});
  }
}
