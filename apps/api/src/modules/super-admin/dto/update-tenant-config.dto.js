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
exports.UpdateTenantConfigDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateTenantConfigDto = (() => {
    let _planTier_decorators;
    let _planTier_initializers = [];
    let _planTier_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _primaryColor_decorators;
    let _primaryColor_initializers = [];
    let _primaryColor_extraInitializers = [];
    let _accentColor_decorators;
    let _accentColor_initializers = [];
    let _accentColor_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _customDomain_decorators;
    let _customDomain_initializers = [];
    let _customDomain_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    return class UpdateTenantConfigDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _planTier_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['starter', 'growth', 'erp'])];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'suspended'])];
            _primaryColor_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _accentColor_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _timezone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _currency_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customDomain_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _settings_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _planTier_decorators, { kind: "field", name: "planTier", static: false, private: false, access: { has: obj => "planTier" in obj, get: obj => obj.planTier, set: (obj, value) => { obj.planTier = value; } }, metadata: _metadata }, _planTier_initializers, _planTier_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _primaryColor_decorators, { kind: "field", name: "primaryColor", static: false, private: false, access: { has: obj => "primaryColor" in obj, get: obj => obj.primaryColor, set: (obj, value) => { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(null, null, _accentColor_decorators, { kind: "field", name: "accentColor", static: false, private: false, access: { has: obj => "accentColor" in obj, get: obj => obj.accentColor, set: (obj, value) => { obj.accentColor = value; } }, metadata: _metadata }, _accentColor_initializers, _accentColor_extraInitializers);
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _customDomain_decorators, { kind: "field", name: "customDomain", static: false, private: false, access: { has: obj => "customDomain" in obj, get: obj => obj.customDomain, set: (obj, value) => { obj.customDomain = value; } }, metadata: _metadata }, _customDomain_initializers, _customDomain_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        planTier = __runInitializers(this, _planTier_initializers, void 0);
        status = (__runInitializers(this, _planTier_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        primaryColor = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _primaryColor_initializers, void 0));
        accentColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, _accentColor_initializers, void 0));
        timezone = (__runInitializers(this, _accentColor_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
        currency = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        customDomain = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _customDomain_initializers, void 0));
        settings = (__runInitializers(this, _customDomain_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
        constructor() {
            __runInitializers(this, _settings_extraInitializers);
        }
    };
})();
exports.UpdateTenantConfigDto = UpdateTenantConfigDto;
