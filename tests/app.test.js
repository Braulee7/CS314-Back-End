import makeApp from "../lib/app.js";
import request from "supertest";
import { jest } from "@jest/globals";

const app = makeApp({
  /* mock database */
});

describe("default test", () => {
  describe("given a connection", () => {
    test("should receive hello world", async () => {
      const response = await request(app).get("/");
      expect(response.text).toBe("hello world");
    });
  });
});
