import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectedDb from './config/db.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/MessageRoute.js';

dotenv.config(); // ✅ تحميل متغيرات البيئة من .env

const app = express();
const server = http.createServer(app);

// ✅ إعداد CORS و Body Parser
app.use(cors());
app.use(express.json({ limit: '14mb' }));

// ✅ Map لتتبع المستخدمين المتصلين
export const userSocketMap = {};

// ✅ إنشاء socket.io
export const io = new Server(server, {
  cors: {
    origin: "*", // أو ضع رابط الفرونت فقط لأمان أكثر
  },
});

// ✅ أحداث socket
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("✅ User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ إعداد المسارات
app.use('/api/auth', userRouter);
app.use('/api/message', messageRouter);

app.get('/', (req, res) => {
  res.send("✅ Server and Socket.IO are running.");
});

// ✅ تشغيل السيرفر بعد التأكد من الاتصال بـ MongoDB
const startServer = async () => {
  try {
    await connectedDb(); // ⬅️ الاتصال بقاعدة البيانات

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
