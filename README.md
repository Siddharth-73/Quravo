# Quravo: Multi-Tenant White-Label Healthcare SaaS (EMR & ERP)

Quravo is a high-performance, enterprise-grade, multi-tenant white-label EMR (Electronic Medical Records) and clinic operations ERP platform. It is designed to host multiple clinics (tenants) securely on a single database using logical tenant isolation, dynamic role-based access control (RBAC), and plan-tier feature toggling.

---

## 🏢 Platform Architecture & Monorepo Structure

Quravo is built as a TypeScript monorepo managed with **Turborepo** and **pnpm**. Below is the directory breakdown and folder-by-folder responsibility:

```
Quravo (Monorepo Root)
├── apps
│   ├── api (NestJS Backend)
│   └── web (Next.js Frontend)
└── packages
    ├── common (Shared Logic, RBAC Evaluation, Core Events)
    ├── config (TypeScript, ESLint, and Build Configs)
    ├── contracts (AI Prompts & Integration Schemas)
    └── db (Drizzle ORM Schemas, Migrations, Seeds & Client)
```

### Folder-wise Responsibilities

#### 📂 `apps/api` (NestJS Backend Service)
Responsible for database transactions, real-time messaging, asynchronous background queues, and access security validation:
*   `src/modules/auth`: Manages JWT session issuing, multi-factor token validation, and password resets.
*   `src/modules/rbac`: Sets up clinic-specific RBAC roles and maps dynamic permission arrays.
*   `src/modules/patient`: Manages Electronic Health Records (EHR), care history timelines, and attachment uploads.
*   `src/modules/appointment`: Implements doctor calendars, scheduling conflicts, patient waiting list queues, and walk-in tokens.
*   `src/modules/emr`: Processes clinical SOAP encounters, diagnosis notes, and patient charts.
*   `src/modules/billing`: Drives POS checkouts, invoices, payments, refunds, and pricing.
*   `src/modules/realtime`: Powers low-latency WebSocket communication (via Socket.IO) to push updates (e.g. queue state, check-ins) to frontend client dashboards in real-time.
*   `src/modules/analytics`: Compiles aggregated revenue statistics, patient growth charts, and queue timings.
*   `src/queue/`: Utilizes BullMQ/Redis worker engines to handle background tasks like onboarding notifications, trial triggers, and scheduled reports.
*   `src/common/middleware`: Hosts request-tracing and tenant-parsing handlers.
*   `src/common/guards`: Enforces rate-limiting (`ThrottlerGuard`), feature-flag gates (`FeatureFlagGuard`), module-access restrictions (`ModuleGuard`), and user-permissions (`PermissionsGuard`).

#### 📂 `apps/web` (Next.js Frontend Portal)
Modern, high-performance web interface built with React 19, TailwindCSS, and TanStack React Query:
*   `src/app/(auth)`: Fully integrated, secure workspaces for user registration, multi-tenant logins, and password resets.
*   `src/app/(dashboard)`: Dashboard views. Includes the **Clinical Command Center**, Appointment Calendar, Patient Records, Billing POS, Pharmacy tracking, and Clinic Settings panels.
*   `src/app/(dashboard)/dashboards`: Role-specific view components catering to different personas (Doctors, Nurses, Receptionists, and Pharmacists).
*   `src/app/(public)`: Dynamic white-labeled booking portal where patients can view practitioner availability and book visits online.
*   `src/app/(super-admin)`: Platform Super-Admin console to monitor subscriptions, manage tenants, configure plan features, and audit global platform health.
*   `src/providers`: Application context providers for feature flags, active tenant states, socket triggers, and auth permissions.

#### 📂 `packages/db` (Database Infrastructure Layer)
The central data mapping layer using **Drizzle ORM**:
*   `src/schema/`: Modularized database tables (e.g., `tenants.ts`, `patients.ts`, `appointments.ts`, `emr-encounters.ts`). Every tenant-centric table utilizes a logical `tenantId` foreign key.
*   `src/client.ts`: Configures connections to the PostgreSQL cluster using pooled instances.

