"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nestjs_pino_1 = require("nestjs-pino");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const realtime_adapter_1 = require("./modules/realtime/realtime.adapter");
const helmet_1 = __importDefault(require("helmet"));
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    // Security headers
    app.use((0, helmet_1.default)());
    // Error Tracking Integration
    Sentry.init({
        dsn: process.env.SENTRY_DSN || '',
        integrations: [
            (0, profiling_node_1.nodeProfilingIntegration)(),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });
    // Parse cookies
    app.use((0, cookie_parser_1.default)());
    // Use Pino Logger
    app.useLogger(app.get(nestjs_pino_1.Logger));
    // Mandated API Versioning prefix from Day 1
    app.setGlobalPrefix('api/v1');
    // CORS
    app.enableCors({
        origin: true,
        credentials: true,
    });
    // Setup Redis Adapter for WebSockets
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisIoAdapter = new realtime_adapter_1.RedisIoAdapter(app, redisUrl);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    const port = process.env.PORT || 4000;
    await app.listen(port);
    app.get(nestjs_pino_1.Logger).log(`🚀 API Server running on http://localhost:${port}/api/v1`);
}
bootstrap();
