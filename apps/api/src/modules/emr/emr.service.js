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
exports.EmrService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let EmrService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmrService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmrService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        auditService;
        constructor(dbService, auditService) {
            this.dbService = dbService;
            this.auditService = auditService;
        }
        async generateEncounterNumber(tenantId) {
            const db = this.dbService.db;
            const year = new Date().getFullYear();
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.emrEncounters)
                .where((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId));
            const sequence = (count + 1).toString().padStart(4, '0');
            return `ENC-${year}-${sequence}`;
        }
        async generatePrescriptionNumber(tenantId) {
            const db = this.dbService.db;
            const year = new Date().getFullYear();
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.prescriptions)
                .where((0, db_1.eq)(db_1.prescriptions.tenantId, tenantId));
            const sequence = (count + 1).toString().padStart(4, '0');
            return `RX-${year}-${sequence}`;
        }
        async createEncounter(tenantId, doctorId, dto) {
            const db = this.dbService.db;
            const encounterNumber = await this.generateEncounterNumber(tenantId);
            const [encounter] = await db
                .insert(db_1.emrEncounters)
                .values({
                tenantId,
                patientId: dto.patientId,
                doctorId,
                appointmentId: dto.appointmentId,
                encounterNumber,
                chiefComplaint: dto.chiefComplaint,
                subjectiveNotes: dto.subjectiveNotes,
                objectiveNotes: dto.objectiveNotes,
                assessmentDiagnosis: dto.assessmentDiagnosis || [],
                treatmentPlan: dto.treatmentPlan,
                vitals: dto.vitals || {},
                status: 'draft',
            })
                .returning();
            // Care Timeline entry
            await db.insert(db_1.patientTimeline).values({
                tenantId,
                patientId: dto.patientId,
                eventType: 'consultation_completed',
                title: 'Clinical Consultation Encounter Recorded',
                description: `Encounter ${encounter.encounterNumber} recorded for complaint '${dto.chiefComplaint}'.`,
                createdById: doctorId,
            });
            // Security Audit Log
            await this.auditService.log({
                tenantId,
                userId: doctorId,
                action: 'emr.encounter_created',
                resource: 'emr_encounter',
                resourceId: encounter.id,
            });
            return encounter;
        }
        async getEncounterById(tenantId, userId, encounterId) {
            const db = this.dbService.db;
            const [encounter] = await db
                .select()
                .from(db_1.emrEncounters)
                .where((0, db_1.and)((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId), (0, db_1.eq)(db_1.emrEncounters.id, encounterId)))
                .limit(1);
            if (!encounter) {
                throw new common_1.NotFoundException('EMR Encounter record not found.');
            }
            // Security Audit Log
            await this.auditService.log({
                tenantId,
                userId,
                action: 'emr.encounter_viewed',
                resource: 'emr_encounter',
                resourceId: encounter.id,
            });
            return encounter;
        }
        async updateEncounter(tenantId, userId, encounterId, dto) {
            const db = this.dbService.db;
            const encounter = await this.getEncounterById(tenantId, userId, encounterId);
            if (encounter.status === 'finalized') {
                throw new common_1.BadRequestException('Finalized EMR encounters cannot be modified. Only amendments are permitted.');
            }
            const [updated] = await db
                .update(db_1.emrEncounters)
                .set({
                chiefComplaint: dto.chiefComplaint,
                subjectiveNotes: dto.subjectiveNotes,
                objectiveNotes: dto.objectiveNotes,
                assessmentDiagnosis: dto.assessmentDiagnosis || [],
                treatmentPlan: dto.treatmentPlan,
                vitals: dto.vitals || {},
                updatedAt: new Date(),
            })
                .where((0, db_1.eq)(db_1.emrEncounters.id, encounterId))
                .returning();
            await this.auditService.log({
                tenantId,
                userId,
                action: 'emr.encounter_updated',
                resource: 'emr_encounter',
                resourceId: encounterId,
            });
            return updated;
        }
        async finalizeEncounter(tenantId, userId, encounterId) {
            const db = this.dbService.db;
            await this.getEncounterById(tenantId, userId, encounterId);
            const [finalized] = await db
                .update(db_1.emrEncounters)
                .set({
                status: 'finalized',
                finalizedAt: new Date(),
                updatedAt: new Date(),
            })
                .where((0, db_1.and)((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId), (0, db_1.eq)(db_1.emrEncounters.id, encounterId)))
                .returning();
            await this.auditService.log({
                tenantId,
                userId,
                action: 'emr.encounter_finalized',
                resource: 'emr_encounter',
                resourceId: encounterId,
            });
            return finalized;
        }
        async createPrescription(tenantId, doctorId, dto) {
            const db = this.dbService.db;
            const prescriptionNumber = await this.generatePrescriptionNumber(tenantId);
            const [prescription] = await db
                .insert(db_1.prescriptions)
                .values({
                tenantId,
                patientId: dto.patientId,
                doctorId,
                encounterId: dto.encounterId,
                prescriptionNumber,
                instructions: dto.instructions,
                status: 'active',
            })
                .returning();
            const itemsToInsert = dto.items.map((item) => ({
                tenantId,
                prescriptionId: prescription.id,
                medicationName: item.medicationName,
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration,
                route: item.route || 'oral',
                specialInstructions: item.specialInstructions,
            }));
            const insertedItems = await db.insert(db_1.prescriptionItems).values(itemsToInsert).returning();
            // Care Timeline record
            await db.insert(db_1.patientTimeline).values({
                tenantId,
                patientId: dto.patientId,
                eventType: 'prescription_issued',
                title: 'Prescription Issued',
                description: `Prescription ${prescriptionNumber} (${insertedItems.length} items) issued by physician.`,
                createdById: doctorId,
            });
            await this.auditService.log({
                tenantId,
                userId: doctorId,
                action: 'emr.prescription_created',
                resource: 'prescription',
                resourceId: prescription.id,
            });
            return {
                prescription,
                items: insertedItems,
            };
        }
        async getPatientEncounters(tenantId, userId, patientId) {
            const db = this.dbService.db;
            const items = await db
                .select({
                id: db_1.emrEncounters.id,
                encounterNumber: db_1.emrEncounters.encounterNumber,
                encounterDate: db_1.emrEncounters.encounterDate,
                chiefComplaint: db_1.emrEncounters.chiefComplaint,
                subjectiveNotes: db_1.emrEncounters.subjectiveNotes,
                objectiveNotes: db_1.emrEncounters.objectiveNotes,
                assessmentDiagnosis: db_1.emrEncounters.assessmentDiagnosis,
                treatmentPlan: db_1.emrEncounters.treatmentPlan,
                vitals: db_1.emrEncounters.vitals,
                status: db_1.emrEncounters.status,
                patientId: db_1.emrEncounters.patientId,
                patientFirstName: db_1.patients.firstName,
                patientLastName: db_1.patients.lastName,
            })
                .from(db_1.emrEncounters)
                .leftJoin(db_1.patients, (0, db_1.eq)(db_1.emrEncounters.patientId, db_1.patients.id))
                .where((0, db_1.and)((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId), (0, db_1.eq)(db_1.emrEncounters.patientId, patientId)))
                .orderBy((0, db_1.sql) `${db_1.emrEncounters.createdAt} DESC`);
            await this.auditService.log({
                tenantId,
                userId,
                action: 'emr.chart_viewed',
                resource: 'patient_chart',
                resourceId: patientId,
            });
            return items;
        }
        async getAllEncounters(tenantId) {
            const db = this.dbService.db;
            return db
                .select({
                id: db_1.emrEncounters.id,
                encounterNumber: db_1.emrEncounters.encounterNumber,
                encounterDate: db_1.emrEncounters.encounterDate,
                chiefComplaint: db_1.emrEncounters.chiefComplaint,
                subjectiveNotes: db_1.emrEncounters.subjectiveNotes,
                objectiveNotes: db_1.emrEncounters.objectiveNotes,
                assessmentDiagnosis: db_1.emrEncounters.assessmentDiagnosis,
                treatmentPlan: db_1.emrEncounters.treatmentPlan,
                vitals: db_1.emrEncounters.vitals,
                status: db_1.emrEncounters.status,
                patientId: db_1.emrEncounters.patientId,
                patientFirstName: db_1.patients.firstName,
                patientLastName: db_1.patients.lastName,
            })
                .from(db_1.emrEncounters)
                .leftJoin(db_1.patients, (0, db_1.eq)(db_1.emrEncounters.patientId, db_1.patients.id))
                .where((0, db_1.eq)(db_1.emrEncounters.tenantId, tenantId))
                .orderBy((0, db_1.sql) `${db_1.emrEncounters.createdAt} DESC`);
        }
    };
    return EmrService = _classThis;
})();
exports.EmrService = EmrService;
