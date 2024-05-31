"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importações
const websocket_1 = require("./services/websocket");
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
// Configuração do server WebSocket
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    const unsubscribeFromBinance = (0, websocket_1.subscribeToBinanceWebSocket)(io);
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        unsubscribeFromBinance();
    });
});
// Configuração da porta do servidor
server.listen(3000, () => {
    console.log('Server rodando na porta 3000');
});
