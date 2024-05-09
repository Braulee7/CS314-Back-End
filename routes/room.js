// @module room route
// this file contain all the routes pertaining to
// chat rooms in the database. The routes will be as follows
// http://localhost:3333/room/<specific>

import express from "express";
import { Authenticate } from "../middleware/index.js";

// create router
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  router.get("/", Authenticate, async (req, res) => {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) res.status(400).send("Need two users to search for");

    try {
      const room_id = await database.checkRoomExists(user1, user2);
      if (room_id === -1) res.status(400).send("Room does not exist");
      else res.status(200).send({ room_id });
    } catch (e) {
      res.status(500).send(e.detail);
    }
  });
  return router;
}
