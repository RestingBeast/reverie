"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Login() {
  const { data: session, status } = useSession()
  return (
    <div>
      LogIn <br />
      <button onClick={() => signIn("spotify")}>Sign In</button> <br />
      <button onClick={() => signOut()}>Sign Out</button> <br />
      {status === "authenticated" ? (
        <div>
          <p>Access Token: {session.access_token}</p>
          <p>Name: {session.user?.name}</p>
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
  )
}
