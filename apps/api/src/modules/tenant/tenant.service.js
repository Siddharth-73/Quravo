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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const common_2 = require("@quravo/common");
let TenantService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TenantService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        eventEmitter;
        constructor(dbService, eventEmitter) {
            this.dbService = dbService;
            this.eventEmitter = eventEmitter;
        }
        async getTenantBySlug(slug) {
            const db = this.dbService.db;
            const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.slug, slug.toLowerCase())).limit(1);
            if (!tenant) {
                throw new common_1.NotFoundException(`Clinic with subdomain '${slug}' not found.`);
            }
            if (tenant.status === 'suspended') {
                throw new common_1.ForbiddenException('Clinic account is suspended.');
            }
            return tenant;
        }
        async getTenantById(id) {
            const db = this.dbService.db;
            const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.id, id)).limit(1);
            if (!tenant) {
                throw new common_1.NotFoundException('Clinic not found.');
            }
            return tenant;
        }
        async emitTenantCreatedEvent(data) {
            const event = new common_2.TenantCreatedEvent(data);
            this.eventEmitter.emit('tenant.created', event);
            return event;
        }
    };
    return TenantService = _classThis;
})();
exports.TenantService = TenantService;
