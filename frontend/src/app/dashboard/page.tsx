"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { GenerateButton } from "@/components/GenerateButton";
import { useState } from "react";

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  return (
    <div>
      LogIn <br />
      <button onClick={() => signOut()}>Sign Out</button> <br />
      {status === "authenticated" ? (
        <div>
          <p>Access Token: {session.access_token}</p>
          <p>Name: {session.user?.name}</p>
          <p>UserId: {session.user?.userId}</p>
          <p>Email: {session.user?.email}</p>
          <Image
            width="100"
            height="100"
            src={session.user?.image!}
            alt="profile-image"
          />
        </div>
      ) : (
        <div>Not Logged In</div>
      )}
      {error === null ? (
        <GenerateButton setError={setError} />
      ) : (
        <p>Something went wrong!</p>
      )}
    </div>
  );
}
