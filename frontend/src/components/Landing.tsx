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
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            One Echo. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
              Infinite Layers.
            </span>
          </h1>
        </div>
        {/* Subheading */}
        <p
          className="
            text-white/75 text-base md:text-xl
            max-w-xs sm:max-w-sm md:max-w-md
            leading-relaxed tracking-wide
            mt-2 md:mt-4 mb-8 md:mb-10
          "
        >
          Sync your frequencies to construct a narrative blueprint from your
          recent sonic history.
        </p>

        {/* CTA */}
        <LogInButton />
      </div>
    </section>
  );
}
