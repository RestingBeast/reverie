"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import GenerateButton from "@/components/GenerateButton";
import { useState } from "react";
import SignOutOverlay from "@/components/animations/SignOutOverlay";

export default function Test() {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const triggerSignOut = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      signOut({ callbackUrl: '/'});
    }, 2500);
  }

  return (
    <div className="text-white">
      <SignOutOverlay isLoggingOut={isLoggingOut} message="Good bye..." />
      LogIn <br />
      <button onClick={triggerSignOut}>Sign Out</button> <br />
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
    </div>
  );
}
