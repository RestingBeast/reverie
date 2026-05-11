import Summary from "../models/summary.model.js";

export const CreateSummary = async (req, res) => {
  try {
    // const newSummary = new Summary(req.body);
    const newSummary = new Summary({
      spotifyUserId: "test",
      displayName: "test",
      topTracks: [],
      topArtists: [],
      topGenres: [],
      aiNarrative: "hello",
    });
    const savedSummary = await newSummary.save();
    res.status(201).json(savedSummary.shareId);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const GetSummary = async (req, res) => {
  try {
    const { shareId } = req.params;
    const summary = await Summary.findOne({ shareId }).exec();
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
