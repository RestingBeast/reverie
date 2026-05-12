import LogInButton from "./LogInButton";

export default function Landing() {
  return (
    <section className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background image — swap src for your own asset */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-neon-waves.jpg')" }}
        aria-hidden="true"
      />

      {/* Dark overlay to help text contrast */}
      <div className="absolute inset-0 bg-[#0a0a1a]/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 lg:px-20 max-w-3xl mx-auto">
        {/* Headline */}
        <h1
          className="
            font-display font-black text-white leading-[1.05] tracking-tight
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl
            drop-shadow-[0_2px_32px_rgba(120,80,255,0.4)]
            mb-4 md:mb-6
          "
        >
          Your Music.
          <br />
          Your Story.
        </h1>

        {/* Subheading */}
        <p
          className="
            font-body text-white/75 text-sm sm:text-base md:text-lg
            max-w-xs sm:max-w-sm md:max-w-md
            leading-relaxed tracking-wide
            mb-8 md:mb-10
          "
        >
          Connect to generate your unique sonic narrative from your last 50 tracks.
        </p>

        {/* CTA */}
        <LogInButton />
      </div>
    </section>
  );
}
