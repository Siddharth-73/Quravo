import { db } from './client';
import {
  tenants,
  users,
  tenantMemberships,
  patients,
  clinicBranches,
  appointments,
  invoices,
  payments,
  clinicListings,
} from './schema';
import { eq } from 'drizzle-orm';
import { pbkdf2Sync, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `$pbkdf2$${salt}$${hash}`;
}

export async function seedIndianHealthcareData() {
  console.log('🌱 Seeding complete Indian Healthcare Database across all tables...');

  // Password hash for all seeded demo users: Quravo@123!
  const defaultPasswordHash = hashPassword('Quravo@123!');

  // 1. Seed 6 Registered Indian Hospitals / Tenants with fixed UUID v4s
  const indianTenants = [
    {
      id: '11111111-1111-4111-a111-111111111111',
      name: 'Apollo Hospitals, New Delhi',
      slug: 'apollo-delhi',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'enterprise' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'info@apollo-delhi.com',
        phone: '+91 11 2692 5858',
        address: 'Sarita Vihar, Delhi Mathura Road, New Delhi - 110076',
        contactPerson: 'Dr. Alok Verma',
      },
    },
    {
      id: '22222222-2222-4222-a222-222222222222',
      name: 'Fortis Healthcare, Mumbai',
      slug: 'fortis-mumbai',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'professional' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'care@fortis-mumbai.com',
        phone: '+91 22 6799 4444',
        address: 'Mulund Goregaon Link Road, Mumbai - 400078',
        contactPerson: 'Dr. Rashmi Shah',
      },
    },
    {
      id: '33333333-3333-4333-a333-333333333333',
      name: 'Max Super Specialty, Bengaluru',
      slug: 'max-bengaluru',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'enterprise' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'contact@max-bengaluru.in',
        phone: '+91 80 4050 0000',
        address: 'Indiranagar 100 Feet Road, Bengaluru - 560038',
        contactPerson: 'Dr. Suresh Reddy',
      },
    },
    {
      id: '44444444-4444-4444-a444-444444444444',
      name: 'Manipal Hospital, Hyderabad',
      slug: 'manipal-hyderabad',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'professional' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'appointments@manipal-hyd.com',
        phone: '+91 40 2311 5555',
        address: 'HITECH City, Gachibowli, Hyderabad - 500081',
        contactPerson: 'Dr. Kavita Rao',
      },
    },
    {
      id: '55555555-5555-4555-a555-555555555555',
      name: 'Medanta The Medicity, Gurugram',
      slug: 'medanta-gurugram',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'enterprise' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'info@medanta.org',
        phone: '+91 124 4141 414',
        address: 'CH Baktawar Singh Road, Sector 38, Gurugram - 122001',
        contactPerson: 'Dr. Naresh Trehan',
      },
    },
    {
      id: '66666666-6666-4666-a666-666666666666',
      name: 'Narayana Health, Chennai',
      slug: 'narayana-chennai',
      country: 'India',
      currency: 'INR',
      region: 'Asia-South1',
      timezone: 'Asia/Kolkata',
      planTier: 'starter' as const,
      status: 'active' as const,
      contactDetails: {
        email: 'help@narayanahealth.org',
        phone: '+91 44 2815 0000',
        address: 'GST Road, Chromepet, Chennai - 600044',
        contactPerson: 'Dr. S. Kothandaraman',
      },
    },
  ];

  for (const t of indianTenants) {
    const [existing] = await db.select().from(tenants).where(eq(tenants.id, t.id)).limit(1);
    if (!existing) {
      await db.insert(tenants).values(t);
    }
  }

  // 2. Seed Main Branch for Apollo Hospital
  const apolloTenantId = '11111111-1111-4111-a111-111111111111';
  let [mainBranch] = await db.select().from(clinicBranches).where(eq(clinicBranches.tenantId, apolloTenantId)).limit(1);
  if (!mainBranch) {
    [mainBranch] = await db.insert(clinicBranches).values({
      tenantId: apolloTenantId,
      name: 'Apollo Hospitals New Delhi — Main Wing',
      code: 'DELHI-MAIN',
      isMain: true,
      status: 'active',
      address: 'Sarita Vihar, Delhi Mathura Road',
      city: 'New Delhi',
      state: 'Delhi',
    }).returning();
  }

  // 3. Seed Root Super Admin User
  const [rootSuperAdmin] = await db.select().from(users).where(eq(users.email, 'sharmasiddharth7373@gmail.com')).limit(1);
  if (!rootSuperAdmin) {
    await db.insert(users).values({
      email: 'sharmasiddharth7373@gmail.com',
      passwordHash: defaultPasswordHash,
      firstName: 'Siddharth',
      lastName: 'Sharma',
      isEmailVerified: true,
      status: 'active',
    });
  }

  // 4. Seed Users for Apollo Hospital
  const demoUsers = [
    { email: 'owner@clinic.com', firstName: 'Alexander', lastName: 'Vance', role: 'owner' as const },
    { email: 'doctor@clinic.com', firstName: 'Dr. Siddharth', lastName: 'Sharma', role: 'doctor' as const },
    { email: 'nurse@clinic.com', firstName: 'Ananya', lastName: 'Roy', role: 'nurse' as const },
    { email: 'receptionist@clinic.com', firstName: 'Vikram', lastName: 'Malhotra', role: 'receptionist' as const },
    { email: 'pharmacist@clinic.com', firstName: 'Priya', lastName: 'Patel', role: 'staff' as const },
    { email: 'patient@clinic.com', firstName: 'Rahul', lastName: 'Verma', role: 'patient' as const },
  ];

  let doctorUserId = '';
  for (const u of demoUsers) {
    let [dbUser] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
    if (!dbUser) {
      [dbUser] = await db.insert(users).values({
        email: u.email,
        passwordHash: defaultPasswordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        isEmailVerified: true,
        status: 'active',
      }).returning();
    }

    if (u.role === 'doctor') {
      doctorUserId = dbUser.id;
    }

    if (dbUser) {
      const [m] = await db
        .select()
        .from(tenantMemberships)
        .where(eq(tenantMemberships.userId, dbUser.id))
        .limit(1);

      if (!m) {
        await db.insert(tenantMemberships).values({
          tenantId: apolloTenantId,
          userId: dbUser.id,
          role: u.role,
          status: 'active',
        });
      }
    }
  }

  // 5. Seed Indian Patients for Apollo Hospital
  const indianPatients = [
    { firstName: 'Rahul', lastName: 'Verma', patientNumber: 'MRN-IN-1001', gender: 'male', dateOfBirth: '1988-04-12', phone: '+91 98111 00001', email: 'rahul.verma@gmail.com', city: 'New Delhi', state: 'Delhi' },
    { firstName: 'Priya', lastName: 'Patel', patientNumber: 'MRN-IN-1002', gender: 'female', dateOfBirth: '1992-08-25', phone: '+91 98222 00002', email: 'priya.patel@gmail.com', city: 'Mumbai', state: 'Maharashtra' },
    { firstName: 'Aarav', lastName: 'Mehta', patientNumber: 'MRN-IN-1003', gender: 'male', dateOfBirth: '2015-02-10', phone: '+91 98333 00003', email: 'mehta.family@gmail.com', city: 'Bengaluru', state: 'Karnataka' },
    { firstName: 'Sunita', lastName: 'Gupta', patientNumber: 'MRN-IN-1004', gender: 'female', dateOfBirth: '1975-11-05', phone: '+91 98444 00004', email: 'sunita.gupta@yahoo.in', city: 'Gurugram', state: 'Haryana' },
    { firstName: 'Rajesh', lastName: 'Kumar', patientNumber: 'MRN-IN-1005', gender: 'male', dateOfBirth: '1968-06-30', phone: '+91 98555 00005', email: 'rajesh.k@hotmail.com', city: 'Hyderabad', state: 'Telangana' },
  ];

  const seededPatientsList = [];
  for (const p of indianPatients) {
    const [existing] = await db.select().from(patients).where(eq(patients.patientNumber, p.patientNumber)).limit(1);
    if (!existing) {
      const [inserted] = await db.insert(patients).values({
        tenantId: apolloTenantId,
        firstName: p.firstName,
        lastName: p.lastName,
        patientNumber: p.patientNumber,
        gender: p.gender,
        dateOfBirth: p.dateOfBirth,
        phone: p.phone,
        email: p.email,
        city: p.city,
        state: p.state,
      }).returning();
      seededPatientsList.push(inserted);
    } else {
      seededPatientsList.push(existing);
    }
  }

  // 6. Seed Appointments & Invoices & Payments
  if (seededPatientsList.length > 0 && mainBranch && doctorUserId) {
    const p1 = seededPatientsList[0];
    const [existingAppt] = await db.select().from(appointments).where(eq(appointments.tenantId, apolloTenantId)).limit(1);
    if (!existingAppt) {
      const startTime = new Date();
      const endTime = new Date(Date.now() + 30 * 60 * 1000);

      const [appt1] = await db.insert(appointments).values({
        tenantId: apolloTenantId,
        branchId: mainBranch.id,
        patientId: p1.id,
        doctorId: doctorUserId,
        appointmentNumber: 'APT-IN-9001',
        type: 'scheduled',
        status: 'completed',
        startTime,
        endTime,
        chiefComplaint: 'Cardiology Routine Consultation',
      }).returning();

      // Seed Invoice
      const [inv1] = await db.insert(invoices).values({
        tenantId: apolloTenantId,
        branchId: mainBranch.id,
        patientId: p1.id,
        invoiceNumber: 'INV-IN-2026-001',
        issuedAt: new Date(),
        dueDate: new Date(),
        subtotal: '800.00',
        taxAmount: '0.00',
        totalAmount: '800.00',
        amountDue: '0.00',
        status: 'paid',
      }).returning();

      // Seed Payment
      await db.insert(payments).values({
        tenantId: apolloTenantId,
        invoiceId: inv1.id,
        patientId: p1.id,
        amount: '800.00',
        paymentMethod: 'online_gateway',
        status: 'completed',
        gatewayProvider: 'razorpay',
        gatewayOrderId: 'order_SwUFweahnIDY4u',
        transactionId: 'pay_SwUFweahnIDY4u',
      });
    }
  }

  // 7. Seed Clinic Listings for Super Admin
  const listings = [
    { clinicName: 'Apollo Hospitals, New Delhi', ownerName: 'Dr. Alok Verma', email: 'alok@apollo.com', phone: '+91 98100 12345', city: 'New Delhi', specialty: 'Cardiology & Multi-Specialty', status: 'approved' },
    { clinicName: 'Fortis Healthcare, Mumbai', ownerName: 'Dr. Rashmi Shah', email: 'rashmi@fortis.com', phone: '+91 98200 67890', city: 'Mumbai', specialty: 'Pediatrics & Oncology', status: 'approved' },
    { clinicName: 'Max Super Specialty, Bengaluru', ownerName: 'Dr. Suresh Reddy', email: 'suresh@max.in', phone: '+91 98450 11223', city: 'Bengaluru', specialty: 'Neurology & Orthopedics', status: 'approved' },
    { clinicName: 'Manipal Hospital, Hyderabad', ownerName: 'Dr. Kavita Rao', email: 'kavita@manipal.com', phone: '+91 98850 44556', city: 'Hyderabad', specialty: 'Gastroenterology', status: 'approved' },
    { clinicName: 'Medanta The Medicity, Gurugram', ownerName: 'Dr. Naresh Trehan', email: 'trehan@medanta.org', phone: '+91 98110 99887', city: 'Gurugram', specialty: 'Cardiac Surgery', status: 'approved' },
    { clinicName: 'Narayana Health, Chennai', ownerName: 'Dr. S. Kothandaraman', email: 'kothand@narayana.org', phone: '+91 98400 33445', city: 'Chennai', specialty: 'Dermatology & General Medicine', status: 'approved' },
  ];

  for (const l of listings) {
    const [existing] = await db.select().from(clinicListings).where(eq(clinicListings.email, l.email)).limit(1);
    if (!existing) {
      await db.insert(clinicListings).values(l);
    }
  }

  console.log('✅ Successfully populated complete Indian Healthcare Database across all tables!');
}

seedIndianHealthcareData();
