"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LogInButton() {
  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
      className="
        group relative inline-flex items-center gap-3
        bg-[#1DB954] hover:bg-[#1ed760]
        text-white font-display font-bold
        text-sm md:text-base lg:text-lg
        tracking-widest uppercase
        px-8 py-4 md:px-10 md:py-5
        rounded-full
        transition-all duration-300 ease-out
        cursor-pointer
        shadow-[0_0_24px_4px_rgba(29,185,84,0.55),0_0_60px_10px_rgba(29,185,84,0.25)]
        hover:shadow-[0_0_36px_8px_rgba(29,185,84,0.75),0_0_80px_20px_rgba(29,185,84,0.4)]
        hover:scale-105
        active:scale-100
      "
    >
      {/* Spotify icon */}
      <Image
        className="w-6 h-6 md:w-7 md:h-7 shrink-0"
        src="/spotify.svg"
        alt="Spotify logo"
        width={1}
        height={1}
      />

      <span className="leading-none">Log in with Spotify</span>

      {/* Inner glow ring on hover */}
      <span
        className="
          absolute inset-0 rounded-full
          ring-2 ring-white/0 group-hover:ring-white/20
          transition-all duration-300
        "
      />
    </button>
  );
}
