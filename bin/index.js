import makeApp from "../lib/app.js";
import Database from "../lib/database.js";
import { config } from "dotenv";

// configure the dotenv module to get all private keys
config();

// create the app with database
const app = makeApp(new Database());

// start the server on the desired port
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
