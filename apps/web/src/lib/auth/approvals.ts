export interface StaffApprovalRequest {
  id: string;
  fullName: string;
  email: string;
  role: string;
  clinicId: string;
  clinicName: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface TenantApprovalRequest {
  id: string;
  ownerName: string;
  email: string;
  clinicName: string;
  subdomain: string;
  plan: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const initialStaffRequests: StaffApprovalRequest[] = [
  { id: 'req-1', fullName: 'Dr. Gregory House', email: 'house@clinic.com', role: 'Doctor / Physician', clinicId: 'c-1', clinicName: 'Apex Health Clinic', requestedAt: '2026-07-29 10:15', status: 'Pending' },
  { id: 'req-2', fullName: 'Nurse Joy', email: 'joy@clinic.com', role: 'Nurse / Triage Head', clinicId: 'c-1', clinicName: 'Apex Health Clinic', requestedAt: '2026-07-29 11:30', status: 'Pending' },
];

export const initialTenantRequests: TenantApprovalRequest[] = [
  { id: 'treq-1', ownerName: 'Dr. John Watson', email: 'watson@bakerhealth.com', clinicName: 'Baker Street Medical Center', subdomain: 'bakerhealth', plan: 'Growth', requestedAt: '2026-07-29 09:00', status: 'Pending' },
  { id: 'treq-2', ownerName: 'Dr. Meredith Grey', email: 'grey@seattlemed.com', clinicName: 'Seattle Grace Hospital Chain', subdomain: 'seattlemed', plan: 'ERP Enterprise', requestedAt: '2026-07-29 12:45', status: 'Pending' },
];
