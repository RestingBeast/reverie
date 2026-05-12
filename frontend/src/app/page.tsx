"use client";

import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#07071a]">
      <Navbar />
      <Landing />
    </main>
  );
}
