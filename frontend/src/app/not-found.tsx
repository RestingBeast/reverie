"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ActionButton from "@/components/ActionButton"; // Adjust path as needed

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#0f0a1a] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-coral/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-75 h-75 bg-amber/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 space-y-8"
      >
        {/* Error Code */}
        <h1 className="font-display text-9xl font-black italic tracking-wide text-white/5 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] select-none">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black italic tracking-wide text-white ">
            Reverie <span className="text-coral">Interrupted.</span>
          </h2>
          <p className="max-w-md mx-auto text-slate-400 font-body tracking-widest text-xs sm:text-sm leading-relaxed uppercase">
            The dream you're looking for has drifted out of reach. This
            reverie does not exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <ActionButton
            buttonText="Return to Reverie"
            onClick={() => router.push("/")}
            className="bg-linear-to-r from-coral to-amber text-white shadow-[0_0_20px_rgba(255,107,138,0.4)] px-12"
          />
        </div>
      </motion.div>

      {/* Decorative Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-20" />
    </div>
  );
}
