// @module user routes
// This file will contain all routes pertaining to getting
// and updating user information in the database. The
// routes will be as follows:
// http://localhost:3333/user/<specific>

import express from "express";
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  // POST localhost:3333/user\
  // body: username {string} password {string}
  // response:
  //    on success the route will return the username of the
  //    user creating an account. This will act as the UID.
  //    on failure the route will return a string containing
  //    the PSQL error response. The most common situation will
  //    be for a a non-unique value (i.e. username already taken)
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    // make sure we got valid inputs
    if (
      !username ||
      !password ||
      typeof username != "string" ||
      typeof password != "string"
    )
      res.status(400).send("Need a valid username and password");
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
