export function requireAuth(req, res, next) {
  const secret = req.headers["x-api-secret"];
  console.log(secret);
  console.log(process.env.INTERNAL_API_SECRET);
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  next();
}
