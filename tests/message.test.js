import express from "express";
import makeMessageRouter from "../routes/message.js";
import request from "supertest";
import { jest } from "@jest/globals";
import { Auth } from "../lib/util";

// mock the database
const sendMessage = jest.fn();
const getMessages = jest.fn();
const messageRouter = makeMessageRouter({
  sendMessage,
  getMessages,
});

const app = express();
app.use(express.json());
app.use("/message", messageRouter);

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
        .post("/message")
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
        .post("/message")
        .set("Authorization", "Bearer valid")
        .send({ message: "hello" });
      const no_message_response = await request(app)
        .post("/message")
        .set("Authorization", "Bearer valid")
        .send({ room_id: 1 });
      const no_param_response = await request(app)
        .post("/message")
        .set("Authorization", "Bearer valid")
        .send({});
      const bad_types_response = await request(app)
        .post("/message")
        .set("Authorization", "Bearer valid")
        .send({ message: 1, room_id: "1" });
      // ASSERT
      expect(no_room_response.statusCode).toBe(400);
      expect(no_message_response.statusCode).toBe(400);
      expect(no_param_response.statusCode).toBe(400);
      expect(bad_types_response.statusCode).toBe(400);
    });
  });
  describe("Given a get request", () => {
    it("Should respond with a list of messages", async () => {
      // ARRANGE
      const messages = [{ message: "hello", sending_user: "user" }];
      getMessages.mockReset();
      getMessages.mockResolvedValue(messages);

      // ACT
      const response = await request(app)
        .get("/message?room_id=1")
        .set("Authorization", "Bearer valid");

      // ASSERT
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ messages: messages });
    });
    it("Should return a 400 response with bad inputs", async () => {
      // ARRANGE
      getMessages.mockReset();
      getMessages.mockResolvedValue([]);
      // ACT
      const no_room_response = await request(app)
        .get("/message")
        .set("Authorization", "Bearer valid");
      const bad_room_response = await request(app)
        .get("/message?room_id=bad")
        .set("Authorization", "Bearer valid");

      // ASSERT
      expect(no_room_response.statusCode).toBe(400);
      expect(bad_room_response.statusCode).toBe(400);
    });
  });
});
