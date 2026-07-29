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
exports.FeatureFlagGuard = void 0;
const common_1 = require("@nestjs/common");
const feature_flag_decorator_1 = require("../decorators/feature-flag.decorator");
const db_1 = require("@quravo/db");
let FeatureFlagGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FeatureFlagGuard = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FeatureFlagGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        reflector;
        dbService;
        constructor(reflector, dbService) {
            this.reflector = reflector;
            this.dbService = dbService;
        }
        async canActivate(context) {
            const requiredFlag = this.reflector.getAllAndOverride(feature_flag_decorator_1.FEATURE_FLAG_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredFlag) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const tenantId = request.tenant?.id || request.user?.tenantId;
            if (!tenantId) {
                throw new common_1.BadRequestException('Cannot verify feature flag: Tenant context missing.');
            }
            const db = this.dbService.db;
            const [flagRecord] = await db
                .select()
                .from(db_1.featureFlags)
                .where((0, db_1.and)((0, db_1.eq)(db_1.featureFlags.tenantId, tenantId), (0, db_1.eq)(db_1.featureFlags.flagKey, requiredFlag)))
                .limit(1);
            if (!flagRecord || !flagRecord.enabled) {
                throw new common_1.ForbiddenException(`Feature flag '${requiredFlag}' is not enabled for your clinic.`);
            }
            return true;
        }
    };
    return FeatureFlagGuard = _classThis;
})();
exports.FeatureFlagGuard = FeatureFlagGuard;
