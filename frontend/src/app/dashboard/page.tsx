"use client";

import { GenerateButton } from "@/components/GenerateButton";
import { useState } from "react";

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      {error === null ? (
        <p>Something went wrong!</p>
      ) : (
        <GenerateButton setError={setError} />
      )}
    </div>
  );
}
