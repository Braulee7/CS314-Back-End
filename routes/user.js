// @module user routes
// This file will contain all routes pertaining to getting
// and updating user information in the database. The
// routes will be as follows:
// http://localhost:3333/user/<specific>

import express from "express";
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  return router;
}
