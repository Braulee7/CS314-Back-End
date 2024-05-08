import { Auth } from "../lib/util.js";

export function Authenticate(req, res, next) {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = bearer.split(" ")[1];
  try {
    const decoded = Auth.VerifyToken(token, true);
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
