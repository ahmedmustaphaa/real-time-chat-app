import express from 'express';
import cors from  'cors';
import "dotenv/config";
import http from 'http'
import { Server } from 'socket.io';
import connectedDb from './config/db.js';

import userRouter from './routes/userRoute.js';
import messageRouter from './routes/MessageRoute.js';
import { Socket } from 'dgram';
const app = express();
const server = http.createServer(app);

app.use(express.json({limit :"14mb"}))

app.use(cors());
export const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

export const userSocketMap={};

io.on("connection",(socket)=>{

  const userId=socket.handshake.query.userId;

  console.log("user connected " ,userId);

  if(userId) userSocketMap[userId]=socket.id;

  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("user disconnected" ,userId);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })

})


app.get('/', (req, res) => {
  res.send('Socket.IO server is running with import');
});

app.use('/api/auth',userRouter)
app.use('/api/message',messageRouter)

connectedDb()

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default server;