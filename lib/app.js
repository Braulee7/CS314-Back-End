import express from "express";
import makeMessageRouter from "../routes/message.js";
import makeUserRoute from "../routes/user.js";

// export the function to perform a dependency injection
// on the server. We want to take a database as a paramater
// so that the server can be tested with a mock database.
export default function (database) {
  const app = express();
  const userRouter = makeUserRoute(database);
  const messageRouter = makeMessageRouter(database);

  // middleware for all routes
  app.use(express.json());
  // routes
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.get("/", (req, res) => {
    res.send("hello world");
  });

  return app;
}
