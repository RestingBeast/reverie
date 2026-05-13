export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      {/* Logo */}
      <span className="font-display text-white text-base md:text-lg font-bold tracking-[0.2em] uppercase select-none">
        Sonic Self
      </span>

      {/* Nav Links */}
      <ul className="flex items-center gap-6 md:gap-8">
        <li>
          <a
            href="#"
            className="font-body text-white/80 hover:text-white text-sm md:text-base tracking-wide transition-colors duration-200"
          >
            Privacy
          </a>
        </li>
      </ul>
    </nav>
  );
}
