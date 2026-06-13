"use server";

import { getServerSession } from "next-auth";
import { SignJWT } from "jose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Summary } from "@/types/summary.types";

export async function fetchUserSummaries(): Promise<Summary[]> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({
    sub: session.user.userId,
    iss: "Reverie Client",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60s")
    .sign(secret);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000"}/api/summaries`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch summaries");
  return res.json();
}
