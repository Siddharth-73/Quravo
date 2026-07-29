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
exports.ProvisionTenantDto = void 0;
const class_validator_1 = require("class-validator");
let ProvisionTenantDto = (() => {
    let _clinicName_decorators;
    let _clinicName_initializers = [];
    let _clinicName_extraInitializers = [];
    let _clinicSlug_decorators;
    let _clinicSlug_initializers = [];
    let _clinicSlug_extraInitializers = [];
    let _planTier_decorators;
    let _planTier_initializers = [];
    let _planTier_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    return class ProvisionTenantDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _clinicName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _clinicSlug_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _planTier_decorators = [(0, class_validator_1.IsEnum)(['starter', 'growth', 'erp'])];
            _firstName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _lastName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, class_validator_1.IsEmail)()];
            __esDecorate(null, null, _clinicName_decorators, { kind: "field", name: "clinicName", static: false, private: false, access: { has: obj => "clinicName" in obj, get: obj => obj.clinicName, set: (obj, value) => { obj.clinicName = value; } }, metadata: _metadata }, _clinicName_initializers, _clinicName_extraInitializers);
            __esDecorate(null, null, _clinicSlug_decorators, { kind: "field", name: "clinicSlug", static: false, private: false, access: { has: obj => "clinicSlug" in obj, get: obj => obj.clinicSlug, set: (obj, value) => { obj.clinicSlug = value; } }, metadata: _metadata }, _clinicSlug_initializers, _clinicSlug_extraInitializers);
            __esDecorate(null, null, _planTier_decorators, { kind: "field", name: "planTier", static: false, private: false, access: { has: obj => "planTier" in obj, get: obj => obj.planTier, set: (obj, value) => { obj.planTier = value; } }, metadata: _metadata }, _planTier_initializers, _planTier_extraInitializers);
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        clinicName = __runInitializers(this, _clinicName_initializers, void 0);
        clinicSlug = (__runInitializers(this, _clinicName_extraInitializers), __runInitializers(this, _clinicSlug_initializers, void 0));
        planTier = (__runInitializers(this, _clinicSlug_extraInitializers), __runInitializers(this, _planTier_initializers, void 0));
        firstName = (__runInitializers(this, _planTier_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
        lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
        email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        constructor() {
            __runInitializers(this, _email_extraInitializers);
        }
    };
})();
exports.ProvisionTenantDto = ProvisionTenantDto;
