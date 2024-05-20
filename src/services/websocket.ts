// 1 - Importações necessárias
import { pairs } from '../constants/pairs';
import WebSocket from 'ws';
import { Server } from 'socket.io';

// 2 - Função que estabelece conexão WebSocket.
export const subscribeToBinanceWebSocket = (io: Server) => {
    const sockets: { [key: string]: WebSocket } = {};

    pairs.forEach((pair) => {
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`);

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
