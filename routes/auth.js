import express from "express";
import bycrypt from "bcrypt";
import { validateUsername } from "../lib/database";

export default function (database) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const { user, passwordFromDB } = await validateUsername(username);
      if (!user) {
        return res.status(404).json({ error: "Username not found" });
      }

      const match = await bycrypt.compare(password, passwordFromDB);

      if (!match) {
        return res.status(401).json({ error: "Invalid password" });
      }

      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
