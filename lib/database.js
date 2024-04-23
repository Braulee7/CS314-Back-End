import { Pool } from "pg";
import { config } from "dotenv";

// get the environment variables
config();

// connect to the database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// API

// add a user

// validate user credentials

// send a message

// retrieve messages

// search for a user

// export the pool
export default pool;
