import express from "express";
import makeRoomRouter from "../routes/room";
import request from "supertest";
import { jest } from "@jest/globals";
import { Auth } from "../lib/util";

const app = express();
// mock the database
const checkRoomExists = jest.fn();
const getAllRooms = jest.fn();
// create route
const roomRouter = makeRoomRouter({
  checkRoomExists,
  getAllRooms,
});

app.use(express.json());
app.use("/room", roomRouter);

// mock the authentication middleware to allow certain token
jest.spyOn(Auth, "VerifyToken").mockImplementation((token, refresh) => {
  if (token === "valid") {
    return { username: "user" };
  } else {
    throw new Error("Invalid token");
  }
});

describe("GET /room", () => {
  describe("/", () => {
    it("Should give a 200 response status", async () => {
      // ARRANGE
      getAllRooms.mockReset();
      getAllRooms.mockResolvedValue([]);
      // ACT
      const response = await request(app)
        .get("/room")
        .set("Authorization", "Bearer valid");
      // ASSERT
      expect(response.statusCode).toBe(200);
    });

    it("Should return an empty array", async () => {
      // ARRANGE
      getAllRooms.mockReset();
      getAllRooms.mockResolvedValue([]);
      // ACT
      const response = await request(app)
        .get("/room")
        .set("Authorization", "Bearer valid");
      // ASSERT
      expect(response.body).toEqual([]);
    });
  });
  describe("/exists", () => {
    describe("Good inputs", () => {
      it("should give a 200 response status", async () => {
        // ARRANGE
        checkRoomExists.mockReset();
        checkRoomExists.mockResolvedValue(1);
        // mock user
        const user1 = "user1";
        const user2 = "user2";
        // ACT
        const response = await request(app)
          .get(`/room/exists?user1=${user1}&user2=${user2}`)
          .set("Authorization", "Bearer valid");
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
        const response = await request(app)
          .get(`/room/exists?user1=${user1}&user2=${user2}`)
          .set("Authorization", "Bearer valid");
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
        const response = await request(app)
          .get(`/room/exists?user1=${user1}&user2=${user2}`)
          .set("Authorization", "Bearer valid");
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
        const no_user_response = await request(app)
          .get(`/room/exists`)
          .set("Authorization", "Bearer valid");
        const one_user_response = await request(app)
          .get(`/room/exists?user=${user}`)
          .set("Authorization", "Bearer valid");
        // ASSERT
        expect(no_user_response.statusCode).toBe(400);
        expect(one_user_response.statusCode).toBe(400);
      });
    });
  });
});
