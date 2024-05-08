import express from "express";
import bycrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

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

      // code from https://www.geeksforgeeks.org/jwt-authentication-with-refresh-tokens/
      //creating a access token
      const accessToken = jwt.sign(
        {
          username: username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      // Creating refresh token not that expiry of refresh
      //token is greater than the access token

      const refreshToken = jwt.sign(
        {
          username: username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

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
      console.log(refreshToken);
      // Verifying refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            // Wrong Refesh Token
            return res.status(406).json({ message: "Unauthorized" });
          } else {
            // Correct token we send a new access token
            const accessToken = jwt.sign(
              {
                username: decoded.username,
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "10m",
              }
            );
            return res.json({ accessToken, username: decoded.username });
          }
        }
      );
    } else {
      return res.status(406).json({ message: "Unauthorized" });
    }
  });

  return router;
}
