import express from "express";
import makeUserRouter from "../routes/user.js";
import bcrypt from "bcrypt";
import request from "supertest";
import { jest } from "@jest/globals";

const app = express();
// mock the database
const createUser = jest.fn();
const searchUser = jest.fn();

// create route
const userRouter = makeUserRouter({
  createUser,
  searchUser,
});

app.use(express.json());
app.use("/user", userRouter);

// mock the hash implementation from the bcrypt library so
// that it always resolves and doesn't stall or interfere
// with our tests. This method should always pass so this
// implementation is okay
jest.spyOn(bcrypt, "hash").mockImplementation((pass, salt, cb) => {
  return "123abc";
});

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

    it("hashes user password", async () => {
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
      expect(createUser).toBeCalled();
      expect(createUser.mock.calls[0][1]).not.toBe(user.password);
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

    it("Rejects registration with duplicate usernames", async () => {
      // ARRANGE
      createUser.mockReset();
      // mock the implementation of the function to check for
      // uniqueness of the username (the database does this for us)
      createUser.mockImplementation(() => {
        throw new Error("Username with that name already exists");
      });

      const user = { username: "user", password: "password" };

      // ACT
      const response = await request(app).post("/user").send(user);

      // ASSERT
      // tthe status should be 400
      expect(response.statusCode).toBe(400);
    });
  });
});

describe("Get /user", () => {
  describe("Searching for a user", () => {
    it("should give a 200 response status", async () => {
      // ARRANGE
      searchUser.mockReset();
      searchUser.mockResolvedValue(["user1", "user2", "user3"]);

      // ACT
      const response = await request(app).get("/user?username=user");

      // ASSERT
      expect(response.statusCode).toBe(200);
    });
    it("should return a list of users", async () => {
      // ARRANGE
      searchUser.mockReset();
      searchUser.mockResolvedValue(["user1", "user2", "user3"]);

      // ACT
      const response = await request(app).get("/user?username=user");

      // ASSERT
      expect(response.body).toEqual(["user1", "user2", "user3"]);
    });
    it("should return an empty list if no user is found", async () => {
      // ARRANGE
      searchUser.mockReset();
      searchUser.mockResolvedValue([]);

      // ACT
      const response = await request(app).get("/user?username=user");

      // ASSERT
      expect(response.body).toEqual([]);
    });
  });
});
