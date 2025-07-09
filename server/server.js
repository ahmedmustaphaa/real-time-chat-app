import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectedDb from './config/db.js'; // تأكد من المسار ده
import userRouter from './routes/userRoute.js'; // تأكد من المسار ده
import messageRouter from './routes/MessageRoute.js'; // تأكد من المسار ده

dotenv.config(); // ✅ تحميل متغيرات البيئة من .env

const app = express();
const server = http.createServer(app); // ✅ إنشاء HTTP server عشان Socket.IO

// ✅ إعداد CORS و Body Parser
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // استخدم متغير بيئة هنا، أو * مؤقتاً
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '14mb' }));

// ✅ Map لتتبع المستخدمين المتصلين
export const userSocketMap = {};

// ✅ إنشاء socket.io
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*", // استخدم نفس متغير البيئة هنا
        methods: ["GET", "POST"],
        credentials: true
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

// ✅ الاتصال بقاعدة البيانات مرة واحدة عند بدء تشغيل التطبيق
// هنا بنستدعيها مباشرة، Vercel هتتأكد إنها بتتصل
connectedDb(); // ⬅️ الاتصال بقاعدة البيانات

// ❌ حذف الجزء ده تماماً
// const startServer = async () => {
//   try {
//     await connectedDb();
//     const PORT = process.env.PORT || 5000;
//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error.message);
//   }
// };
// startServer();

// ✅ Export السيرفر عشان Vercel تقدر تشغله
export default server;