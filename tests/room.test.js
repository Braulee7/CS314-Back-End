import express from "express";
import makeRoomRouter from "../routes/room";
import request from "supertest";
import { jest } from "@jest/globals";

const app = express();
// mock the database
const checkRoomExists = jest.fn();
// create route
const roomRouter = makeRoomRouter({
  checkRoomExists,
});

app.use(express.json());
app.use("/room", roomRouter);

describe("GET /room", () => {
  describe("Good inputs", () => {
    it("should give a 200 response status", async () => {
      // ARRANGE
      checkRoomExists.mockReset();
      checkRoomExists.mockResolvedValue(1);
      // mock user
      const user1 = "user1";
      const user2 = "user2";
      // ACT
      const response = await request(app).get(
        `/room?user1=${user1}&user2=${user2}`
      );
      // ASSERT
      expect(response.statusCode).toBe(200);
    });
    it("should return a room_id", async () => {
      // ARRANGE
      checkRoomExists.mockReset();
      checkRoomExists.mockResolvedValue(1);
      // mock user
      const user1 = "user1";
      const user2 = "user2";
      // ACT
      const response = await request(app).get(
        `/room?user1=${user1}&user2=${user2}`
      );
      // ASSERT
      expect(response.body.room_id).toBe(1);
    });
  });
  describe("Bad inputs", () => {
    it("should give a 400 response status", async () => {
      // ARRANGE
      checkRoomExists.mockReset();
      checkRoomExists.mockResolvedValue(-1);
      // mock user
      const user1 = "user1";
      const user2 = "user2";
      // ACT
      const response = await request(app).get(
        `/room?user1=${user1}&user2=${user2}`
      );
      // ASSERT
      expect(response.statusCode).toBe(400);
    });
    it("Bad paramaters", async () => {
      // ARRANGE
      checkRoomExists.mockReset();
      checkRoomExists.mockResolvedValue(-1);
      // mock user
      const user = "user";
      // ACT
      const no_user_response = await request(app).get(`/room`);
      const one_user_response = await request(app).get(`/room?user=${user}`);
      // ASSERT
      expect(no_user_response.statusCode).toBe(400);
      expect(one_user_response.statusCode).toBe(400);
    });
  });
});
