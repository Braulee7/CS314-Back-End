import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import makeMessageRouter from "../routes/message.js";
import makeUserRoute from "../routes/user.js";
import makeAuthRoute from "../routes/auth.js";
import makeRoomRouter from "../routes/room.js";

// export the function to perform a dependency injection
// on the server. We want to take a database as a paramater
// so that the server can be tested with a mock database.
export default function (database) {
  const app = express();
  const userRouter = makeUserRoute(database);
  const messageRouter = makeMessageRouter(database);
  const authRouter = makeAuthRoute(database);
  const roomRouter = makeRoomRouter(database);

  // middleware for all routes
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.use(cookieParser());
  // routes
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  app.use("/auth", authRouter);
  app.use("/room", roomRouter);

  app.get("/", (req, res) => {
    res.send("hello world");
  });

  return app;
}
