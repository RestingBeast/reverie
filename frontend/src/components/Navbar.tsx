// components/Navbar.tsx
"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { signOut, useSession } from "next-auth/react";
import SignOutOverlay from "@/components/animations/SignOutOverlay";

function DefaultProfileIcon() {
  return (
    <svg
      className="w-5 h-5 text-white/50"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const triggerSignOut = () => {
    setOpen(false);
    setIsLoggingOut(true);
    setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 3000);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="absolute top-0 left-0 right-0 z-50 flex items-center
        justify-between px-6 py-5 md:px-10"
      >
        <a
          href="/"
          className="font-display text-white text-base md:text-lg font-bold tracking-[0.2em] uppercase select-none"
        >
          Sonic Self
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="#"
            className="font-body text-white/80 hover:text-white text-sm md:text-base tracking-wide transition-colors duration-200"
          >
            Privacy
          </a>

          {status === "authenticated" && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="
              w-9 h-9 md:w-10 md:h-10 rounded-full
              bg-linear-to-br from-purple-500/50 to-cyan-500/30
              border-2 border-white/20 hover:border-white/50
              overflow-hidden
              flex items-center justify-center
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-400/60
              hover:shadow-[0_0_14px_2px_rgba(120,80,255,0.4)]
            "
                aria-label="Profile menu"
                aria-expanded={open}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </button>
              {open && (
                <div
                  className="
                absolute right-0 mt-3
                w-44
                bg-[#0e0c1e]/90 backdrop-blur-xl
                border border-white/10
                rounded-2xl
                shadow-[0_8px_40px_-4px_rgba(80,40,180,0.4)]
                overflow-hidden
              "
                >
                  <button
                    onClick={triggerSignOut}
                    className="
                  w-full px-4 py-3
                  font-body text-white/60 hover:text-white
                  text-sm tracking-wide
                  flex items-center gap-2.5
                  hover:bg-white/5
                  transition-colors duration-150
                "
                  >
                    <SignOutIcon />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <SignOutOverlay
        isLoggingOut={isLoggingOut}
        message="System offline. Wake up..."
      />
    </>
  );
}
