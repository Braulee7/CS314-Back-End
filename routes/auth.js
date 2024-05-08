import express from "express";
import bycrypt from "bcrypt";
import { CreateToken, VerifyToken } from "../lib/util";

export default function (database) {
  config();
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await database.validateUsername(username);
      if (!user) {
        return res.status(404).json({ error: "Username not found" });
      }

      const match = await bycrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Creating access token
      const accessToken = CreateToken(username, "10m");
      // create refresh token, expires long after access token
      const refreshToken = CreateToken(username, "1d");

      // Assigning refresh token in http-only cookie
      res.cookie("refresh", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ accessToken, username });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/refresh", async (req, res) => {
    if (req.cookies?.refresh) {
      // Destructuring refreshToken from cookie
      const refreshToken = req.cookies.refresh;
      // Verifying refresh token
      try {
        const decoded = VerifyToken(refreshToken, false);
        // Correct token we send a new access token
        const accessToken = CreateToken(decoded.username, "10m");
        return res.json({ accessToken, username: decoded.username });
      } catch (error) {
        return res.status(406).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(406).json({ message: "Unauthorized" });
    }
  });

  return router;
}