#### 📂 `packages/common` (Shared Domain Code)
*   `src/rbac/permissions.ts`: Houses RBAC matching function (`hasPermission`) supporting global (`*`) and resource-level (`patients:*`) wildcards.
*   `src/rbac/modules.ts`: Maps available modules per subscription plan tier (`starter`, `growth`, `erp`).
*   `src/context/request-context.ts`: Instantiates Node.js `AsyncLocalStorage` (`RequestContext`) to propagate transactional IDs and active tenant contexts down the call thread.
*   `src/events/`: Declarations for domain event messaging (e.g. `TenantCreatedEvent`, `AppointmentScheduledEvent`).

#### 📂 `packages/contracts` (AI Prompts & Structured Schemas)
*   `src/prompts/`: Standardized prompts for LLMs (e.g., Gemini) to generate structured SOAP notes, clinical encounter summaries, and patient history overviews.

---

## 🔒 Multi-Tenant Isolation & Request Flow

Quravo isolates customer clinics securely using a **Shared Database, Logical Isolation** model. All HTTP calls resolve tenant parameters in real-time.

### Tenant Resolution Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant Gateway as Next.js Router
    participant Resolver as TenantResolverMiddleware (NestJS)
    participant Context as AsyncLocalStorage (RequestContext)
    participant Cache as Redis (Tenant Cache)
    participant DB as PostgreSQL (Drizzle)

    User->>Gateway: Request http://aky-clinic.localhost:3000/api/v1/patients
    Gateway->>Resolver: Resolve Domain Subdomain (aky-clinic)
    
    alt Subdomain Present
        Resolver->>DB: Query tenant where slug = 'aky-clinic'
    else Subdomain Absent (Fallback Header)
        Resolver->>Resolver: Parse X-Tenant-Slug / X-Tenant-Id headers
    end

    DB-->>Resolver: Tenant Metadata (ID: 40cba3e7...)
    Resolver->>Context: RequestContext.setTenantId('40cba3e7...')
    Note over Context: Tenant ID bound to current execution thread

    Resolver->>Cache: Fetch Role Permissions (tenant:40cba3e7:role:doctor)
    Cache-->>Resolver: Permissions Granted: [patients:*, emr:*]
    
    Resolver->>Resolver: Verify permissions for requested action
    
    Resolver->>DB: Query patients WHERE tenant_id = '40cba3e7...'
    DB-->>User: Isolated Tenant Data Response
```

### 1. Host Domain / Subdomain Parsing
When a user accesses `http://aky-clinic.localhost:3000/dashboard`, the system extracts `aky-clinic` from the URL host. If it's a direct API request, it optionally falls back to reading `x-tenant-slug` or `x-tenant-id` custom request headers.

### 2. NestJS Context Injection Middleware
*   **`CorrelationContextMiddleware`**: Spawns a unique request trace ID (`x-request-id`) and instantiates `AsyncLocalStorage.run(...)` to bind the thread execution context.
*   **`TenantResolverMiddleware`**: Pulls the parsed slug, verifies the tenant's status in PostgreSQL (preventing blocked or suspended tenants from accessing resources), and injects it into the request store using `RequestContext.setTenantId(tenantId)`.

### 3. Application-Level Logical Queries
Downstream modules (schedules, prescriptions, invoices) fetch the active `tenantId` dynamically to build SQL query boundaries:
```typescript
const items = await db.select().from(patients).where(eq(patients.tenantId, tenantId));
```
Every query automatically restricts results to the active tenant's context, preventing any horizontal cross-tenant data leakage.

---

## 👥 The 8 Granular Roles (RBAC Matrix)

Every clinic workspace seeds **8 distinct roles** upon creation. Below is their design purpose, permission sets, and operational capabilities:

