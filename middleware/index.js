import { Auth } from "../lib/util.js";

export function AuthenticateRoute(req, res, next) {
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

export function AuthenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Not authorized"));
  }
  try {
    const decoded = Auth.VerifyToken(token, true);
    next();
  } catch (e) {
    next(e);
  }
}
