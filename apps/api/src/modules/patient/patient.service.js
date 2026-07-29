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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let PatientService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatientService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PatientService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        storageProvider;
        constructor(dbService, storageProvider) {
            this.dbService = dbService;
            this.storageProvider = storageProvider;
        }
        async generatePatientNumber(tenantId) {
            const db = this.dbService.db;
            const year = new Date().getFullYear();
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.patients)
                .where((0, db_1.eq)(db_1.patients.tenantId, tenantId));
            const sequence = (count + 1).toString().padStart(4, '0');
            return `PAT-${year}-${sequence}`;
        }
        async createPatient(tenantId, createdById, dto) {
            const db = this.dbService.db;
            const patientNumber = await this.generatePatientNumber(tenantId);
            const [patient] = await db
                .insert(db_1.patients)
                .values({
                tenantId,
                patientNumber,
                ...dto,
            })
                .returning();
            // Create Initial Care Timeline Entry
            await db.insert(db_1.patientTimeline).values({
                tenantId,
                patientId: patient.id,
                eventType: 'registered',
                title: 'Patient Account Registered',
                description: `Patient ${patient.firstName} ${patient.lastName} registered with number ${patient.patientNumber}.`,
                createdById,
            });
            return patient;
        }
        async searchPatients(tenantId, dto) {
            const db = this.dbService.db;
            const page = dto.page || 1;
            const limit = dto.limit || 20;
            const offset = (page - 1) * limit;
            let whereClause = (0, db_1.eq)(db_1.patients.tenantId, tenantId);
            if (dto.query && dto.query.trim() !== '') {
                const q = `%${dto.query.trim()}%`;
                const searchMatch = (0, db_1.or)((0, db_1.sql) `${db_1.patients.firstName} ILIKE ${q}`, (0, db_1.sql) `${db_1.patients.lastName} ILIKE ${q}`, (0, db_1.sql) `${db_1.patients.patientNumber} ILIKE ${q}`, (0, db_1.sql) `${db_1.patients.phone} ILIKE ${q}`, (0, db_1.sql) `${db_1.patients.email} ILIKE ${q}`);
                whereClause = (0, db_1.and)(whereClause, searchMatch);
            }
            const items = await db.select().from(db_1.patients).where(whereClause).limit(limit).offset(offset);
            const [{ total }] = await db
                .select({ total: (0, db_1.sql) `count(*)::int` })
                .from(db_1.patients)
                .where(whereClause);
            return {
                items,
                meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
        }
        async getPatientById(tenantId, patientId) {
            const db = this.dbService.db;
            const [patient] = await db
                .select()
                .from(db_1.patients)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.eq)(db_1.patients.id, patientId)))
                .limit(1);
            if (!patient) {
                throw new common_1.NotFoundException('Patient record not found.');
            }
            return patient;
        }
        async updatePatient(tenantId, patientId, dto) {
            const db = this.dbService.db;
            await this.getPatientById(tenantId, patientId);
            const [updated] = await db
                .update(db_1.patients)
                .set({ ...dto, updatedAt: new Date() })
                .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.eq)(db_1.patients.id, patientId)))
                .returning();
            return updated;
        }
        async getPatientTimeline(tenantId, patientId) {
            const db = this.dbService.db;
            await this.getPatientById(tenantId, patientId);
            return db
                .select()
                .from(db_1.patientTimeline)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patientTimeline.tenantId, tenantId), (0, db_1.eq)(db_1.patientTimeline.patientId, patientId)))
                .orderBy((0, db_1.sql) `${db_1.patientTimeline.createdAt} DESC`);
        }
        async uploadAttachment(tenantId, patientId, uploadedById, file, category = 'general') {
            const db = this.dbService.db;
            const patient = await this.getPatientById(tenantId, patientId);
            const uploadResult = await this.storageProvider.uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
                mimeType: file.mimetype,
                folder: `patients/${patientId}`,
            });
            const [attachment] = await db
                .insert(db_1.patientAttachments)
                .values({
                tenantId,
                patientId,
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                storageKey: uploadResult.storageKey,
                storageUrl: uploadResult.storageUrl,
                category,
                uploadedById,
            })
                .returning();
            // Append to Patient Timeline
            await db.insert(db_1.patientTimeline).values({
                tenantId,
                patientId,
                eventType: 'attachment_added',
                title: 'Medical Attachment Uploaded',
                description: `Document '${file.originalname}' (${category}) added to patient chart.`,
                metadata: { attachmentId: attachment.id, fileName: file.originalname, category },
                createdById: uploadedById,
            });
            return attachment;
        }
        async getPatientAttachments(tenantId, patientId) {
            const db = this.dbService.db;
            await this.getPatientById(tenantId, patientId);
            return db
                .select()
                .from(db_1.patientAttachments)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patientAttachments.tenantId, tenantId), (0, db_1.eq)(db_1.patientAttachments.patientId, patientId)));
        }
        async getPatientNotes(tenantId, patientId) {
            const db = this.dbService.db;
            return db.select().from(db_1.patientNotes).where((0, db_1.and)((0, db_1.eq)(db_1.patientNotes.tenantId, tenantId), (0, db_1.eq)(db_1.patientNotes.patientId, patientId))).orderBy((0, db_1.sql) `${db_1.patientNotes.createdAt} DESC`);
        }
        async addPatientNote(tenantId, patientId, authorId, note) {
            const db = this.dbService.db;
            const [newNote] = await db.insert(db_1.patientNotes).values({
                tenantId,
                patientId,
                authorId,
                note,
            }).returning();
            return newNote;
        }
        async getPatientTags(tenantId, patientId) {
            const db = this.dbService.db;
            return db.select({
                id: db_1.patientTags.id,
                name: db_1.patientTags.name,
                color: db_1.patientTags.color
            }).from(db_1.patientTagAssignments)
                .innerJoin(db_1.patientTags, (0, db_1.eq)(db_1.patientTagAssignments.tagId, db_1.patientTags.id))
                .where((0, db_1.and)((0, db_1.eq)(db_1.patientTagAssignments.patientId, patientId), (0, db_1.eq)(db_1.patientTags.tenantId, tenantId)));
        }
    };
    return PatientService = _classThis;
})();
exports.PatientService = PatientService;
