import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export function CreateToken(username, expiry_date) {
  // code from https://www.geeksforgeeks.org/jwt-authentication-with-refresh-tokens/
  //creating a access token
  const accessToken = jwt.sign(
    {
      username: username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: expiry_date,
    }
  );

  return accessToken;
}

export function VerifyToken(token, isAccess) {
  // Verifying the token
  const decoded = jwt.verify(
    token,
    isAccess
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET
  );
  return decoded;
}
