"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let RealtimeGateway = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, websockets_1.WebSocketGateway)({
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                credentials: true,
            },
            namespace: '/realtime',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _server_decorators;
    let _server_initializers = [];
    let _server_extraInitializers = [];
    let _handleAppointmentStatusChange_decorators;
    let _handlePaymentCollected_decorators;
    let _handleNotificationCreated_decorators;
    let _handlePing_decorators;
    var RealtimeGateway = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _server_decorators = [(0, websockets_1.WebSocketServer)()];
            _handleAppointmentStatusChange_decorators = [(0, event_emitter_1.OnEvent)('appointment.status_changed')];
            _handlePaymentCollected_decorators = [(0, event_emitter_1.OnEvent)('payment.collected')];
            _handleNotificationCreated_decorators = [(0, event_emitter_1.OnEvent)('notification.created')];
            _handlePing_decorators = [(0, websockets_1.SubscribeMessage)('ping')];
            __esDecorate(this, null, _handleAppointmentStatusChange_decorators, { kind: "method", name: "handleAppointmentStatusChange", static: false, private: false, access: { has: obj => "handleAppointmentStatusChange" in obj, get: obj => obj.handleAppointmentStatusChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _handlePaymentCollected_decorators, { kind: "method", name: "handlePaymentCollected", static: false, private: false, access: { has: obj => "handlePaymentCollected" in obj, get: obj => obj.handlePaymentCollected }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _handleNotificationCreated_decorators, { kind: "method", name: "handleNotificationCreated", static: false, private: false, access: { has: obj => "handleNotificationCreated" in obj, get: obj => obj.handleNotificationCreated }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _handlePing_decorators, { kind: "method", name: "handlePing", static: false, private: false, access: { has: obj => "handlePing" in obj, get: obj => obj.handlePing }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: obj => "server" in obj, get: obj => obj.server, set: (obj, value) => { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RealtimeGateway = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        jwtService = __runInitializers(this, _instanceExtraInitializers);
        configService;
        logger = new common_1.Logger(RealtimeGateway.name);
        constructor(jwtService, configService) {
            __runInitializers(this, _server_extraInitializers);
            this.jwtService = jwtService;
            this.configService = configService;
        }
        server = __runInitializers(this, _server_initializers, void 0);
        /**
         * Extracts the raw JWT access token from the handshake, checking (in order):
         * 1. `auth.token` sent explicitly by the client during the socket.io handshake
         * 2. The `Authorization: Bearer <token>` header
         * 3. The `quravo_access_token` httpOnly cookie (same cookie used for HTTP auth).
         *    socket.io does not parse cookies automatically, so we parse the raw
         *    `cookie` header manually here.
         */
        extractToken(client) {
            const authToken = client.handshake.auth?.token;
            if (authToken && typeof authToken === 'string') {
                return authToken;
            }
            const authHeader = client.handshake.headers['authorization'];
            if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                return authHeader.slice('Bearer '.length);
            }
            const cookieHeader = client.handshake.headers.cookie;
            if (cookieHeader && typeof cookieHeader === 'string') {
                const match = cookieHeader
                    .split(';')
                    .map((part) => part.trim())
                    .find((part) => part.startsWith('quravo_access_token='));
                if (match) {
                    return decodeURIComponent(match.substring('quravo_access_token='.length));
                }
            }
            return null;
        }
        async handleConnection(client) {
            const token = this.extractToken(client);
            if (!token) {
                this.logger.warn(`Client disconnected due to missing auth token: ${client.id}`);
                client.disconnect();
                return;
            }
            let payload;
            try {
                payload = await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get('JWT_SECRET', 'super_secret_jwt_key_change_in_prod'),
                });
            }
            catch (err) {
                this.logger.warn(`Client disconnected due to invalid/expired auth token: ${client.id} (${err.message})`);
                client.disconnect();
                return;
            }
            if (!payload?.sub || !payload?.tenantId) {
                this.logger.warn(`Client disconnected due to invalid token claims: ${client.id}`);
                client.disconnect();
                return;
            }
            const tenantId = payload.tenantId;
            const userId = payload.sub;
            // branchId is only used to scope which room the client joins - it's not
            // sensitive on its own (tenantId/userId are what gate access), so it's
            // safe to accept it as a client-supplied handshake query param.
            const branchId = client.handshake.query['branchId'];
            client.data.tenantId = tenantId;
            client.data.userId = userId;
            const rooms = [`tenant:${tenantId}`];
            if (branchId)
                rooms.push(`tenant:${tenantId}:branch:${branchId}`);
            if (userId)
                rooms.push(`tenant:${tenantId}:user:${userId}`);
            await client.join(rooms);
            this.logger.log(`Client ${client.id} connected to rooms: ${rooms.join(', ')}`);
        }
        handleDisconnect(client) {
            this.logger.log(`Client disconnected: ${client.id}`);
        }
        handleAppointmentStatusChange(payload) {
            const { tenantId, branchId } = payload;
            if (this.server) {
                this.server.to(`tenant:${tenantId}:branch:${branchId}`).emit('queue.updated', {
                    type: 'appointment.status_changed',
                    payload,
                });
                this.server.to(`tenant:${tenantId}`).emit('dashboard.metrics_updated', {
                    type: 'appointment',
                    payload,
                });
            }
        }
        handlePaymentCollected(payload) {
            const { tenantId } = payload;
            if (this.server) {
                this.server.to(`tenant:${tenantId}`).emit('dashboard.metrics_updated', {
                    type: 'payment',
                    payload,
                });
            }
        }
        handleNotificationCreated(payload) {
            const { tenantId, userId, message } = payload;
            if (this.server) {
                this.server.to(`tenant:${tenantId}:user:${userId}`).emit('notification', {
                    message,
                    timestamp: new Date().toISOString(),
                });
            }
        }
        handlePing(client, data) {
            return { event: 'pong', data: 'hello' };
        }
    };
    return RealtimeGateway = _classThis;
})();
exports.RealtimeGateway = RealtimeGateway;
