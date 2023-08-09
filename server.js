import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import {Server} from "socket.io";
import http from "http";
import router from './routes/index.js';
import realtimeupdate from "./helpers/realtimeupdate.js";
import listeners from "./helpers/listeners.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: true,
  },
});
app.get('/', (req, res) => {
  res.send('Hello world! Welcome to the backend server');
});
realtimeupdate(io)
listeners(io)
router(app);

