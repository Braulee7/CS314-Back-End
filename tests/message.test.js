import express from "express";
import makeMessageRouter from "../routes/message.js";
import request from "supertest";
import { jest } from "@jest/globals";
import { Auth } from "../lib/util";

// mock the database
const sendMessage = jest.fn();
const messageRouter = makeMessageRouter({
  sendMessage,
});

const app = express();
app.use(express.json());
app.use("/", messageRouter);

// mock the authentication middleware to allow certain token
jest.spyOn(Auth, "VerifyToken").mockImplementation((token, refresh) => {
  if (token === "valid") {
    return { username: "user" };
  } else {
    throw new Error("Invalid token");
  }
});

describe("Message route", () => {
  describe("Given a put message request", () => {
    it("Should give a 200 response with authenticated user", async () => {
      // ARRANGE
      sendMessage.mockReset();
      sendMessage.mockResolvedValue();
      const params = { message: "hello", room_id: 1 };
      // ACT
      const response = await request(app)
        .post("/")
        .set("Authorization", "Bearer valid")
        .send(params);

      // assert
      expect(response.statusCode).toBe(200);
    });
    it("Should respond with 400 if bad paramaters are given", async () => {
      // ARRANGE
      sendMessage.mockReset();
      sendMessage.mockResolvedValue();
      const params = { message: "hello" };
      // ACT
      const no_room_response = await request(app)
        .post("/")
        .set("Authorization", "Bearer valid")
        .send({ message: "hello" });
      const no_message_response = await request(app)
        .post("/")
        .set("Authorization", "Bearer valid")
        .send({ room_id: 1 });
      const no_param_response = await request(app)
        .post("/")
        .set("Authorization", "Bearer valid")
        .send({});
      const bad_types_response = await request(app)
        .post("/")
        .set("Authorization", "Bearer valid")
        .send({ message: 1, room_id: "1" });
      // ASSERT
      expect(no_room_response.statusCode).toBe(400);
      expect(no_message_response.statusCode).toBe(400);
      expect(no_param_response.statusCode).toBe(400);
      expect(bad_types_response.statusCode).toBe(400);
    });
  });
});
