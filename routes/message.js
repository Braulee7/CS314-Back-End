// @module message routes
// This file will contain all routes pertaining to getting
// and updating message information in the database. The
// routes will be as follows:
// http://localhost:3333/message/<specific>

import express from "express";
const router = express.Router();

// dependency injection with the database for testing purposes
export default function (database) {

  router.post('/message', async (req, res) => {
    const { username, room_id, message } = req.body;

    try {
      //Inserting into the database
      const result = await database.query(
        'INSERT INTO messages (username, room_id, message, date_sent) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [username, room_id, message]
      );

      //If inserted, notify.
      res.status(200).json({ success: true, message: 'Message sent.' });
    } catch (err) {
      console.error(err);
      //Else, error.
      res.status(500).json({error: 'Error occured while sending message.'});

    }
  });

  return router;
}