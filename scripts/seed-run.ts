import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../packages/db/src/schema';
import * as argon2 from '@node-rs/argon2';

const connectionString = process.env.DATABASE_URL || 'postgres://quravo:quravo_secret@localhost:5433/quravo_db';
console.log('Connecting to:', connectionString);

const queryClient = postgres(connectionString, { max: 1 });
const db = drizzle(queryClient, { schema });

async function seed() {
  console.log('🌱 Starting Indian Healthcare database seeding...');

  try {
    const passwordHash = await argon2.hash('Quravo@123!');

    // 1. Seed Super Admin User & Patient User
    const seedUsers = [
      { email: 'sharmasiddharth7373@gmail.com', passwordHash, firstName: 'Siddharth', lastName: 'Sharma', phone: '+91 98100 12345', status: 'active' as const, isEmailVerified: true },
      { email: 'admin@quravo.com', passwordHash, firstName: 'Platform', lastName: 'Admin', phone: '+91 98100 00000', status: 'active' as const, isEmailVerified: true },
      { email: 'patient@clinic.com', passwordHash, firstName: 'Rahul', lastName: 'Verma', phone: '+91 98200 67890', status: 'active' as const, isEmailVerified: true },
      { email: 'dr.sharma@apollo.in', passwordHash, firstName: 'Dr. Siddharth', lastName: 'Sharma', phone: '+91 98110 55443', status: 'active' as const, isEmailVerified: true },
      { email: 'dr.iyer@fortis.in', passwordHash, firstName: 'Dr. Ananya', lastName: 'Iyer', phone: '+91 98220 66778', status: 'active' as const, isEmailVerified: true },
      { email: 'dr.kumar@max.in', passwordHash, firstName: 'Dr. Rajesh', lastName: 'Kumar', phone: '+91 98330 77889', status: 'active' as const, isEmailVerified: true },
    ];

    for (const u of seedUsers) {
      await db.insert(schema.users).values(u).onConflictDoNothing();
    }
    console.log('✓ Seeded Users (Credentials: sharmasiddharth7373@gmail.com & patient@clinic.com / Quravo@123!)');

    // 2. Seed 6 Indian Hospitals / Tenants
    const indianTenants = [
      { name: 'Apollo Hospitals, New Delhi', slug: 'apollo-delhi', tenantType: 'hospital' as const, planTier: 'enterprise' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Fortis Healthcare, Mumbai', slug: 'fortis-mumbai', tenantType: 'hospital' as const, planTier: 'professional' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Max Super Specialty, Bengaluru', slug: 'max-bengaluru', tenantType: 'hospital' as const, planTier: 'enterprise' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Manipal Hospital, Hyderabad', slug: 'manipal-hyderabad', tenantType: 'hospital' as const, planTier: 'starter' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Medanta The Medicity, Gurugram', slug: 'medanta-gurugram', tenantType: 'hospital' as const, planTier: 'enterprise' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Narayana Health, Chennai', slug: 'narayana-chennai', tenantType: 'hospital' as const, planTier: 'starter' as const, status: 'active' as const, region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
    ];

    for (const t of indianTenants) {
      await db.insert(schema.tenants).values(t).onConflictDoNothing();
    }
    console.log('✓ Seeded 6 Indian Tenants / Hospitals in database');

    // 3. Seed 6 Clinic Listings
    const listings = [
      { clinicName: 'Apollo Hospitals, New Delhi', ownerName: 'Dr. Siddharth Sharma', email: 'dr.sharma@apollo.in', phone: '+91 98110 55443', city: 'New Delhi', specialty: 'Cardiology & Multi-Specialty', status: 'approved' },
      { clinicName: 'Fortis Healthcare, Mumbai', ownerName: 'Dr. Ananya Iyer', email: 'dr.iyer@fortis.in', phone: '+91 98220 66778', city: 'Mumbai', specialty: 'Pediatrics & Oncology', status: 'approved' },
      { clinicName: 'Max Super Specialty, Bengaluru', ownerName: 'Dr. Rajesh Kumar', email: 'dr.kumar@max.in', phone: '+91 98330 77889', city: 'Bengaluru', specialty: 'Neurology & Orthopedics', status: 'approved' },
      { clinicName: 'Manipal Hospital, Hyderabad', ownerName: 'Dr. Priya Nair', email: 'dr.nair@manipal.in', phone: '+91 98440 88990', city: 'Hyderabad', specialty: 'Dermatology & Gastroenterology', status: 'approved' },
      { clinicName: 'Medanta The Medicity, Gurugram', ownerName: 'Dr. Vikramaditya Singh', email: 'vikram@medanta.org', phone: '+91 98550 11223', city: 'Gurugram', specialty: 'Cardiac Surgery & Transplant', status: 'approved' },
      { clinicName: 'Narayana Health, Chennai', ownerName: 'Dr. Meera Deshmukh', email: 'meera@narayana.org', phone: '+91 98660 22334', city: 'Chennai', specialty: 'Gynecokinetics & General Health', status: 'approved' },
    ];

    for (const l of listings) {
      await db.insert(schema.clinicListings).values(l).onConflictDoNothing();
    }
    console.log('✓ Seeded 6 Clinic Listings in database');

    // 4. Seed Audit Logs
    const auditLogs = [
      { action: 'Tenant Created', user: 'Platform Owner', details: 'Provisioned Apollo Hospitals, New Delhi' },
      { action: 'Subscription Upgraded', user: 'Platform Admin', details: 'Upgraded Max Super Specialty to Enterprise Plan (₹35,000 INR/mo)' },
      { action: 'Admin Logged In', user: 'sharmasiddharth7373@gmail.com', details: 'Root Platform Login' },
      { action: 'Razorpay Payment Completed', user: 'Rahul Verma', details: 'Paid ₹800 INR for Dr. Siddharth Sharma Consultation' },
    ];

    for (const a of auditLogs) {
      await db.insert(schema.auditLogs).values(a).onConflictDoNothing();
    }
    console.log('✓ Seeded Audit Logs in database');

    console.log('🎉 DB Seeding completed successfully!');
  } catch (err: any) {
    console.error('SEEDING ERROR:', err.message);
  } finally {
    await queryClient.end();
  }
}

seed();
