import Summary from "../models/summary.model.js";
import {
  generateSummarySchema,
  getSummarySchema,
} from "../schema/summary.schema.js";
import { generateNarrative } from "../services/ai/index.js";
import z from "zod";

export const getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({
      spotifyUserId: req.spotifyUserId,
    })
      .sort({ generatedAt: -1 })
      .exec();
    return res.status(200).json(summaries);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteSummary = async (req, res) => {
  try {
    const { shareId } = req.params;
    const summary = await Summary.findOne({ shareId }).exec();
    if (!summary) {
      return res.status(404).json({ message: "Summary not found." });
    }
    if (summary.spotifyUserId !== req.spotifyUserId) {
      return res.status(403).json({ error: "Forbidden." });
    }
    await Summary.deleteOne({ shareId }).exec();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetSummary = async (req, res) => {
  try {
    getSummarySchema.parse(req.params);
    const { shareId } = req.params;
    const summary = await Summary.findOne({ shareId }).exec();

    if (!summary) {
      return res.status(404).json({
        message: `Summary with shareId ${shareId} not found.`,
      });
    }

    return res.status(200).json(summary);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json(err.issues);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function buildPrompt({ tracks, artists, genres, displayName, timeSlotLabel }) {
  const trackLines = tracks
    .sort((a, b) => b.playCount - a.playCount)
    .map(
      (t, i) =>
        ` ${i + 1}. "${t.name}" by ${t.artist} - played ${t.playCount}x`,
    )
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

  const sessionContext = timeSlotLabel
    ? `This covers ${displayName}'s listening from ${timeSlotLabel}.`
    : `This covers ${displayName}'s recently played tracks.`;

  return `
    You are Reverie, a witty and insightful music personality analyser and story crafter.
    Based on the listening data below, write two things:
    ${sessionContext}
    1. PERSONALITY: A short, punchy label for this listener's music personality (max 6 words).
      Examples: "The Midnight Overthinker", "Caffeinated Indie Daydreamer"
      - Try to draw inspiration from the top genres in the data
    2. NARRATIVE: A personal, engaging summary (3-5 sentences) of ${displayName}'s recent listening.
      - Reference specific artists, tracks, and genres from the data
      - Be observational and fun, like a friend who really knows their music taste
      - Avoid generic statements like "you have eclectic taste"
      - Do not mention play counts or numbers directly — weave them naturally into the narrative
      - Tone: warm, witty, slightly poetic
    Return your response in this exact JSON format with no extra text or not in md format:
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
    `;
}

function selectTopTracks(tracks, count) {
  const pool = [...tracks].sort((a, b) => b.playCount - a.playCount);
  const selected = [];
  const usedArtists = new Set();

  for (let i = 0; i < count && pool.length > 0; i++) {
    let best = 0;
    for (let j = 0; j < pool.length; j++) {
      const aSelected = usedArtists.has(pool[j].artist);
      const bSelected = usedArtists.has(pool[best].artist);

      const preferJ =
        pool[j].playCount > pool[best].playCount ||
        (pool[j].playCount === pool[best].playCount && !aSelected && bSelected);

      if (preferJ) best = j;
    }
    selected.push(pool[best]);
    usedArtists.add(pool[best].artist);
    pool.splice(best, 1);
  }

  return selected;
}

function selectRelatedArtists(topTracks, allArtists, count) {
  const usedArtistNames = new Set(topTracks.map((t) => t.artist));
  const selected = [];
  const picked = new Set();

  for (const name of usedArtistNames) {
    const match = allArtists.find((a) => a.name === name);
    if (match) {
      selected.push(match);
      picked.add(name);
    }
  }

  selected.sort((a, b) => b.playCount - a.playCount);

  if (selected.length < count) {
    const remaining = allArtists
      .filter((a) => !picked.has(a.name))
      .sort((a, b) => b.playCount - a.playCount);
    selected.push(...remaining.slice(0, count - selected.length));
  }

  return selected;
}

function cleanJsonString(rawResponse) {
  return rawResponse.replace(/```json|```/gi, "").trim();
}

export async function generateSummary(req, res) {
  try {
    generateSummarySchema.parse(req.body);
    const spotifyUserId = req.spotifyUserId;
    const { displayName, avatarUrl, tracks, artists, genres, timeSlotLabel } = req.body;
    const prompt = buildPrompt({ tracks, artists, genres, displayName, timeSlotLabel });
    const raw = await generateNarrative(prompt);
    const parsed = JSON.parse(cleanJsonString(raw));
    const personality = parsed.personality;
    const narrative = parsed.narrative;

    if (!personality || !narrative)
      throw new Error("Missing fields in AI response");

    const selectedTopTracks = selectTopTracks(tracks, 4);
    const summary = await Summary.create({
      spotifyUserId,
      displayName,
      avatarUrl,
      topTracks: selectedTopTracks,
      topArtists: selectRelatedArtists(selectedTopTracks, artists, 3),
      topGenres: genres.sort((a, b) => b.playCount - a.playCount).splice(0, 3),
      personality,
      aiNarrative: narrative,
    });

    return res.status(201).json(summary);
  } catch (err) {
    console.log("Summary generation failed", err);
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.issues });
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
