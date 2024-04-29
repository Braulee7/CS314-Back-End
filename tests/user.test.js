import express from "express";
import makeUserRouter from "../routes/user.js";
import request from "supertest";
import { jest } from "@jest/globals";

const app = express();
// mock the database
const createUser = jest.fn();
// create route
const userRouter = makeUserRouter({
  createUser,
});

app.use(express.json());
app.use("/user", userRouter);

describe("POST /user", () => {
  describe("Registering a user with good inputs", () => {
    it("should give a 201 response status", async () => {
      // ARRANGE
      createUser.mockReset();
      createUser.mockResolvedValue(1);
      // mock user
      const user = {
        username: "username",
        password: "password",
      };
      // ACT
      const response = await request(app).post("/user").send({
        username: "username",
        password: "password",
      });

      // ASSERT
      expect(response.statusCode).toBe(201);
    });

    it("add user to database", async () => {
      // ARRANGE

      const users = ["user1", "user2", "user3"];
      const password = "password";

      // ACT
      users.forEach(async (user, i) => {
        createUser.mockReset();
        createUser.mockResolvedValue(1);

        await request(app)
          .post("/user")
          .send({ username: user, password: password });
        // ASSERT
        expect(createUser.mock.calls[i][0]).toBe(user);
      });
    });
  });
});
