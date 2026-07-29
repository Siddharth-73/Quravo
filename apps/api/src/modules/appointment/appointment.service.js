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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const common_2 = require("@quravo/common");
let AppointmentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppointmentService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppointmentService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        queueService;
        eventEmitter;
        logger = new common_1.Logger(AppointmentService.name);
        constructor(dbService, queueService, eventEmitter) {
            this.dbService = dbService;
            this.queueService = queueService;
            this.eventEmitter = eventEmitter;
        }
        async generateAppointmentNumber(tenantId) {
            const db = this.dbService.db;
            const year = new Date().getFullYear();
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.appointments)
                .where((0, db_1.eq)(db_1.appointments.tenantId, tenantId));
            const sequence = (count + 1).toString().padStart(4, '0');
            return `APT-${year}-${sequence}`;
        }
        async getNextWalkInToken(tenantId, branchId, dateStr) {
            const db = this.dbService.db;
            const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
            const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);
            const [{ count }] = await db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.appointments)
                .where((0, db_1.and)((0, db_1.eq)(db_1.appointments.tenantId, tenantId), (0, db_1.eq)(db_1.appointments.branchId, branchId), (0, db_1.eq)(db_1.appointments.type, 'walk_in'), (0, db_1.gte)(db_1.appointments.createdAt, dayStart), (0, db_1.lte)(db_1.appointments.createdAt, dayEnd)));
            return count + 1;
        }
        async checkDoctorConflict(tenantId, doctorId, startTime, endTime, excludeId) {
            const db = this.dbService.db;
            let conditions = (0, db_1.and)((0, db_1.eq)(db_1.appointments.tenantId, tenantId), (0, db_1.eq)(db_1.appointments.doctorId, doctorId), (0, db_1.ne)(db_1.appointments.status, 'cancelled'), (0, db_1.sql) `${db_1.appointments.startTime} < ${endTime.toISOString()}`, (0, db_1.sql) `${db_1.appointments.endTime} > ${startTime.toISOString()}`);
            if (excludeId) {
                conditions = (0, db_1.and)(conditions, (0, db_1.ne)(db_1.appointments.id, excludeId));
            }
            const [existing] = await db.select().from(db_1.appointments).where(conditions).limit(1);
            return !!existing;
        }
        async createAppointment(tenantId, createdById, dto) {
            const db = this.dbService.db;
            const startTime = new Date(dto.startTime);
            const endTime = dto.endTime ? new Date(dto.endTime) : new Date(startTime.getTime() + 30 * 60 * 1000); // 30 mins default
            if (endTime <= startTime) {
                throw new common_1.BadRequestException('Appointment end time must be after start time.');
            }
            // Overlap conflict validation
            const isConflicting = await this.checkDoctorConflict(tenantId, dto.doctorId, startTime, endTime);
            if (isConflicting) {
                throw new common_1.ConflictException('Doctor is already booked for an overlapping time slot.');
            }
            const appointmentNumber = await this.generateAppointmentNumber(tenantId);
            const [appointment] = await db
                .insert(db_1.appointments)
                .values({
                tenantId,
                branchId: dto.branchId,
                patientId: dto.patientId,
                doctorId: dto.doctorId,
                appointmentNumber,
                type: 'scheduled',
                status: 'scheduled',
                startTime,
                endTime,
                chiefComplaint: dto.chiefComplaint,
                notes: dto.notes,
                createdById,
            })
                .returning();
            // Timeline record
            await db.insert(db_1.patientTimeline).values({
                tenantId,
                patientId: dto.patientId,
                eventType: 'appointment_scheduled',
                title: 'Appointment Scheduled',
                description: `Appointment ${appointment.appointmentNumber} scheduled for ${startTime.toISOString()}.`,
                createdById,
            });
            // Domain event
            const eventPayload = {
                appointmentId: appointment.id,
                tenantId,
                branchId: dto.branchId,
                patientId: dto.patientId,
                doctorId: dto.doctorId,
                appointmentNumber,
                type: 'scheduled',
                status: 'scheduled',
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            };
            this.eventEmitter.emit('appointment.scheduled', new common_2.AppointmentScheduledEvent(eventPayload));
            // Enqueue async queues
            const [patient] = await db
                .select()
                .from(db_1.patients)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.eq)(db_1.patients.id, dto.patientId)))
                .limit(1);
            if (patient?.email) {
                await this.queueService.addJob('notification-queue', {
                    tenantId,
                    type: 'appointment_confirmed',
                    recipientEmail: patient.email,
                    title: 'Appointment Confirmation',
                    message: `Your appointment ${appointmentNumber} is confirmed for ${startTime.toLocaleString()}`,
                });
            }
            else {
                this.logger.debug(`Skipping appointment confirmation notification for patient ${dto.patientId}: no email on file.`);
            }
            return appointment;
        }
        async createWalkIn(tenantId, createdById, dto) {
            const db = this.dbService.db;
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const tokenNumber = await this.getNextWalkInToken(tenantId, dto.branchId, todayStr);
            const appointmentNumber = await this.generateAppointmentNumber(tenantId);
            const startTime = now;
            const endTime = new Date(now.getTime() + 30 * 60 * 1000);
            const [appointment] = await db
                .insert(db_1.appointments)
                .values({
                tenantId,
                branchId: dto.branchId,
                patientId: dto.patientId,
                doctorId: dto.doctorId,
                appointmentNumber,
                type: 'walk_in',
                status: 'checked_in', // Walk-ins default to checked_in
                startTime,
                endTime,
                tokenNumber,
                chiefComplaint: dto.chiefComplaint,
                createdById,
            })
                .returning();
            return {
                appointment,
                tokenDisplay: `Token #${tokenNumber}`,
            };
        }
        async getAppointmentsCalendar(tenantId, branchId, startDate, endDate, doctorId) {
            const db = this.dbService.db;
            let conditions = (0, db_1.eq)(db_1.appointments.tenantId, tenantId);
            if (branchId) {
                conditions = (0, db_1.and)(conditions, (0, db_1.eq)(db_1.appointments.branchId, branchId));
            }
            if (doctorId) {
                conditions = (0, db_1.and)(conditions, (0, db_1.eq)(db_1.appointments.doctorId, doctorId));
            }
            if (startDate) {
                conditions = (0, db_1.and)(conditions, (0, db_1.gte)(db_1.appointments.startTime, new Date(startDate)));
            }
            if (endDate) {
                conditions = (0, db_1.and)(conditions, (0, db_1.lte)(db_1.appointments.startTime, new Date(endDate)));
            }
            return db
                .select({
                id: db_1.appointments.id,
                appointmentNumber: db_1.appointments.appointmentNumber,
                type: db_1.appointments.type,
                status: db_1.appointments.status,
                startTime: db_1.appointments.startTime,
                endTime: db_1.appointments.endTime,
                tokenNumber: db_1.appointments.tokenNumber,
                chiefComplaint: db_1.appointments.chiefComplaint,
                notes: db_1.appointments.notes,
                patientId: db_1.appointments.patientId,
                patientFirstName: db_1.patients.firstName,
                patientLastName: db_1.patients.lastName,
                doctorId: db_1.appointments.doctorId,
                doctorFirstName: db_1.users.firstName,
                doctorLastName: db_1.users.lastName,
            })
                .from(db_1.appointments)
                .leftJoin(db_1.patients, (0, db_1.eq)(db_1.appointments.patientId, db_1.patients.id))
                .leftJoin(db_1.users, (0, db_1.eq)(db_1.appointments.doctorId, db_1.users.id))
                .where(conditions)
                .orderBy((0, db_1.sql) `${db_1.appointments.startTime} ASC`);
        }
        async updateStatus(tenantId, appointmentId, dto) {
            const db = this.dbService.db;
            const [existing] = await db
                .select()
                .from(db_1.appointments)
                .where((0, db_1.and)((0, db_1.eq)(db_1.appointments.tenantId, tenantId), (0, db_1.eq)(db_1.appointments.id, appointmentId)))
                .limit(1);
            if (!existing) {
                throw new common_1.NotFoundException('Appointment record not found.');
            }
            const [updated] = await db
                .update(db_1.appointments)
                .set({
                status: dto.status,
                cancelledReason: dto.cancelledReason || existing.cancelledReason,
                notes: dto.notes ? `${existing.notes || ''}\n${dto.notes}` : existing.notes,
                updatedAt: new Date(),
            })
                .where((0, db_1.eq)(db_1.appointments.id, appointmentId))
                .returning();
            const eventPayload = {
                appointmentId: updated.id,
                tenantId,
                branchId: updated.branchId,
                patientId: updated.patientId,
                doctorId: updated.doctorId,
                appointmentNumber: updated.appointmentNumber,
                type: updated.type,
                status: updated.status,
                startTime: updated.startTime.toISOString(),
                endTime: updated.endTime.toISOString(),
                tokenNumber: updated.tokenNumber || undefined,
            };
            if (dto.status === 'cancelled') {
                this.eventEmitter.emit('appointment.cancelled', new common_2.AppointmentCancelledEvent(eventPayload));
            }
            else {
                this.eventEmitter.emit('appointment.status_changed', new common_2.AppointmentStatusChangedEvent(eventPayload));
            }
            return updated;
        }
        async getLiveQueue(tenantId, branchId) {
            const db = this.dbService.db;
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            return db
                .select({
                id: db_1.appointments.id,
                appointmentNumber: db_1.appointments.appointmentNumber,
                type: db_1.appointments.type,
                status: db_1.appointments.status,
                startTime: db_1.appointments.startTime,
                endTime: db_1.appointments.endTime,
                tokenNumber: db_1.appointments.tokenNumber,
                chiefComplaint: db_1.appointments.chiefComplaint,
                patientId: db_1.appointments.patientId,
                patientFirstName: db_1.patients.firstName,
                patientLastName: db_1.patients.lastName,
                doctorId: db_1.appointments.doctorId,
                doctorFirstName: db_1.users.firstName,
                doctorLastName: db_1.users.lastName,
            })
                .from(db_1.appointments)
                .leftJoin(db_1.patients, (0, db_1.eq)(db_1.appointments.patientId, db_1.patients.id))
                .leftJoin(db_1.users, (0, db_1.eq)(db_1.appointments.doctorId, db_1.users.id))
                .where((0, db_1.and)((0, db_1.eq)(db_1.appointments.tenantId, tenantId), (0, db_1.eq)(db_1.appointments.branchId, branchId), (0, db_1.gte)(db_1.appointments.startTime, todayStart), (0, db_1.ne)(db_1.appointments.status, 'completed'), (0, db_1.ne)(db_1.appointments.status, 'cancelled')))
                .orderBy((0, db_1.sql) `${db_1.appointments.tokenNumber} ASC NULLS LAST, ${db_1.appointments.startTime} ASC`);
        }
    };
    return AppointmentService = _classThis;
})();
exports.AppointmentService = AppointmentService;
