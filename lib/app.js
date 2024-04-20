import express from "express";

export default function (database) {
  const app = express();

  app.get("/", (req, res) => {
    res.send("hello world");
  });

  return app;
}
