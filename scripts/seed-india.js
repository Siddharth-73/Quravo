const postgres = require('./node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const argon2 = require('./node_modules/.pnpm/@node-rs+argon2@2.0.0/node_modules/@node-rs/argon2');

async function seedDatabase() {
  console.log('🌱 Connecting to PostgreSQL to seed Indian Healthcare data...');
  const sql = postgres('postgresql://quravo:quravo_secret@localhost:5433/quravo_db');

  try {
    const passwordHash = await argon2.hash('Quravo@123!');

    // 1. Seed Super Admin & Users
    const usersList = [
      { email: 'sharmasiddharth7373@gmail.com', first_name: 'Siddharth', last_name: 'Sharma', phone: '+91 98100 12345', status: 'active', is_email_verified: true },
      { email: 'patient@clinic.com', first_name: 'Rahul', last_name: 'Verma', phone: '+91 98200 67890', status: 'active', is_email_verified: true },
      { email: 'dr.sharma@apollo.in', first_name: 'Dr. Siddharth', last_name: 'Sharma', phone: '+91 98110 55443', status: 'active', is_email_verified: true },
      { email: 'dr.iyer@fortis.in', first_name: 'Dr. Ananya', last_name: 'Iyer', phone: '+91 98220 66778', status: 'active', is_email_verified: true },
      { email: 'dr.kumar@max.in', first_name: 'Dr. Rajesh', last_name: 'Kumar', phone: '+91 98330 77889', status: 'active', is_email_verified: true },
      { email: 'dr.nair@manipal.in', first_name: 'Dr. Priya', last_name: 'Nair', phone: '+91 98440 88990', status: 'active', is_email_verified: true },
    ];

    for (const u of usersList) {
      await sql`
        INSERT INTO users (email, password_hash, first_name, last_name, phone, status, is_email_verified)
        VALUES (${u.email}, ${passwordHash}, ${u.first_name}, ${u.last_name}, ${u.phone}, ${u.status}, ${u.is_email_verified})
        ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash};
      `;
    }
    console.log('✓ Seeded 6 Users (including sharmasiddharth7373@gmail.com & patient@clinic.com with password Quravo@123!)');

    // 2. Seed 6 Indian Tenants / Hospitals
    const tenantsList = [
      { name: 'Apollo Hospitals, New Delhi', slug: 'apollo-delhi', tenant_type: 'hospital', plan_tier: 'enterprise', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Fortis Healthcare, Mumbai', slug: 'fortis-mumbai', tenant_type: 'hospital', plan_tier: 'professional', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Max Super Specialty, Bengaluru', slug: 'max-bengaluru', tenant_type: 'hospital', plan_tier: 'enterprise', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Manipal Hospital, Hyderabad', slug: 'manipal-hyderabad', tenant_type: 'hospital', plan_tier: 'starter', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Medanta The Medicity, Gurugram', slug: 'medanta-gurugram', tenant_type: 'hospital', plan_tier: 'enterprise', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
      { name: 'Narayana Health, Chennai', slug: 'narayana-chennai', tenant_type: 'hospital', plan_tier: 'starter', status: 'active', region: 'Asia-South1', timezone: 'Asia/Kolkata', country: 'India', currency: 'INR' },
    ];

    for (const t of tenantsList) {
      await sql`
        INSERT INTO tenants (name, slug, tenant_type, plan_tier, status, region, timezone, country, currency)
        VALUES (${t.name}, ${t.slug}, ${t.tenant_type}, ${t.plan_tier}, ${t.status}, ${t.region}, ${t.timezone}, ${t.country}, ${t.currency})
        ON CONFLICT (slug) DO UPDATE SET name = ${t.name}, status = ${t.status};
      `;
    }
    console.log('✓ Seeded 6 Indian Tenants in PostgreSQL');

    // 3. Seed 6 Clinic Listings
    const listings = [
      { clinic_name: 'Apollo Hospitals, New Delhi', owner_name: 'Dr. Siddharth Sharma', email: 'dr.sharma@apollo.in', phone: '+91 98110 55443', city: 'New Delhi', specialty: 'Cardiology & Multi-Specialty', status: 'approved' },
      { clinic_name: 'Fortis Healthcare, Mumbai', owner_name: 'Dr. Ananya Iyer', email: 'dr.iyer@fortis.in', phone: '+91 98220 66778', city: 'Mumbai', specialty: 'Pediatrics & Oncology', status: 'approved' },
      { clinic_name: 'Max Super Specialty, Bengaluru', owner_name: 'Dr. Rajesh Kumar', email: 'dr.kumar@max.in', phone: '+91 98330 77889', city: 'Bengaluru', specialty: 'Neurology & Orthopedics', status: 'approved' },
      { clinic_name: 'Manipal Hospital, Hyderabad', owner_name: 'Dr. Priya Nair', email: 'dr.nair@manipal.in', phone: '+91 98440 88990', city: 'Hyderabad', specialty: 'Dermatology & Gastroenterology', status: 'approved' },
      { clinic_name: 'Medanta The Medicity, Gurugram', owner_name: 'Dr. Vikramaditya Singh', email: 'vikram@medanta.org', phone: '+91 98550 11223', city: 'Gurugram', specialty: 'Cardiac Surgery & Transplant', status: 'approved' },
      { clinic_name: 'Narayana Health, Chennai', owner_name: 'Dr. Meera Deshmukh', email: 'meera@narayana.org', phone: '+91 98660 22334', city: 'Chennai', specialty: 'Gynecokinetics & General Health', status: 'approved' },
    ];

    for (const l of listings) {
      await sql`
        INSERT INTO clinic_listings (clinic_name, owner_name, email, phone, city, specialty, status)
        VALUES (${l.clinic_name}, ${l.owner_name}, ${l.email}, ${l.phone}, ${l.city}, ${l.specialty}, ${l.status})
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log('✓ Seeded 6 Clinic Listings');

    // 4. Seed Audit Logs
    const auditEvents = [
      { action: 'Tenant Created', user: 'Platform Owner', details: 'Provisioned Apollo Hospitals, New Delhi' },
      { action: 'Subscription Upgraded', user: 'Platform Admin', details: 'Upgraded Max Super Specialty to Enterprise Plan (₹35,000/mo)' },
      { action: 'Admin Logged In', user: 'sharmasiddharth7373@gmail.com', details: 'Successful Root Login from IP 192.168.1.1' },
      { action: 'Razorpay Payment Completed', user: 'Rahul Verma', details: 'Paid ₹800 INR for Dr. Siddharth Sharma Consultation' },
    ];

    for (const a of auditEvents) {
      await sql`
        INSERT INTO audit_logs (action, user_name, details)
        VALUES (${a.action}, ${a.user}, ${a.details})
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log('✓ Seeded Audit Logs');

    console.log('🚀 PostgreSQL database seeding complete!');
  } catch (err) {
    console.error('SEEDING ERROR:', err.message);
  } finally {
    await sql.end();
  }
}

seedDatabase();
