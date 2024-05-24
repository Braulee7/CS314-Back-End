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
    const user = req.username;
    try {
      const rooms = await database.getAllRooms(user);
      res.status(200).send(rooms);
    } catch (e) {
      res.status(500).send(e.detail);
    }
  });
  // checks if a room exists between two users and returns the room_id
  // of the first room if it does
  router.get("/exists", Authenticate, async (req, res) => {
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

  // get all members of a room
  router.get("/members", Authenticate, async (req, res) => {
    const { room_id } = req.query;
    if (!room_id) res.status(400).send("Need a room_id to search for");
    else if (isNaN(room_id)) res.status(400).send("Room_id must be a number");

    try {
      const members = await database.getRoomMembers(room_id);
      res.status(200).send(members);
    } catch (e) {
      res.status(500).send(e.detail);
    }
  });

  router.post("/", Authenticate, async (req, res) => {
    const user = req.username;
    const { other_user } = req.body;

    if (!other_user) res.status(400).send("Need another user to create a room");

    try {
      const { id, name } = await database.createDirectMessageRoom(
        user,
        other_user
      );
      res.status(200).send({ id, name });
    } catch (e) {
      res.status(500).send(e.detail);
    }
  });

  return router;
}
