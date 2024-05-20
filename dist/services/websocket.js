"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToBinanceWebSocket = void 0;
const pairs_1 = require("../constants/pairs");
const ws_1 = __importDefault(require("ws"));
const subscribeToBinanceWebSocket = (io) => {
    const sockets = {};
    pairs_1.pairs.forEach((pair) => {
        const ws = new ws_1.default(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`);
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
exports.subscribeToBinanceWebSocket = subscribeToBinanceWebSocket;
