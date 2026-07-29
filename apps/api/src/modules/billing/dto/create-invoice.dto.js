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
exports.CreateInvoiceDto = exports.CreateInvoiceItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let CreateInvoiceItemDto = (() => {
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    let _referenceType_decorators;
    let _referenceType_initializers = [];
    let _referenceType_extraInitializers = [];
    let _referenceId_decorators;
    let _referenceId_initializers = [];
    let _referenceId_extraInitializers = [];
    return class CreateInvoiceItemDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _unitPrice_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _taxRate_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _referenceType_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _referenceId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
            __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
            __esDecorate(null, null, _referenceType_decorators, { kind: "field", name: "referenceType", static: false, private: false, access: { has: obj => "referenceType" in obj, get: obj => obj.referenceType, set: (obj, value) => { obj.referenceType = value; } }, metadata: _metadata }, _referenceType_initializers, _referenceType_extraInitializers);
            __esDecorate(null, null, _referenceId_decorators, { kind: "field", name: "referenceId", static: false, private: false, access: { has: obj => "referenceId" in obj, get: obj => obj.referenceId, set: (obj, value) => { obj.referenceId = value; } }, metadata: _metadata }, _referenceId_initializers, _referenceId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        description = __runInitializers(this, _description_initializers, void 0);
        quantity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
        unitPrice = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
        taxRate = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
        referenceType = (__runInitializers(this, _taxRate_extraInitializers), __runInitializers(this, _referenceType_initializers, void 0));
        referenceId = (__runInitializers(this, _referenceType_extraInitializers), __runInitializers(this, _referenceId_initializers, void 0));
        constructor() {
            __runInitializers(this, _referenceId_extraInitializers);
        }
    };
})();
exports.CreateInvoiceItemDto = CreateInvoiceItemDto;
let CreateInvoiceDto = (() => {
    let _branchId_decorators;
    let _branchId_initializers = [];
    let _branchId_extraInitializers = [];
    let _patientId_decorators;
    let _patientId_initializers = [];
    let _patientId_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    return class CreateInvoiceDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _branchId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _patientId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _dueDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => CreateInvoiceItemDto)];
            __esDecorate(null, null, _branchId_decorators, { kind: "field", name: "branchId", static: false, private: false, access: { has: obj => "branchId" in obj, get: obj => obj.branchId, set: (obj, value) => { obj.branchId = value; } }, metadata: _metadata }, _branchId_initializers, _branchId_extraInitializers);
            __esDecorate(null, null, _patientId_decorators, { kind: "field", name: "patientId", static: false, private: false, access: { has: obj => "patientId" in obj, get: obj => obj.patientId, set: (obj, value) => { obj.patientId = value; } }, metadata: _metadata }, _patientId_initializers, _patientId_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        branchId = __runInitializers(this, _branchId_initializers, void 0);
        patientId = (__runInitializers(this, _branchId_extraInitializers), __runInitializers(this, _patientId_initializers, void 0));
        dueDate = (__runInitializers(this, _patientId_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
        notes = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        items = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _items_initializers, void 0));
        constructor() {
            __runInitializers(this, _items_extraInitializers);
        }
    };
})();
exports.CreateInvoiceDto = CreateInvoiceDto;
