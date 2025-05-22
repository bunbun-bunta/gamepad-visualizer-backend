import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// 環境変数読み込み
dotenv.config();

const app = express();
const server = createServer(app);

// CORS設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Socket.io設定
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// 基本ルート
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 Gamepad Visualizer API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket接続処理
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  // コントローラー入力データを受信
  socket.on('gamepad-input', (data) => {
    // 他のクライアントに入力データをブロードキャスト
    socket.broadcast.emit('gamepad-update', {
      ...data,
      socketId: socket.id,
      timestamp: Date.now()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});