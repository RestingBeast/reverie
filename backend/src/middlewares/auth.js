import { jwtVerify } from "jose";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      issuer: "Reverie Client",
    });
    req.spotifyUserId = payload.sub;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized." });
  }
}
