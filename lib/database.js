import pg from "pg";
import { config } from "dotenv";

// get the environment variables
config();

// get the Pool module from node-postgres
const { Pool } = pg;
class Database {
  constructor() {
    // connect to the database
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  // API

  // add a user
  // @param username {string}
  //    The username of the user we wish to create
  // @param password {string}
  //    The password associated with the user. Should
  //    be hashed for security purposes
  // @return {string}
  //    On success the function will return the username
  //    of the user which will act as the UID since it's
  //    unique. On failure the function will propagate the
  //    database's error
  // @throw
  //    The function propogates the error thrown from the
  //    database
  async createUser(username, password) {
    const response = await this.pool.query(
      "INSERT INTO minstant_messenger.users VALUES ($1::text, $2::text);",
      [username, password]
    );

    return username;
  }
  // validate user credentials

  // send a message

  // retrieve messages

  // search for a user

  // export the pool
}

export default Database;
