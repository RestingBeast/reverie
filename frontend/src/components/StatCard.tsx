import type { ArtistInfo } from "@/types/artist.types";
import type { TrackInfo } from "@/types/track.types";
import type { GenreCountInfo } from "@/types/genre.types";
import Image from "next/image";

type StatCardVariant = "tracks" | "artists" | "genres";

interface StatCardProps {
  variant: "tracks" | "artists" | "genres";
  tracks?: TrackInfo[];
  artists?: ArtistInfo[];
  genres?: GenreCountInfo[];
}

// Waveform bars — decorative, matches the middle card style
function WaveformDecoration() {
  const heights = [6, 10, 14, 10, 18, 12, 20, 14, 10, 18, 14, 8, 16, 12, 6, 10, 14, 18, 10, 8];
  return (
    <div className="flex items-end gap-[2px] h-6 opacity-70">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-purple-400 to-cyan-300"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

// Avatar placeholder circle
function AvatarPlaceholder() {
  return (
    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

// Small image squares for tracks (left card style: 2×2 grid of rectangles)
function TrackImageGrid({ tracks }: { tracks: TrackInfo[]}) {
  return (
    <div className="grid grid-cols-2 gap-1 shrink-0">
      {tracks.map((t, i) => (
        <div
          key={i}
          className="w-12 h-12 rounded-md bg-white/10 border border-white/10"
        >
          <Image src={t.albumCover} alt={t.name} width={100} height={100} />
        </div>
      ))}
    </div>
  );
}

export default function StatCard({ variant, tracks = [], artists = [], genres = [] }: StatCardProps) {
  let albumCovers: string[];
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-4 flex flex-col gap-3 w-full">

      {/* ── TOP TRACKS ── */}
      {variant === "tracks" && (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-white text-base tracking-widest uppercase mb-2">
                Top Tracks
              </h3>
              <ol className="flex flex-col gap-1">
                {tracks.map((t, i) => (
                  <li key={i} className="font-body text-white/70 text-xs flex gap-2">
                    <span className="text-white/30 w-3 shrink-0">{i + 1}.</span>
                    <span className="truncate">
                      {t.name}
                      {t.artist && (
                        <span className="text-white/40"> — {t.artist}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <TrackImageGrid tracks={tracks} />
          </div>
        </>
      )}

      {/* ── TOP ARTISTS ── */}
      {variant === "artists" && (
        <>
          <h3 className="font-display text-white text-base tracking-widest uppercase">
            Top Artists
          </h3>
          <ol className="flex flex-col gap-2">
            {artists.map((a, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="font-body text-white/30 text-xs w-3 shrink-0">{i + 1}.</span>
                {a.avatarUrl ? (
                  <img src={a.avatarUrl} alt={a.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                ) : (
                  <AvatarPlaceholder />
                )}
                <span className="font-body text-white/70 text-xs truncate">{a.name}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {/* ── TOP GENRES ── */}
      {variant === "genres" && (
        <>
          <h3 className="font-display text-white text-base tracking-widest uppercase">
            Top Genres
          </h3>
          <ol className="flex flex-col gap-1">
            {genres.map((g, i) => (
              <li key={i} className="font-body text-white/70 text-xs flex gap-2">
                <span className="text-white/30 w-3 shrink-0">{i + 1}.</span>
                <span>{g.genre}</span>
              </li>
            ))}
          </ol>
          {/* Waveform accent under genres */}
          <div className="pt-1">
            <WaveformDecoration />
          </div>
        </>
      )}
    </div>
  );
}
