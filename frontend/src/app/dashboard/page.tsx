"use client";

import { GenerateButton } from "@/components/GenerateButton";
import { useState } from "react";

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      {error === null ? (
        <GenerateButton setError={setError} />
      ) : (
        <p>Something went wrong!</p>
      )}
    </div>
  );
}
