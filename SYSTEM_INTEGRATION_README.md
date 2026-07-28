# Quravo Platform System Integration & Fixes Registry

This document serves as a comprehensive operational summary of the architectural fixes, database integrations, and feature syncs implemented across the **Quravo Multi-Tenant White-Label Healthcare SaaS** codebase.

---

## 🗺️ System Integration Blueprint

```mermaid
sequenceDiagram
    autonumber
    actor User as Clinic Staff
    participant FE as Next.js Web App (Port 3000/3001)
    participant BE as NestJS API Gateway (Port 4000)
    database DB as PostgreSQL (via Drizzle ORM)

    %% Session Restoration
    Note over User, DB: 1. Session Restoration & Branding Sync
    User->>FE: Refreshes Page / Accesses Route
    FE->>BE: GET /api/v1/auth/session (Cookie: quravo_access_token)
    BE->>DB: Query user details, tenant metadata, roles, & modules
    DB-->>BE: User: Aman Yadav | Tenant: Aky Main Clinic | Modules: [EMR, Pharmacy]
    BE-->>FE: Returns Session JSON Payload
    Note over FE: Populate AuthProvider, TenantProvider, PermissionProvider & FeatureFlags
    FE-->>User: Renders Custom Branding "Aky Main Clinic" + User Profile "Aman Yadav"

    %% Appointment Booking
    Note over User, DB: 2. Real-Time Dynamic Appointment Booking
    User->>FE: Clicks "New Appointment" & Submits Form
    FE->>BE: POST /api/v1/appointments (JSON Body: branchId, patientId, doctorId, startTime)
    BE->>DB: INSERT INTO appointments Table
    DB-->>BE: Returns created appointment row
    BE-->>FE: Returns 201 Created Status
    Note over FE: Invalidate dashboardKeys.all React-Query cache
    FE->>BE: GET /api/v1/appointments (startDate & endDate parameters)
    BE->>DB: SELECT joined with patients & users tables
    DB-->>BE: Returns detailed appointments (including patient & doctor names)
    BE-->>FE: Returns mapped appointments array
    FE-->>User: Updates Dashboard Schedule & Queue Widgets dynamically!
```

---

## 🛠️ Summary of Implementations & Fixes

### 1. 🔐 Robust Session Restoration & Branding Sync
* **The Issue:** Refreshing the dashboard reset client-side contexts, reverting the clinic branding to `'Apex Health Clinic'` and the staff user profile to `'Dr. Sarah Jenkins'`.
* **The Fix:**
  * Created a backend `GET /auth/session` endpoint that queries PostgreSQL `users`, `tenants`, `tenantMemberships`, `roles`, and `tenantModules` to resolve user profiles, custom subdomains, permissions, and active features.
  * Refactored [(dashboard)/layout.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/app/(dashboard)/layout.tsx) to execute a blocking session validation check on mount, updating all React providers and rendering a full-screen loading skeleton until ready.
  * Mapped custom subdomains, user initials, names, and titles dynamically in [AppHeader.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/components/layout/AppHeader.tsx).

### 2. 📅 Database-Backed Appointment Calendar & Booking
* **The Issue:** The calendar page and dashboard schedule widgets were relying on offline static mock data lists, and the booking modal did not save records to the database.
* **The Fix:**
  * Updated [TodayScheduleWidget.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/domains/dashboard/widgets/TodayScheduleWidget.tsx), [PatientQueueWidget.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/domains/dashboard/widgets/PatientQueueWidget.tsx), and [MetricCardsWidget.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/domains/dashboard/widgets/MetricCardsWidget.tsx) to retrieve metrics dynamically via `apiFetch`.
  * Refactored backend `getAppointmentsCalendar()` and `getLiveQueue()` queries in [appointment.service.ts](file:///Users/aky113114/Desktop/Quravo/apps/api/src/modules/appointment/appointment.service.ts) to perform a SQL `leftJoin` with the `patients` and `users` tables, returning readable first/last names.
  * Overhauled [NewAppointmentModal.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/components/modals/NewAppointmentModal.tsx) to query active branch IDs, active patients, and practitioner lists dynamically, then `POST` to `/appointments`.
  * Linked the "+ New Appointment" trigger to the Appointments page [appointments/page.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/app/(dashboard)/appointments/page.tsx) and invalidates cache on confirmation.

### 🩺 3. EMR SOAP Encounters Pipeline
* **The Issue:** The page crashed due to mismatched data shapes on the patients list, `/emr/encounters` endpoint did not exist on the backend, notes property names were misaligned, and finalize actions returned 404.
* **The Fix:**
  * Refactored frontend `usePatients()` query hook in [patients/hooks.ts](file:///Users/aky113114/Desktop/Quravo/apps/web/src/domains/patients/hooks.ts) to parse paginated `{ items, meta }` payloads, mapping database keys (`firstName`, `lastName`, `patientNumber`) to frontend requirements (`fullName`, `mrn`).
  * Created `GET /emr/encounters` endpoint in backend [emr.controller.ts](file:///Users/aky113114/Desktop/Quravo/apps/api/src/modules/emr/emr.controller.ts) to search encounters, joining details with the `patients` table.
  * Aligned property names in EMR query and mutation hooks in [emr/hooks.ts](file:///Users/aky113114/Desktop/Quravo/apps/web/src/domains/emr/hooks.ts): maps subjective notes (`subjective` ⇄ `subjectiveNotes`), objective notes (`objective` ⇄ `objectiveNotes`), diagnosis (`assessment` ⇄ `assessmentDiagnosis`), and treatment plan (`plan` ⇄ `treatmentPlan`).
  * Fixed finalization verb to `PUT` to match NestJS `@Put('encounters/:id/finalize')` path schema.

### 4. 🔀 Consolidating Auth Flows
* **The Issue:** The sign-up flow had a static `/signup` route placeholder and a separate `/register` path, and CORS errors blocked cookie transfer in development.
* **The Fix:**
  * Stitched the dynamic sign-up form onto the central `/signup` route [signup/page.tsx](file:///Users/aky113114/Desktop/Quravo/apps/web/src/app/(auth)/signup/page.tsx) and deleted the redundant `/register` directory.
  * Added `credentials: 'include'` configuration to [client.ts](file:///Users/aky113114/Desktop/Quravo/apps/web/src/lib/api/client.ts) to allow HTTP-only JWT cookies to pass between frontend port `3000/3001` and backend port `4000`.

---

## 🗃️ Database Seeding (Manual Diagnostics)
You can re-run custom database seeds using the diagnostic scripts in the workspace scratchpad:
* **[seed_clinic_data.js](file:///Users/aky113114/.gemini/antigravity-ide/brain/0406566a-bab5-4415-8236-aedc4e51a922/scratch/seed_clinic_data.js):** Cleans existing tables and seeds Eleanor Vance, Marcus Aurelius, Sophia Lin, David Miller, 4 appointments, 1 completed medical SOAP record, 1 invoice, and daily stats for clinic `aky-clinic`.

```bash
# Run database seed diagnostics
node /Users/aky113114/.gemini/antigravity-ide/brain/0406566a-bab5-4415-8236-aedc4e51a922/scratch/seed_clinic_data.js
```
