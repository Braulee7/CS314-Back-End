// @module message routes
// This file will contain all routes pertaining to getting
// and updating message information in the database. The
// routes will be as follows:
// http://localhost:3333/message/<specific>

import express from "express";
import { AuthenticateRoute } from "../middleware/index.js";

const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {
  router.post("/", AuthenticateRoute, async (req, res) => {
    const { room_id, message } = req.body;
    const username = req.username;

    // verify room_id and message params
    if (!room_id || !message) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }
    const room_id_int = parseInt(room_id);
    if (isNaN(room_id_int) || typeof message !== "string") {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    try {
      const message_obj = await database.sendMessage(
        username,
        room_id_int,
        message
      );
      //If inserted, notify.
      res.status(200).json(message_obj);
    } catch (err) {
      console.error(err);
      //Else, error.
      res.status(500).json({ error: "Error occured while sending message." });
    }
  });

  router.get("/", AuthenticateRoute, async (req, res) => {
    const { room_id } = req.query;
    if (!room_id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    let room_id_int = parseInt(room_id);
    if (isNaN(room_id_int)) {
      return res.status(400).json({ error: "Invalid room_id" });
    }

    try {
      const messages = await database.getMessages(room_id);
      res.status(200).json({ messages });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error occured while getting messages." });
    }
  });

  return router;
}
