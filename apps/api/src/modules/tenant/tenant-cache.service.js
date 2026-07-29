"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantCacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("@quravo/db");
let TenantCacheService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TenantCacheService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantCacheService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        dbService;
        logger = new common_1.Logger(TenantCacheService.name);
        redisConnection;
        TTL_SECONDS = 600; // 10 minutes
        constructor(configService, dbService) {
            this.configService = configService;
            this.dbService = dbService;
        }
        onModuleInit() {
            const host = this.configService.get('REDIS_HOST', 'localhost');
            const port = this.configService.get('REDIS_PORT', 6379);
            this.redisConnection = new ioredis_1.default({
                host,
                port,
                maxRetriesPerRequest: null,
            });
        }
        async getEnabledModules(tenantId) {
            const cacheKey = `tenant:modules:${tenantId}`;
            try {
                const cached = await this.redisConnection.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            }
            catch (err) {
                this.logger.warn(`Redis read error: ${err.message}`);
            }
            // Fallback to Database
            const db = this.dbService.db;
            const records = await db.select().from(db_1.tenantModules).where((0, db_1.eq)(db_1.tenantModules.tenantId, tenantId));
            const moduleMap = {};
            for (const record of records) {
                moduleMap[record.moduleKey] = record.enabled;
            }
            try {
                await this.redisConnection.set(cacheKey, JSON.stringify(moduleMap), 'EX', this.TTL_SECONDS);
            }
            catch (err) {
                this.logger.warn(`Redis set error: ${err.message}`);
            }
            return moduleMap;
        }
        async getRolePermissions(tenantId, roleName) {
            const cacheKey = `tenant:permissions:${tenantId}:${roleName}`;
            try {
                const cached = await this.redisConnection.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            }
            catch (err) {
                this.logger.warn(`Redis read error: ${err.message}`);
            }
            // Fallback to Database
            const db = this.dbService.db;
            const [roleRecord] = await db
                .select()
                .from(db_1.roles)
                .where((0, db_1.and)((0, db_1.eq)(db_1.roles.tenantId, tenantId), (0, db_1.eq)(db_1.roles.name, roleName)))
                .limit(1);
            const permissions = roleRecord?.permissions || [];
            try {
                await this.redisConnection.set(cacheKey, JSON.stringify(permissions), 'EX', this.TTL_SECONDS);
            }
            catch (err) {
                this.logger.warn(`Redis set error: ${err.message}`);
            }
            return permissions;
        }
        async invalidateTenantModules(tenantId) {
            const cacheKey = `tenant:modules:${tenantId}`;
            try {
                await this.redisConnection.del(cacheKey);
                this.logger.log(`Cleared Redis cache for ${cacheKey}`);
            }
            catch (err) {
                this.logger.warn(`Redis del error: ${err.message}`);
            }
        }
        async invalidateRolePermissions(tenantId, roleName) {
            const cacheKey = `tenant:permissions:${tenantId}:${roleName}`;
            try {
                await this.redisConnection.del(cacheKey);
                this.logger.log(`Cleared Redis cache for ${cacheKey}`);
            }
            catch (err) {
                this.logger.warn(`Redis del error: ${err.message}`);
            }
        }
        async onModuleDestroy() {
            if (this.redisConnection) {
                await this.redisConnection.quit();
            }
        }
    };
    return TenantCacheService = _classThis;
})();
exports.TenantCacheService = TenantCacheService;
