import express from "express";
import makeUserRoute from "../routes/message.js";
import makeMessageRouter from "../routes/user.js";

// export the function to perform a dependency injection
// on the server. We want to take a database as a paramater
// so that the server can be tested with a mock database.
export default function (database) {
  const app = express();
  const userRouter = makeUserRoute(database);
  const messageRouter = makeMessageRouter(database);

  app.use("/", userRouter);
  app.use("/", messageRouter);

  app.get("/", (req, res) => {
    res.send("hello world");
  });

  return app;
}
