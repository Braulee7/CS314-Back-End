// @module user routes
// This file will contain all routes pertaining to getting
// and updating user information in the database. The
// routes will be as follows:
// http://localhost:3333/user/<specific>

import express from "express";
import bcrypt from "bcrypt";
// create router
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  // POST localhost:3333/user
  // body: username {string} password {string}
  // response:
  //    on success the route will return the username of the
  //    user creating an account. This will act as the UID.
  //    on failure the route will return a string containing
  //    the PSQL error response. The most common situation will
  //    be for a a non-unique value (i.e. username already taken)
  router.post("/", hash, async (req, res) => {
    const { username, password } = req.body;
    try {
      const userid = await database.createUser(username, password);
      // successful creation
      res.status(201).send({ userId: userid });
    } catch (e) {
      // failure, send information as to why
      res.status(400).send(e.detail);
    }
  });

  // GET localhost:3333/user?username=<username>
  // paramater: the username we wish to search for
  // response:
  //    on success the route will return an array of usernames
  //    that match the search query. If no usernames match the
  //    query the route will return an empty array.
  router.get("/", async (req, res) => {
    const { username } = req.query;
    try {
      const users = await database.searchUser(username);
      res.status(200).send(users);
    } catch (e) {
      res.status(500).send(e.detail);
    }
  });

  return router;
}

// middleware
//    specific to /user routes

async function hash(req, res, next) {
  const { username, password } = req.body;
  // make sure we got valid inputs
  if (
    !username ||
    !password ||
    typeof username != "string" ||
    typeof password != "string"
  )
    res.status(400).send("Need a valid username and password");

  // hash the password
  try {
    const hashed_password = await hashPassword(password);
    req.body.password = hashed_password;
    next();
  } catch (e) {
    res.status(500);
  }
}

// utility function

// hash a given password
// @param password {string}
//    The password we wish to hash
// @param salt_rounds {number}
//    The number of rounds we want to use for bcrypt algo
// @return {string}
//    The hashed password.
// @throw
//    Propogates any error thrown from teh brcrypt.hash function
export async function hashPassword(password, salt_rounds = 10) {
  const hashed_password = await bcrypt.hash(password, salt_rounds);
  return hashed_password;
}
