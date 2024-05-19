const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
import { pairs } from './constants/pairs'

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });
  

const subscribeToBinanceWebSocket = () => {
  const sockets: { [key: string]: WebSocket } = {};

  pairs.forEach((pair) => {
    const ws = new (require('ws'))(
      `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`
    );

    ws.on('message', (message: any) => {
      const data = JSON.parse(message);
      const currentPrice = parseFloat(data.p);
      io.emit('priceUpdate', { pair, price: currentPrice });
    });

    sockets[pair] = ws;
  });

  return () => {
    Object.values(sockets).forEach((ws) => {
      ws.close();
    });
  };
};

io.on('connection', (socket: any) => {
  console.log('Client connected');
  const unsubscribeFromBinance = subscribeToBinanceWebSocket();

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    unsubscribeFromBinance();
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
