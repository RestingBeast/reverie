"use client";

import { SonicLoading } from "@/components/animations/SonicLoading";
import MainLayout from "@/components/layouts/MainLayout";

export default function Loading() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center min-h-[60vh]">
        <SonicLoading text="Extracting sonic blueprints..." />
      </div>
    </MainLayout>
  );
}
