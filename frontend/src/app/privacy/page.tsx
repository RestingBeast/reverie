import MainLayout from "@/components/layouts/MainLayout";

const SECTIONS = [
  {
    title: "What We Collect",
    body: "When you log in with Spotify, we receive your display name, profile image, and your 50 most recently played tracks. We do not store your Spotify credentials or access token — these stay inside your session and expire after 1 hour.",
  },
  {
    title: "How We Use It",
    body: "Your listening data is used solely to generate your personalised sonic narrative. We store the generated summary — including your name, profile image URL, UserID, top tracks, artists, and genres — so it can be shared via a unique link. Nothing is sold or shared with third parties.",
  },
  {
    title: "Data Retention",
    body: "Generated summaries are stored in our database tied to a unique share ID. We do not currently offer self-serve deletion, but you can contact us and we will remove your data promptly.",
  },
  {
    title: "Third-Party Services",
    body: "We use the Spotify Web API to fetch your listening history. Your use of Sonic Self is also subject to Spotify's own Privacy Policy. We use Groq to generate narrative text — your name and listening data (track names, artists, genres) is sent to the model.",
  },
  {
    title: "Cookies & Sessions",
    body: "We use a single session cookie to keep you logged in. No advertising or tracking cookies are used.",
  },
  {
    title: "Contact",
    body: "Questions? Reach us at privacy@sonicself.ai and we'll get back to you as soon as possible.",
  },
];

export default function PrivacyPage() {
  return (
    <MainLayout isPublic>
      <div className="relative z-10 flex-1 flex justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-2xl flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-widest uppercase">
              Privacy{" "}
              <span
                className="bg-linear-to-r from-coral via-amber to-lavender
                bg-clip-text text-transparent"
              >
                Policy
              </span>
            </h1>
            <p className="font-body text-white/40 text-xs sm:text-sm tracking-wide">
              Last updated: May 2026
            </p>
            <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed mt-2">
              Sonic Self is built to understand your music taste — not to
              harvest your data. Here is exactly what we collect and why.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-linear-to-r from-coral/30 via-amber/20 to-transparent" />

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {SECTIONS.map((section, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {/* Rank-style index */}
                  <span
                    className="font-display text-xs tracking-widest text-coral
                    drop-shadow-[0_0_6px_rgba(255,107,138,0.8)]"
                  >
                    0{i + 1}
                  </span>
                  <h2 className="font-display text-white text-lg sm:text-xl tracking-widest uppercase">
                    {section.title}
                  </h2>
                </div>
                <p className="font-body text-white/55 text-sm sm:text-base leading-relaxed pl-7">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="h-px w-full bg-linear-to-r from-coral/30 via-amber/20 to-transparent" />
          <p className="font-body text-white/25 text-xs tracking-wide text-center">
            Sonic Self · 2026
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
