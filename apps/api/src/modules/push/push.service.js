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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const webpush = __importStar(require("web-push"));
let PushService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PushService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PushService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        dbService;
        logger = new common_1.Logger(PushService.name);
        constructor(configService, dbService) {
            this.configService = configService;
            this.dbService = dbService;
            const vapidSubject = this.configService.get('VAPID_SUBJECT', 'mailto:admin@quravo.test');
            // Using dummy VAPID keys for the MVP if not provided in env
            const vapidPublicKey = this.configService.get('VAPID_PUBLIC_KEY', 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U');
            const vapidPrivateKey = this.configService.get('VAPID_PRIVATE_KEY', '8d-m-YnN4T9K2Q9vHjD1JqLhU-5M6KxZ4nL3X9-1-P0');
            webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
        }
        async saveSubscription(tenantId, userId, subscription) {
            const { endpoint, keys } = subscription;
            const db = this.dbService.db;
            this.logger.log(`Saving push subscription for user ${userId} in tenant ${tenantId}`);
            await db.insert(db_1.pushSubscriptions).values({
                tenantId,
                userId,
                endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
            })
                .onConflictDoUpdate({
                target: [db_1.pushSubscriptions.userId, db_1.pushSubscriptions.endpoint],
                set: {
                    p256dh: keys.p256dh,
                    auth: keys.auth,
                    updatedAt: new Date(),
                }
            });
            return { success: true };
        }
        async sendNotificationToUser(tenantId, userId, payload) {
            const db = this.dbService.db;
            const subscriptions = await db.select().from(db_1.pushSubscriptions)
                .where((0, db_1.and)((0, db_1.eq)(db_1.pushSubscriptions.tenantId, tenantId), (0, db_1.eq)(db_1.pushSubscriptions.userId, userId)));
            if (!subscriptions.length)
                return;
            this.logger.log(`Sending push notification to user ${userId} (Endpoints: ${subscriptions.length})`);
            const notifications = subscriptions.map(sub => {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    }
                };
                return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
                    .catch(err => {
                    if (err.statusCode === 410) {
                        // Subscription has expired or is no longer valid, delete it
                        return db.delete(db_1.pushSubscriptions)
                            .where((0, db_1.eq)(db_1.pushSubscriptions.id, sub.id));
                    }
                    this.logger.error('Failed to send push notification', err);
                });
            });
            await Promise.all(notifications);
        }
    };
    return PushService = _classThis;
})();
exports.PushService = PushService;
