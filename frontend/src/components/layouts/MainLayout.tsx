"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SignOutOverlay from "@/components/animations/SignOutOverlay";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Navbar />

      {/* Background glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-125 h-125 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-pink-500/10 rounded-full blur-[80px]" />
      </div>

      {children}
    </main>
  );
}
