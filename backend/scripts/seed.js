import mongoose from "mongoose";
import Summary from "../src/models/summary.model.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGO_URI = process.env.MONGO_URI;

const summaries = [
  {
    spotifyUserId: "spotify_user_001",
    displayName: "Alex Rivera",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    topTracks: [
      {
        trackId: "t001",
        name: "Blinding Lights",
        artist: "The Weeknd",
        playCount: 87,
        albumCover: "https://picsum.photos/seed/t001/100",
      },
      {
        trackId: "t002",
        name: "Starboy",
        artist: "The Weeknd",
        playCount: 74,
        albumCover: "https://picsum.photos/seed/t002/100",
      },
      {
        trackId: "t003",
        name: "Save Your Tears",
        artist: "The Weeknd",
        playCount: 61,
        albumCover: "https://picsum.photos/seed/t003/100",
      },
      {
        trackId: "t004",
        name: "Industry Baby",
        artist: "Lil Nas X",
        playCount: 55,
        albumCover: "https://picsum.photos/seed/t004/100",
      },
    ],
    topArtists: [
      {
        artistId: "a001",
        name: "The Weeknd",
        playCount: 312,
        genres: ["pop", "r&b", "synth-pop"],
        avatarUrl: "https://picsum.photos/seed/a001/100",
        popularity: 97,
      },
      {
        artistId: "a002",
        name: "Lil Nas X",
        playCount: 188,
        genres: ["hip-hop", "pop rap"],
        avatarUrl: "https://picsum.photos/seed/a002/100",
        popularity: 89,
      },
      {
        artistId: "a003",
        name: "Doja Cat",
        playCount: 143,
        genres: ["pop", "r&b", "hip-hop"],
        avatarUrl: "https://picsum.photos/seed/a003/100",
        popularity: 91,
      },
    ],
    topGenres: [
      { genre: "pop", playCount: 412 },
      { genre: "r&b", playCount: 298 },
      { genre: "hip-hop", playCount: 201 },
    ],
    aiNarrative:
      "Alex's listening history reads like a neon-lit late-night drive. A heavy rotation of The Weeknd suggests an affinity for moody, cinematic pop — the kind of music that sounds best at 2am with city lights blurring past. The sprinkles of Lil Nas X and Doja Cat add a confident, genre-bending edge. Alex isn't chasing trends; Alex is living inside them.",
    personality: "The Midnight Aesthete",
    shareId: "vbcXrT9pQa",
  },
  {
    spotifyUserId: "spotify_user_002",
    displayName: "Jamie Okonkwo",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    topTracks: [
      {
        trackId: "t011",
        name: "Good Days",
        artist: "SZA",
        playCount: 102,
        albumCover: "https://picsum.photos/seed/t011/100",
      },
      {
        trackId: "t012",
        name: "Kill Bill",
        artist: "SZA",
        playCount: 91,
        albumCover: "https://picsum.photos/seed/t012/100",
      },
      {
        trackId: "t013",
        name: "Water",
        artist: "Tyla",
        playCount: 78,
        albumCover: "https://picsum.photos/seed/t013/100",
      },
      {
        trackId: "t014",
        name: "Essence",
        artist: "Wizkid ft. Tems",
        playCount: 67,
        albumCover: "https://picsum.photos/seed/t014/100",
      },
    ],
    topArtists: [
      {
        artistId: "a011",
        name: "SZA",
        playCount: 389,
        genres: ["r&b", "neo soul", "indie r&b"],
        avatarUrl: "https://picsum.photos/seed/a011/100",
        popularity: 94,
      },
      {
        artistId: "a012",
        name: "Tyla",
        playCount: 201,
        genres: ["afrobeats", "pop", "amapiano"],
        avatarUrl: "https://picsum.photos/seed/a012/100",
        popularity: 86,
      },
      {
        artistId: "a013",
        name: "Burna Boy",
        playCount: 177,
        genres: ["afrobeats", "dancehall", "reggae"],
        avatarUrl: "https://picsum.photos/seed/a013/100",
        popularity: 88,
      },
    ],
    topGenres: [
      { genre: "r&b", playCount: 487 },
      { genre: "afrobeats", playCount: 334 },
      { genre: "neo soul", playCount: 212 },
    ],
    aiNarrative:
      "Jamie's playlist is a warm, golden-hour feeling bottled into audio form. A deep loyalty to SZA anchors the listening identity — introspective, emotionally rich, and lyrically dense. The strong afrobeats thread running through Tyla, Wizkid, and Burna Boy reveals someone who doesn't just listen to music but feels culturally connected to it. This is the soundtrack of someone who moves through the world with quiet intention and serious taste.",
    personality: "The Golden Hour Soul",
    shareId: "kMnPq7wLdR",
  },
  {
    spotifyUserId: "spotify_user_003",
    displayName: "Sam Chen",
    avatarUrl: "https://i.pravatar.cc/150?img=56",
    topTracks: [
      {
        trackId: "t021",
        name: "Shelter",
        artist: "Porter Robinson & Madeon",
        playCount: 95,
        albumCover: "https://picsum.photos/seed/t021/100",
      },
      {
        trackId: "t022",
        name: "Language",
        artist: "Porter Robinson",
        playCount: 83,
        albumCover: "https://picsum.photos/seed/t022/100",
      },
      {
        trackId: "t023",
        name: "Moonchild",
        artist: "Fred again..",
        playCount: 71,
        albumCover: "https://picsum.photos/seed/t023/100",
      },
      {
        trackId: "t024",
        name: "Delicate Weapon",
        artist: "Four Tet",
        playCount: 64,
        albumCover: "https://picsum.photos/seed/t024/100",
      },
    ],
    topArtists: [
      {
        artistId: "a021",
        name: "Porter Robinson",
        playCount: 356,
        genres: ["electro house", "indie electronic", "future bass"],
        avatarUrl: "https://picsum.photos/seed/a021/100",
        popularity: 78,
      },
      {
        artistId: "a022",
        name: "Fred again..",
        playCount: 244,
        genres: ["uk garage", "electronic", "ambient"],
        avatarUrl: "https://picsum.photos/seed/a022/100",
        popularity: 82,
      },
      {
        artistId: "a023",
        name: "Four Tet",
        playCount: 198,
        genres: ["folktronica", "microhouse", "ambient"],
        avatarUrl: "https://picsum.photos/seed/a023/100",
        popularity: 71,
      },
    ],
    topGenres: [
      { genre: "electronic", playCount: 521 },
      { genre: "indie electronic", playCount: 312 },
      { genre: "ambient", playCount: 244 },
    ],
    aiNarrative:
      "Sam's listening profile is a testament to the idea that electronic music can be deeply emotional. The Porter Robinson-heavy rotation signals someone who found their entire sonic identity in a single artist — and built outward from there. Fred again.. and Four Tet fill in the quieter, more textural corners, suggesting Sam listens to music the way other people journal: to process, reflect, and occasionally transcend. Less dancefloor, more 3am in headphones.",
    personality: "The Introspective Architect",
    shareId: "hJzYnC2xWv",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    await Summary.deleteMany({});
    console.log("Cleared existing summaries.");

    await Summary.insertMany(summaries);

    console.log("\nDatabase seeded successfully!");
    console.log("- 3 Summaries created:");
    summaries.forEach((s) => {
      console.log(
        `  · ${s.displayName} (${s.personality}) — shareId: ${s.shareId}`,
      );
      console.log(
        `Link: ${process.env.FRONTEND_URL ?? "http://127.0.0.1:3000"}/share/${s.shareId}`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
