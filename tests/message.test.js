import express from "express";
import makeMessageRouter from "../routes/message.js";
import request from "supertest";
import { jest } from "@jest/globals";

const messageRouter = makeMessageRouter({
  /* mock database */
});

const app = express();
app.use("/", messageRouter);

describe("Message route", () => {
  describe("Given a put message request", () => {
    it("Should give a 200 response with authenticated user", async () => {});
  });
});
