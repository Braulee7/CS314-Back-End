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
      const response = await request(app).post("/user").send(user);

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

  describe("Registering with bad inputs", () => {
    it("Give a 400 response status", async () => {
      // ARRANGE
      createUser.mockReset();
      createUser.mockResolvedValue(-1); // error
      // mock username and password
      const username = "user";
      const password = "password";

      // ACT
      // test three scenarios
      // registering with out a username or password
      const response1 = await request(app).post("/user");
      // registering without a password
      const response2 = await request(app)
        .post("/user")
        .send({ username: username });
      // registering without a username
      const response3 = await request(app)
        .post("/user")
        .send({ password: password });
      // invalid types
      const response4 = await request(app)
        .post("/user")
        .send({ username: 123, password: password });

      // ASSERT
      expect(response1.statusCode).toBe(400);
      expect(response2.statusCode).toBe(400);
      expect(response3.statusCode).toBe(400);
      expect(response4.statusCode).toBe(400);
    });
  });
});
