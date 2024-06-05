import { createServer } from "http";
import { Server } from "socket.io";
import { AuthenticateSocket } from "../middleware/index.js";

export default function (express_app) {
  const http_server = createServer(express_app);
  const io = new Server(http_server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use(AuthenticateSocket);

  io.on("connection", (socket) => {
    const room = socket.handshake.query.room_id;
    socket.join(room);

    socket.on("disconnect", () => {
      socket.leave(room);
    });

    socket.on("send message", (message_obj) => {
      io.to(room).emit("receive message", message_obj);
    });
  });

  return http_server;
}
