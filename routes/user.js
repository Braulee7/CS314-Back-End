// @module user routes
// This file will contain all routes pertaining to getting
// and updating user information in the database. The
// routes will be as follows:
// http://localhost:3333/user/<specific>

import express from "express";
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    // make a request to the database to create user
    try {
      const userid = await database.createUser(username, password);
      // successful creation
      res.status(201).send({ userId: userid });
    } catch (e) {
      // failure, send information as to why
      res.status(400).send(e.detail);
    }
  });

  return router;
}
