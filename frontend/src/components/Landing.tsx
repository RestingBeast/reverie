import LogInButton from "./LogInButton";

export default function Landing() {
  return (
    <section className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-neon-waves.jpg')" }}
        aria-hidden="true"
      />

      {/* Warm overlay to help text contrast */}
      <div className="absolute inset-0 bg-[#0f0a1a]/50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
        {/* Left: Text area */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Headline */}
          <div className="space-y-2">
            <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,200,150,0.3)]">
              One Echo <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-coral to-amber">
                Infinite Layers
              </span>
            </h1>
          </div>
          {/* Subheading */}
          <p
            className="
              font-body text-white/75 text-base md:text-xl
              max-w-xs sm:max-w-sm md:max-w-md
              leading-relaxed tracking-wide
              mt-2 md:mt-4 mb-8 md:mb-10
            "
          >
            Your listening history, woven into a portrait only you could
            soundtrack
          </p>

          {/* CTA */}
          <LogInButton />
        </div>

        {/* Right: Chibi Teio dancing */}
        <div className="shrink-0 animate-float">
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-[#140d24]/40 border border-coral/20 shadow-[0_0_40px_-8px_rgba(255,107,138,0.3)] overflow-hidden">
            <img
              src="/everknight-dance.webp"
              alt="Everknight dancing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber/10" />
          </div>
          <div className="absolute -inset-3 rounded-full border border-amber/5 blur-sm -z-10" />
        </div>
      </div>
    </section>
  );
}
