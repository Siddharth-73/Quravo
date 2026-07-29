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
exports.ModuleGuard = void 0;
const common_1 = require("@nestjs/common");
const require_module_decorator_1 = require("../decorators/require-module.decorator");
const db_1 = require("@quravo/db");
let ModuleGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ModuleGuard = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ModuleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        reflector;
        constructor(reflector) {
            this.reflector = reflector;
        }
        async canActivate(context) {
            const requiredModule = this.reflector.getAllAndOverride(require_module_decorator_1.MODULE_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredModule) {
                return true; // No specific module required
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user || !user.tenantId) {
                throw new common_1.ForbiddenException('Tenant information missing from request');
            }
            // In a real production app, you might cache this query using Redis
            // to avoid hitting the DB on every protected route.
            const tenantRecord = await db_1.db.query.tenants.findFirst({
                where: (0, db_1.eq)(db_1.tenants.id, user.tenantId),
            });
            if (!tenantRecord) {
                throw new common_1.ForbiddenException('Tenant not found');
            }
            if (!tenantRecord.enabledModules || !tenantRecord.enabledModules.includes(requiredModule)) {
                throw new common_1.ForbiddenException(`Your plan does not include access to the '${requiredModule}' module. Please upgrade to use this feature.`);
            }
            return true;
        }
    };
    return ModuleGuard = _classThis;
})();
exports.ModuleGuard = ModuleGuard;
