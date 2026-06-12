import ProfileMenu from "./ProfileMenu";

export default function Navbar({ isPublic }: { isPublic?: boolean }) {
  return (
    <>
      <nav
        className="absolute top-0 left-0 right-0 z-50 flex items-center
        justify-between px-6 py-5 md:px-10"
      >
        <a
          href="/"
          className="font-display text-white text-base md:text-lg tracking-ultra uppercase select-none"
        >
          Sonic Self
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="/privacy"
            className="font-body text-white/80 hover:text-white text-sm md:text-base tracking-wide transition-colors duration-200"
          >
            Privacy
          </a>

          {!isPublic && <ProfileMenu />}
        </div>
      </nav>
    </>
  );
}
