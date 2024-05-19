"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const pairs_1 = require("./constants/pairs");
const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
// const pairs = ['BTCUSDT', 'ETHUSDT']; // Adicione mais pares, se necessário
const subscribeToBinanceWebSocket = () => {
    const sockets = {};
    pairs_1.pairs.forEach((pair) => {
        const ws = new (require('ws'))(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`);
        ws.on('message', (message) => {
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
io.on('connection', (socket) => {
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