| Role Name | Scope & Design Purpose | Permissions (DB Structure) | Primary Operational Actions |
| :--- | :--- | :--- | :--- |
| **Owner** | Clinic founder / Tenant administrator. Full system authority. | `['*']` | RBAC modification, invite staff, manage plans/subscriptions, setup billing configurations, branding. |
| **Admin** | Clinic director / Operations supervisor. Drives office workflows. | `['users:read', 'users:write', 'appointments:*', 'patients:*']` | Schedule management, patient registration, audit-log tracking, user profiles (cannot view clinical SOAP details). |
| **Doctor** | Credentialed clinical physician. Core caregiver. | `['appointments:*', 'patients:*', 'emr:*', 'prescriptions:*']` | Diagnose patients, write clinical SOAP encounter notes, prescribe medications, request lab tests. |
| **Nurse** | Certified practitioner. Assists doctor. | `['patients:read', 'appointments:read', 'vitals:write']` | Triage incoming patients, record core vitals, review medical records, prepare waiting queues. |
| **Receptionist** | Front desk coordinator. Manages initial check-ins. | `['appointments:*', 'patients:read', 'patients:write']` | Book/reschedule appointments, register new patients, check patients into the waiting room. |
| **Accountant** | Financial controller. Manages clinic billing. | `['billing:*', 'reports:read']` | Invoice generation, checkout payments, trigger refunds, read financial summaries. |
| **Staff** | Support personnel (Facilities / Assist staff). | `['appointments:read']` | View basic calendar layouts to manage logistics, rooms, or shifts. |
| **Patient** | Consumer access. The client portals. | `['portal:*']` | View personal medical histories, pay bills online, schedule virtual visits. |

### Role Permissions Flow

```mermaid
graph TD
    A[Incoming Request] --> B{Role of User?}
    B -->|Owner| C[Allow Everything - Wildcard Bypass]
    B -->|Admin| D[Allow Operations - Schedules, Registrations, Directory]
    B -->|Doctor| E[Allow Medical - Diagnoses, Notes, SOAP, Rx]
    B -->|Nurse| F[Allow Vitals - Read EMR, Record Vitals]
    B -->|Receptionist| G[Allow Desk - Check-ins, Bookings, Patient Entry]
    B -->|Accountant| H[Allow Financials - POS, Invoicing, Refunds]
    
    C --> I[Postgres Transaction]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
```

---

## 🛠️ Step-by-Step Patient Checkout Lifecycle

Here is how billing, appointments, and EMR records link together dynamically when a patient gets checked out by the **Accountant** or **Owner**:

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Patient books Appointment
    Scheduled --> CheckedIn: Receptionist registers intake
    CheckedIn --> InTriage: Nurse logs vital stats
    InTriage --> InConsultation: Doctor starts SOAP note
    InConsultation --> ConsultationComplete: SOAP note signed & Rx issued
    ConsultationComplete --> POSCheckout: Billing item generated automatically
    POSCheckout --> InvoicePaid: Accountant processes payment
    InvoicePaid --> [*]
```

### Flow Breakdown
1.  **Check-In**: Receptionist marks patient as `checked_in`. The patient moves into the **Live Waiting Room Queue** in real-time.
2.  **Encounter Creation**: The doctor opens a **SOAP Encounter** (`emr-encounters.ts`). The status updates to `in_progress`.
3.  **Prescription & SOAP Submission**: The doctor records symptoms (Subjective, Objective, Assessment, Plan), logs diagnoses, issues prescriptions, and submits. The appointment is updated to `completed`.
4.  **Auto-Billing Generation**: When the encounter completes, NestJS event listeners automatically generate a draft **Invoice** (`invoices.ts`) containing the line items (e.g. Consultation Fee: \$100.00, Prescribed Amoxicillin: \$20.00).
5.  **Payment Checkout**: The patient goes to the billing desk. The Accountant accesses `/billing`, opens the pending invoice, inputs credit/cash payment, and triggers `POST /billing/checkout`.
6.  **Real-Time Dashboard Updates**: The payment updates the tenant's daily revenue cache on Redis. Socket.IO pushes a broadcast to update the owner's dashboard metrics instantly.

---

## 🚀 Setting Up the Local Monorepo

Follow these commands to configure the database, start Redis, and launch the developer tools:

### Prerequisite Environment Config
Create a `.env` file in the root folder using `.env.example` as a guide:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quravo
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_signing_key_secret_here
PORT=4000
```

### Commands

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Spin up backing services (PostgreSQL & Redis)**:
    ```bash
    docker-compose up -d
    ```

3.  **Run Database Migrations**:
    ```bash
    pnpm --filter @quravo/db db:migrate
    ```

4.  **Seed Default System Tenants & Roles**:
    ```bash
    pnpm --filter @quravo/db db:seed
    ```

5.  **Start Dev Servers (API + Web Frontend)**:
    ```bash
    pnpm dev
    ```

6.  **Open Database Studio**:
    To visually inspect tables, runs:
    ```bash
    pnpm --filter @quravo/db db:studio
    ```
