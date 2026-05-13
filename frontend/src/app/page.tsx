"use client";

import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";
import MainLayout from "@/components/layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Landing />
    </MainLayout>
  );
}
