import Summary from "../models/summary.model.js";
import { generateNarrative } from "../services/ai/index.js";

export const GetSummary = async (req, res) => {
  try {
    const { shareId } = req.params;
    const summary = await Summary.findOne({ shareId }).exec();

    if (!summary) {
      return res.status(404).json({
        message: `Summary with shareId ${shareId} not found.`,
      });
    }

    return res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function buildPrompt({ tracks, artists, genres, displayName }) {
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

  return `
    You are the core processor of Sonic Self, an advanced system that decodes human identity through frequency and sound.
    Based on the sonic data stream below, generate a diagnostic report for the subject:

    1. PERSONALITY: A high-precision identification tag for this subject's sonic profile (max 6 words).
      - Style: Noir, technical, or ethereal. 
      - Avoid "The [Noun]" templates. Use sharper, descriptive states.
      - Examples: "Synchronized Urban Melancholy", "Neon Pulse Architect", "Lost Frequency Drifter"

    2. NARRATIVE: A decrypted narrative (3-5 sentences) translating the subject's current frequency into words.
      - Focus: Treat their listening as a literal physical space or a digital ghost.
      - Reference: Specific artists, tracks, and genres from the data.
      - Tone: Atmospheric, observant, and slightly detached — like an AI observing a soul through a terminal.
      - Constraints: Do not use generic praise like "eclectic taste." Do not mention numbers/counts. Avoid "waving" or "friendly" openers.
      - Narrative Voice: You are the interface, observing the subject from within the machine.

    Return your response in this exact JSON format with no extra text:
    {
      "personality": "...",
      "narrative": "..."
    }

    ---
    DATA STREAM FOR SUBJECT:

    [ SIGNAL HISTORY ]
    ${trackLines}

    [ ARCHITECTS / GENRES ]
    ${artistLines}

    [ FREQUENCY WEIGHTS ]
    ${genreLines}
    `;
}

function cleanJsonString(rawResponse) {
  return rawResponse.replace(/```json|```/gi, "").trim();
}

export async function generateSummary(req, res) {
  const {
    spotifyUserId,
    displayName,
    avatarUrl,
    tracks,
    artists,
    popularity,
    genres,
  } = req.body;

  if (!tracks?.length || !artists?.length || !spotifyUserId) {
    return res.status(400).json({ error: "Missing required listening data." });
  }

  try {
    const prompt = buildPrompt({ tracks, artists, genres, displayName });
    const raw = await generateNarrative(prompt);
    const parsed = JSON.parse(cleanJsonString(raw));
    const personality = parsed.personality;
    const narrative = parsed.narrative;

    if (!personality || !narrative)
      throw new Error("Missing fields in AI response");

    const summary = await Summary.create({
      spotifyUserId,
      displayName,
      popularity,
      avatarUrl,
      topTracks: tracks.sort((a, b) => b.playCount - a.playCount).splice(0, 4),
      topArtists: artists
        .sort((a, b) => b.playCount - a.playCount)
        .splice(0, 3),
      topGenres: genres.sort((a, b) => b.playCount - a.playCount).splice(0, 3),
      personality,
      aiNarrative: narrative,
    });

    return res.status(201).json(summary);
  } catch (err) {
    console.log("Summary generation failed", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
