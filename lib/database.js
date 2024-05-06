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
  async validateUsername(username) {
    try {
      const userValidate = await this.pool.query(
        "SELECT username, password from minstant_messenger.users WHERE username = $1::text;",
        [username]
      );
      return userValidate.rows[0];
    } catch (error) {
      console.error("Error in fetching user:", error);
      throw error;
    }
  }

  // send a message

  // retrieve messages

  // search for a user
  // @param username {string}
  //  the beginning of the username to search the db for
  // @return {usernames[]}
  //  an array of objects containing the usernames that all
  //  begin the passed in username
  async searchUser(username_prefix) {
    try {
      // concatenate a percent for the LIKE statment in the query
      // returns all users that begin with that username
      const concat_username = username_prefix + "%";
      const query =
        "SELECT username FROM minstant_messenger.users WHERE username LIKE $1::text;";
      const params = [concat_username];
      const response = await this.pool.query(query, params);

      return response.rows;
    } catch (error) {
      console.error("Error in searching for user:", error);

      throw error;
    }
  }
}

export default Database;
