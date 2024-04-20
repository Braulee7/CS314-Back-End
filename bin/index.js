import { app } from "../app.js";
import { config } from "dotenv";

// configure the dotenv module to get all private keys
config();

// start the server on the desired port
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
