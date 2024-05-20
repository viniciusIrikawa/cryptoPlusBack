import { subscribeToBinanceWebSocket } from './services/websocket';
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });
  
io.on('connection', (socket: any) => {
  console.log('Client connected');
  const unsubscribeFromBinance = subscribeToBinanceWebSocket(io);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    unsubscribeFromBinance();
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
