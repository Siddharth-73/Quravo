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
exports.VerifyRazorpayPaymentDto = exports.CreateRazorpayOrderDto = void 0;
const class_validator_1 = require("class-validator");
let CreateRazorpayOrderDto = (() => {
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    return class CreateRazorpayOrderDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
        constructor() {
            __runInitializers(this, _invoiceId_extraInitializers);
        }
    };
})();
exports.CreateRazorpayOrderDto = CreateRazorpayOrderDto;
let VerifyRazorpayPaymentDto = (() => {
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _razorpayOrderId_decorators;
    let _razorpayOrderId_initializers = [];
    let _razorpayOrderId_extraInitializers = [];
    let _razorpayPaymentId_decorators;
    let _razorpayPaymentId_initializers = [];
    let _razorpayPaymentId_extraInitializers = [];
    let _razorpaySignature_decorators;
    let _razorpaySignature_initializers = [];
    let _razorpaySignature_extraInitializers = [];
    return class VerifyRazorpayPaymentDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _razorpayOrderId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _razorpayPaymentId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _razorpaySignature_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _razorpayOrderId_decorators, { kind: "field", name: "razorpayOrderId", static: false, private: false, access: { has: obj => "razorpayOrderId" in obj, get: obj => obj.razorpayOrderId, set: (obj, value) => { obj.razorpayOrderId = value; } }, metadata: _metadata }, _razorpayOrderId_initializers, _razorpayOrderId_extraInitializers);
            __esDecorate(null, null, _razorpayPaymentId_decorators, { kind: "field", name: "razorpayPaymentId", static: false, private: false, access: { has: obj => "razorpayPaymentId" in obj, get: obj => obj.razorpayPaymentId, set: (obj, value) => { obj.razorpayPaymentId = value; } }, metadata: _metadata }, _razorpayPaymentId_initializers, _razorpayPaymentId_extraInitializers);
            __esDecorate(null, null, _razorpaySignature_decorators, { kind: "field", name: "razorpaySignature", static: false, private: false, access: { has: obj => "razorpaySignature" in obj, get: obj => obj.razorpaySignature, set: (obj, value) => { obj.razorpaySignature = value; } }, metadata: _metadata }, _razorpaySignature_initializers, _razorpaySignature_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
        razorpayOrderId = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _razorpayOrderId_initializers, void 0));
        razorpayPaymentId = (__runInitializers(this, _razorpayOrderId_extraInitializers), __runInitializers(this, _razorpayPaymentId_initializers, void 0));
        razorpaySignature = (__runInitializers(this, _razorpayPaymentId_extraInitializers), __runInitializers(this, _razorpaySignature_initializers, void 0));
        constructor() {
            __runInitializers(this, _razorpaySignature_extraInitializers);
        }
    };
})();
exports.VerifyRazorpayPaymentDto = VerifyRazorpayPaymentDto;
