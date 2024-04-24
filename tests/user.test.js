import express from "express";
import makeUserRouter from "../routes/user.js";
import request from "supertest";
import { jest } from "@jest/globals";

const userRouter = makeUserRouter({
  /* mock database */
});

const app = express();
app.use("/", userRouter);

describe("User route", () => {
  describe("Given a user registration request", () => {
    it("should give a 200 response status", async () => {});
    it("register user to the database with good inputs", async () => {});
  });
});
