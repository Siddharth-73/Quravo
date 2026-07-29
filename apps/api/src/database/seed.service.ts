import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { tenants, users, tenantMemberships, clinicBranches, patients, appointments, emrEncounters, invoices, eq, and } from '@quravo/db';
import * as argon2 from '@node-rs/argon2';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.seedDatabase();
    } catch (err: any) {
      this.logger.warn(`Database auto-seeding note: ${err.message}`);
    }
  }

  async seedDatabase() {
    const db = this.dbService.db;
    this.logger.log('🌱 Checking & seeding database records for all role dashboards...');

    // 1. Seed Main Tenant
    let [mainTenant] = await db.select().from(tenants).where(eq(tenants.slug, 'apexhealth')).limit(1);
    if (!mainTenant) {
      [mainTenant] = await db
        .insert(tenants)
        .values({
          name: 'Apex Health India Clinic',
          slug: 'apexhealth',
          planTier: 'growth',
          status: 'active',
        })
        .returning();
      this.logger.log('✅ Created main tenant: Apex Health India Clinic');
    }

    // 2. Seed Main Branch
    let [mainBranch] = await db.select().from(clinicBranches).where(eq(clinicBranches.tenantId, mainTenant.id)).limit(1);
    if (!mainBranch) {
      [mainBranch] = await db
        .insert(clinicBranches)
        .values({
          tenantId: mainTenant.id,
          name: 'MG Road Flagship Branch',
          address: '102 Medical Enclave, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          phone: '+91 98765 43210',
          email: 'mumbai@apexhealth.in',
          isMain: true,
          status: 'active',
        })
        .returning();
      this.logger.log('✅ Created main clinic branch: MG Road Flagship Branch');
    }

    // 3. Seed Practice Roles & Users
    const defaultUsers = [
      { email: 'sharmasiddharth7373@gmail.com', pass: 'superadmin123', first: 'Siddharth', last: 'Sharma', role: 'super_admin' },
      { email: 'owner@clinic.com', pass: 'owner123', first: 'Alexander', last: 'Vance', role: 'owner' },
      { email: 'doctor@clinic.com', pass: 'doctor123', first: 'Dr. Siddharth', last: 'Sharma', role: 'doctor' },
      { email: 'nurse@clinic.com', pass: 'nurse123', first: 'Emily', last: 'Blunt', role: 'nurse' },
      { email: 'receptionist@clinic.com', pass: 'receptionist123', first: 'Jessica', last: 'Taylor', role: 'receptionist' },
      { email: 'pharmacist@clinic.com', pass: 'pharmacist123', first: 'Michael', last: 'Scott', role: 'staff' },
      { email: 'patient@clinic.com', pass: 'patient123', first: 'Priya', last: 'Patel', role: 'patient' },
    ];

    const seededUserMap: Record<string, string> = {};

    for (const u of defaultUsers) {
      let [existingUser] = await db.select().from(users).where(eq(users.email, u.email.toLowerCase())).limit(1);
      if (!existingUser) {
        const hash = await argon2.hash(u.pass);
        [existingUser] = await db
          .insert(users)
          .values({
            email: u.email.toLowerCase(),
            passwordHash: hash,
            firstName: u.first,
            lastName: u.last,
            isEmailVerified: true,
            status: 'active',
          })
          .returning();
      }
      seededUserMap[u.email.toLowerCase()] = existingUser.id;

      // Link membership
      const [existingMem] = await db
        .select()
        .from(tenantMemberships)
        .where(and(eq(tenantMemberships.userId, existingUser.id), eq(tenantMemberships.tenantId, mainTenant.id)))
        .limit(1);

      if (!existingMem) {
        await db.insert(tenantMemberships).values({
          tenantId: mainTenant.id,
          userId: existingUser.id,
          role: u.role as any,
          status: 'active',
        });
      }
    }

    // 4. Seed Patients
    const initialPatients = [
      { patientNumber: 'MRN-2026-001', firstName: 'Priya', lastName: 'Patel', email: 'patient@clinic.com', phone: '+91 98765 43210', dob: '1992-05-14', gender: 'female', city: 'Mumbai', blood: 'O+' },
      { patientNumber: 'MRN-2026-002', firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@gmail.com', phone: '+91 98123 45678', dob: '1988-11-20', gender: 'male', city: 'Delhi NCR', blood: 'A+' },
      { patientNumber: 'MRN-2026-003', firstName: 'Aarav', lastName: 'Mehta', email: 'aarav.mehta@gmail.com', phone: '+91 97111 22334', dob: '2018-03-08', gender: 'male', city: 'Bengaluru', blood: 'B+' },
    ];

    const seededPatientIds: string[] = [];

    for (const p of initialPatients) {
      let [pat] = await db.select().from(patients).where(eq(patients.patientNumber, p.patientNumber)).limit(1);
      if (!pat) {
        [pat] = await db
          .insert(patients)
          .values({
            tenantId: mainTenant.id,
            patientNumber: p.patientNumber,
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phone: p.phone,
            dateOfBirth: p.dob,
            gender: p.gender,
            bloodGroup: p.blood,
            city: p.city,
            state: 'Maharashtra',
            address: '102 Medical Enclave, MG Road',
            status: 'active',
          })
          .returning();
      }
      seededPatientIds.push(pat.id);
    }
    this.logger.log(`✅ Seeded ${seededPatientIds.length} active patient records`);

    // 5. Seed Appointments
    const doctorUserId = seededUserMap['doctor@clinic.com'];
    if (doctorUserId && seededPatientIds.length > 0) {
      const existingAppts = await db.select().from(appointments).where(eq(appointments.tenantId, mainTenant.id));
      if (existingAppts.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await db.insert(appointments).values([
          {
            tenantId: mainTenant.id,
            branchId: mainBranch.id,
            patientId: seededPatientIds[0],
            doctorId: doctorUserId,
            appointmentNumber: 'APPT-2026-001',
            type: 'scheduled',
            status: 'scheduled',
            startTime: today,
            endTime: new Date(today.getTime() + 30 * 60000),
            tokenNumber: 1,
            chiefComplaint: 'Routine Hypertension Follow-up & BP Check',
          },
          {
            tenantId: mainTenant.id,
            branchId: mainBranch.id,
            patientId: seededPatientIds[1],
            doctorId: doctorUserId,
            appointmentNumber: 'APPT-2026-002',
            type: 'scheduled',
            status: 'completed',
            startTime: new Date(today.getTime() - 2 * 3600000),
            endTime: new Date(today.getTime() - 1.5 * 3600000),
            tokenNumber: 2,
            chiefComplaint: 'Fasting Blood Glucose Review & Lab Report Audit',
          },
          {
            tenantId: mainTenant.id,
            branchId: mainBranch.id,
            patientId: seededPatientIds[2],
            doctorId: doctorUserId,
            appointmentNumber: 'APPT-2026-003',
            type: 'walk_in',
            status: 'scheduled',
            startTime: tomorrow,
            endTime: new Date(tomorrow.getTime() + 30 * 60000),
            tokenNumber: 3,
            chiefComplaint: 'Pediatric Cough, Mild Fever & General Checkup',
          },
        ]);
        this.logger.log('✅ Seeded 3 practice appointment consultations');
      }
    }

    this.logger.log('🎉 Database dynamic seeding completed successfully!');
    return { success: true, message: 'All practice roles, patients, appointments, and modules seeded in database.' };
  }
}
