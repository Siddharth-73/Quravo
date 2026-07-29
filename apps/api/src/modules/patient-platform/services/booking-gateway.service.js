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
exports.BookingGatewayService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let BookingGatewayService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BookingGatewayService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BookingGatewayService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        appointmentService;
        constructor(dbService, appointmentService) {
            this.dbService = dbService;
            this.appointmentService = appointmentService;
        }
        validateDate(value, fieldName = 'date') {
            if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new common_1.BadRequestException(`${fieldName} must be a valid YYYY-MM-DD date.`);
            }
            const parsed = new Date(`${value}T00:00:00.000Z`);
            if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
                throw new common_1.BadRequestException(`${fieldName} must be a valid YYYY-MM-DD date.`);
            }
            return value;
        }
        validateBookingDate(value) {
            const date = this.validateDate(value);
            const today = new Date().toISOString().slice(0, 10);
            if (date < today) {
                throw new common_1.BadRequestException('Date cannot be in the past.');
            }
            return date;
        }
        async resolveTenant(tenantSlug, requestTenant) {
            if (requestTenant) {
                return requestTenant;
            }
            if (!tenantSlug?.trim()) {
                throw new common_1.BadRequestException('A tenant slug is required when no clinic context is available.');
            }
            const [tenant] = await this.dbService.db
                .select({ id: db_1.tenants.id, name: db_1.tenants.name, slug: db_1.tenants.slug, status: db_1.tenants.status })
                .from(db_1.tenants)
                .where((0, db_1.eq)(db_1.tenants.slug, tenantSlug.trim().toLowerCase()))
                .limit(1);
            if (!tenant) {
                throw new common_1.NotFoundException('Clinic not found.');
            }
            if (tenant.status !== 'active') {
                throw new common_1.ForbiddenException('Clinic is not accepting bookings.');
            }
            return { id: tenant.id, name: tenant.name, slug: tenant.slug };
        }
        async getActiveBranches(tenantId) {
            return this.dbService.db
                .select({ id: db_1.clinicBranches.id, name: db_1.clinicBranches.name, isMain: db_1.clinicBranches.isMain })
                .from(db_1.clinicBranches)
                .where((0, db_1.and)((0, db_1.eq)(db_1.clinicBranches.tenantId, tenantId), (0, db_1.eq)(db_1.clinicBranches.status, 'active')));
        }
        async getActiveDoctors(tenantId) {
            const rows = await this.dbService.db
                .select({ id: db_1.users.id, firstName: db_1.users.firstName, lastName: db_1.users.lastName })
                .from(db_1.tenantMemberships)
                .innerJoin(db_1.users, (0, db_1.eq)(db_1.tenantMemberships.userId, db_1.users.id))
                .where((0, db_1.and)((0, db_1.eq)(db_1.tenantMemberships.tenantId, tenantId), (0, db_1.eq)(db_1.tenantMemberships.role, 'doctor'), (0, db_1.eq)(db_1.tenantMemberships.status, 'active'), (0, db_1.eq)(db_1.users.status, 'active')));
            return rows.map((doctor) => ({
                id: doctor.id,
                name: `${doctor.firstName} ${doctor.lastName}`.trim(),
            }));
        }
        getUtcSlot(date, time) {
            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
                return null;
            const slot = new Date(`${date}T${time}:00.000Z`);
            return Number.isNaN(slot.getTime()) ? null : slot;
        }
        async searchAvailability(criteria, requestTenant) {
            const date = this.validateBookingDate(criteria?.date);
            const tenant = await this.resolveTenant(criteria?.tenantSlug, requestTenant);
            const branches = await this.getActiveBranches(tenant.id);
            const branch = criteria?.branchId
                ? branches.find((item) => item.id === criteria.branchId)
                : branches.find((item) => item.isMain) ?? branches[0];
            if (criteria?.branchId && !branch) {
                throw new common_1.NotFoundException('Active clinic branch not found.');
            }
            const doctors = await this.getActiveDoctors(tenant.id);
            if (!branch || doctors.length === 0) {
                return {
                    tenant,
                    branches: branches.map(({ id, name }) => ({ id, name })),
                    doctors,
                    slots: [],
                };
            }
            const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay();
            const [hours] = await this.dbService.db
                .select()
                .from(db_1.branchWorkingHours)
                .where((0, db_1.and)((0, db_1.eq)(db_1.branchWorkingHours.tenantId, tenant.id), (0, db_1.eq)(db_1.branchWorkingHours.branchId, branch.id), (0, db_1.eq)(db_1.branchWorkingHours.dayOfWeek, weekday)))
                .limit(1);
            if (!hours || hours.isClosed) {
                return { tenant, branches: branches.map(({ id, name }) => ({ id, name })), doctors, slots: [] };
            }
            // Working hours are currently interpreted as UTC. Convert using a clinic-configured timezone when that exists.
            const open = this.getUtcSlot(date, hours.openTime);
            const close = this.getUtcSlot(date, hours.closeTime);
            if (!open || !close || close <= open) {
                return { tenant, branches: branches.map(({ id, name }) => ({ id, name })), doctors, slots: [] };
            }
            const now = new Date();
            const candidates = [];
            for (let start = open.getTime(); start + 30 * 60 * 1000 <= close.getTime() && candidates.length < 16; start += 30 * 60 * 1000) {
                const slotStart = new Date(start);
                if (slotStart > now)
                    candidates.push(slotStart);
            }
            const slots = [];
            for (const doctor of doctors) {
                for (const startTime of candidates) {
                    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
                    const conflict = await this.appointmentService.checkDoctorConflict(tenant.id, doctor.id, startTime, endTime);
                    if (!conflict) {
                        slots.push({
                            doctorId: doctor.id,
                            branchId: branch.id,
                            startTime: startTime.toISOString(),
                            endTime: endTime.toISOString(),
                            label: startTime.toISOString().slice(11, 16),
                        });
                    }
                }
            }
            return { tenant, branches: branches.map(({ id, name }) => ({ id, name })), doctors, slots };
        }
        async createPublicBooking(dto, requestTenant) {
            // TODO: protect this public write with rate limiting and Turnstile verification in production.
            const tenant = await this.resolveTenant(dto?.tenantSlug, requestTenant);
            if (!dto || !this.isUuid(dto.branchId) || !this.isUuid(dto.doctorId)) {
                throw new common_1.BadRequestException('A valid branch and doctor are required.');
            }
            if (!dto.firstName?.trim() || !dto.lastName?.trim() || !dto.email?.trim() || !dto.phone?.trim()) {
                throw new common_1.BadRequestException('First name, last name, email, and phone are required.');
            }
            this.validateDate(dto.dateOfBirth, 'Date of birth');
            if (!['male', 'female', 'other'].includes(dto.gender)) {
                throw new common_1.BadRequestException('Gender must be male, female, or other.');
            }
            const startTime = new Date(dto.startTime);
            if (Number.isNaN(startTime.getTime()) || startTime <= new Date()) {
                throw new common_1.BadRequestException('Start time must be a valid future ISO timestamp.');
            }
            if (startTime.getUTCSeconds() !== 0 || startTime.getUTCMilliseconds() !== 0 || startTime.getUTCMinutes() % 30 !== 0) {
                throw new common_1.BadRequestException('Start time must align to a 30-minute boundary.');
            }
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
            const [branch] = await this.dbService.db
                .select({ id: db_1.clinicBranches.id, name: db_1.clinicBranches.name })
                .from(db_1.clinicBranches)
                .where((0, db_1.and)((0, db_1.eq)(db_1.clinicBranches.id, dto.branchId), (0, db_1.eq)(db_1.clinicBranches.tenantId, tenant.id), (0, db_1.eq)(db_1.clinicBranches.status, 'active')))
                .limit(1);
            if (!branch)
                throw new common_1.NotFoundException('Active clinic branch not found.');
            const [doctor] = await this.dbService.db
                .select({ id: db_1.users.id, firstName: db_1.users.firstName, lastName: db_1.users.lastName })
                .from(db_1.tenantMemberships)
                .innerJoin(db_1.users, (0, db_1.eq)(db_1.tenantMemberships.userId, db_1.users.id))
                .where((0, db_1.and)((0, db_1.eq)(db_1.tenantMemberships.tenantId, tenant.id), (0, db_1.eq)(db_1.tenantMemberships.userId, dto.doctorId), (0, db_1.eq)(db_1.tenantMemberships.role, 'doctor'), (0, db_1.eq)(db_1.tenantMemberships.status, 'active'), (0, db_1.eq)(db_1.users.status, 'active')))
                .limit(1);
            if (!doctor)
                throw new common_1.NotFoundException('Active doctor not found.');
            if (await this.appointmentService.checkDoctorConflict(tenant.id, doctor.id, startTime, endTime)) {
                throw new common_1.ConflictException('Doctor is already booked for this time slot.');
            }
            const patient = await this.findOrCreatePatient(tenant.id, dto);
            const appointment = await this.appointmentService.createAppointment(tenant.id, doctor.id, {
                branchId: branch.id,
                patientId: patient.id,
                doctorId: doctor.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                chiefComplaint: dto.chiefComplaint?.trim() || undefined,
            });
            return {
                appointmentNumber: appointment.appointmentNumber,
                startTime: appointment.startTime.toISOString(),
                endTime: appointment.endTime.toISOString(),
                doctorName: `${doctor.firstName} ${doctor.lastName}`.trim(),
                branchName: branch.name,
            };
        }
        async findOrCreatePatient(tenantId, dto) {
            const db = this.dbService.db;
            const email = dto.email.trim().toLowerCase();
            const phone = dto.phone.trim();
            const [existing] = await db
                .select({ id: db_1.patients.id })
                .from(db_1.patients)
                .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.or)((0, db_1.eq)(db_1.patients.email, email), (0, db_1.eq)(db_1.patients.phone, phone))))
                .limit(1);
            if (existing)
                return existing;
            // Serialize per-tenant numbering while retaining PatientService's PAT-{year}-{sequence} format.
            return db.transaction(async (tx) => {
                await tx.execute((0, db_1.sql) `select pg_advisory_xact_lock(hashtext(${`patient-number:${tenantId}`}))`);
                const [matched] = await tx
                    .select({ id: db_1.patients.id })
                    .from(db_1.patients)
                    .where((0, db_1.and)((0, db_1.eq)(db_1.patients.tenantId, tenantId), (0, db_1.or)((0, db_1.eq)(db_1.patients.email, email), (0, db_1.eq)(db_1.patients.phone, phone))))
                    .limit(1);
                if (matched)
                    return matched;
                const [{ count }] = await tx
                    .select({ count: (0, db_1.sql) `count(*)::int` })
                    .from(db_1.patients)
                    .where((0, db_1.eq)(db_1.patients.tenantId, tenantId));
                const patientNumber = `PAT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
                const [patient] = await tx
                    .insert(db_1.patients)
                    .values({
                    tenantId,
                    patientNumber,
                    firstName: dto.firstName.trim(),
                    lastName: dto.lastName.trim(),
                    email,
                    phone,
                    dateOfBirth: dto.dateOfBirth,
                    gender: dto.gender,
                })
                    .returning({ id: db_1.patients.id });
                return patient;
            });
        }
        isUuid(value) {
            return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
        }
    };
    return BookingGatewayService = _classThis;
})();
exports.BookingGatewayService = BookingGatewayService;
