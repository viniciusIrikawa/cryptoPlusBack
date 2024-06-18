"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importações
const websocket_1 = require("./services/websocket");
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('Client connected');
    const unsubscribeFromBinance = (0, websocket_1.subscribeToBinanceWebSocket)(io);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        unsubscribeFromBinance();
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
