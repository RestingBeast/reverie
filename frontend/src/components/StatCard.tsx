import type { ArtistInfo } from "@/types/artist.types";
import type { TrackInfo } from "@/types/track.types";
import type { GenreCountInfo } from "@/types/genre.types";
import Image from "next/image";
import ResonanceBar from "@/components/ResonanceBar";
import WaveformDecoration from "@/components/animations/WaveformAnimation";

interface StatCardProps {
  variant: "tracks" | "artists" | "genres";
  tracks?: TrackInfo[];
  artists?: ArtistInfo[];
  genres?: GenreCountInfo[];
}

type TrackImageGridItem = {
  name: string;
  src: string;
};

interface TrackImageGridProps {
  items: TrackImageGridItem[];
  gridClassName?: string;
  itemClassName?: string;
  imageClassName?: string;
}

const COLORS = [
  "text-coral",
  "text-amber",
  "text-lavender",
  "text-warm-gold",
  "text-coral",
];

const GLOWS = [
  "drop-shadow-[0_0_6px_rgba(255,107,138,0.8)]", // coral
  "drop-shadow-[0_0_6px_rgba(251,191,94,0.8)]", // amber
  "drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]", // lavender
  "drop-shadow-[0_0_6px_rgba(252,211,77,0.8)]", // warm-gold
  "drop-shadow-[0_0_6px_rgba(255,107,138,0.8)]", // coral
];

function AvatarPlaceholder() {
  return (
    <div className="w-full h-full rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-white/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

function RankBadge({
  rank,
  size = "text-xs",
}: {
  rank: number;
  size?: string;
}) {
  const color = COLORS[(rank - 1) % COLORS.length];
  const glow = GLOWS[(rank - 1) % GLOWS.length];

  return (
    <span
      className={`
        font-display ${size} tracking-widest w-5 shrink-0 text-center leading-none
        ${color} ${glow}
      `}
    >
      {rank}
    </span>
  );
}

const StatCardHeader = ({ children }: { children: React.ReactNode }) => (
  <h3
    className="font-display text-white text-base 
    tracking-widest uppercase mb-2 md:text-lg lg:text-xl 
    drop-shadow-[0_0_6px_rgba(255,200,150,0.3)]"
  >
    {children}
  </h3>
);

function TrackImageGrid({
  items,
  gridClassName,
  itemClassName,
  imageClassName,
}: TrackImageGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-1 shrink-0 items-center ${gridClassName}`}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={
            items.length % 2 === 1 && i === items.length - 1
              ? `col-span-2 justify-self-center ${itemClassName}`
              : `${itemClassName}`
          }
        >
          {item.src && (
            <Image
              className={`w-full h-full object-cover ${imageClassName}`}
              src={item.src}
              alt={item.name}
              width={240}
              height={240}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TrackRow({ track, rank }: { track: TrackInfo; rank: number }) {
  return (
    <li className="flex items-center gap-3">
      <RankBadge rank={rank} size="text-xl sm:text-3xl" />

      {/* Title + artist stacked */}
      <div className="flex flex-col min-w-0 flex-1">
        <span
          title={track.name}
          className="font-body text-white/80 text-xs sm:text-sm md:text-base font-medium leading-snug truncate
          group-hover:text-white transition-colors"
        >
          <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">
            {track.name}
          </a>
        </span>
        {track.artist && (
          <span
            title={track.artist}
            className="font-body text-white/35 text-xs sm:text-sm leading-snug truncate"
          >
            {track.artist}
          </span>
        )}
      </div>
    </li>
  );
}

function ArtistRow({ artist, rank }: { artist: ArtistInfo; rank: number }) {
  return (
    <li className="flex items-center gap-3 group">
      <RankBadge rank={rank} size="text-xl sm:text-3xl" />

      {/* Avatar */}
      <div
        className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-linear-to-br
        from-coral/30 to-amber/20 border border-white/10 flex 
        items-center justify-center"
      >
        {artist.avatarUrl ? (
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <AvatarPlaceholder />
        )}
      </div>

      {/* Name */}
      <span
        className="font-body text-white/80 text-xs sm:text-sm md:text-base font-medium flex-1 truncate
        group-hover:text-white transition-colors"
        title={artist.name}
      >
        <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
          {artist.name}
        </a>
      </span>

      {/* The Neon Bar */}
      <ResonanceBar score={artist.popularity ?? 0} />
    </li>
  );
}

function GenreRow({ genre, rank }: { genre: string; rank: number }) {
  const color = COLORS[(rank - 1) % COLORS.length];
  return (
    <li className="flex items-center gap-3 group">
      <RankBadge rank={rank} size="text-xl sm:text-3xl" />

      {/* Pill tag */}
      <span
        className={`
          font-body text-xs sm:text-sm font-medium 
          px-2.5 py-1 rounded-full tracking-wide
          bg-white/5 border border-white/10
          group-hover:border-white/20 ${color}
        `}
      >
        {genre}
      </span>

      {/* Filler dashes to fill space */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="h-px flex-1 bg-white/6 rounded-full"
            style={{ opacity: 1 - i * 0.06 }}
          />
        ))}
      </div>
    </li>
  );
}

export default function StatCard({
  variant,
  tracks = [],
  artists = [],
  genres = [],
}: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-4 flex flex-col gap-3 w-full">
      {/* ── TOP TRACKS ── */}
      {variant === "tracks" && (
        <>
          <div className="flex items-stretch justify-between gap-2">
            <div className="flex-1 min-w-0">
              <StatCardHeader>Top Tracks</StatCardHeader>
              <ol className="flex flex-col gap-1">
                {tracks.map((t, i) => (
                  <TrackRow track={t} rank={i + 1} key={i} />
                ))}
              </ol>
            </div>
            <div className="w-28 sm:w-42 flex flex-col justify-center">
              <TrackImageGrid
                gridClassName="h-28 sm:h-full mt-4 sm:mt-0"
                itemClassName="aspect-square w-full min-h-0 w-auto rounded-md bg-white/10 border border-white/10"
                imageClassName="rounded-md"
                items={tracks.map((t, _) => ({
                  name: t.name,
                  src: t.albumCover,
                }))}
              />
            </div>
          </div>
        </>
      )}

      {/* ── TOP ARTISTS ── */}
      {variant === "artists" && (
        <>
          <StatCardHeader>Top Artists</StatCardHeader>
          <ol className="flex flex-col gap-2.5">
            {artists.map((a, i) => (
              <ArtistRow key={i} artist={a} rank={i + 1} />
            ))}
          </ol>
        </>
      )}

      {/* ── TOP GENRES ── */}
      {variant === "genres" && (
        <>
          <StatCardHeader>Top Genres</StatCardHeader>
          <ol className="flex flex-col gap-2.5">
            {genres.map((g, i) => (
              <GenreRow key={i} genre={g.genre} rank={i + 1} />
            ))}
          </ol>
          {/* Waveform accent under genres */}
          <div className="flex flex-col items-center pt-1">
            <WaveformDecoration />
          </div>
        </>
      )}
    </div>
  );
}
