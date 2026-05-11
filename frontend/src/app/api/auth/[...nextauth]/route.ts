import { NextApiRequest, NextApiResponse } from "next";
import SpotifyProvider from "next-auth/providers/spotify";
import NextAuth, { NextAuthOptions } from "next-auth";

const SPOTIFY_SCOPES = "user-read-recently-played user-read-email";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token!;
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
