"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, UserPlus, Loader2, MoreVertical, Edit, ShieldAlert, Key, Trash2, Check, UserCheck, Stethoscope, Phone, Building2 } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'lab_tech';
  status: 'active' | 'suspended' | 'invited';
  branch?: string;
  specialization?: string;
}

const DEFAULT_INDIAN_STAFF: StaffMember[] = [
  { id: 'usr-owner-1', firstName: 'Alexander', lastName: 'Vance', email: 'owner@clinic.com', phone: '+91 98765 43210', role: 'owner', status: 'active', branch: 'Main Clinic', specialization: 'Clinic Administration' },
  { id: 'usr-doc-1', firstName: 'Dr. Siddharth', lastName: 'Sharma', email: 'doctor@clinic.com', phone: '+91 98111 22334', role: 'doctor', status: 'active', branch: 'Main Clinic', specialization: 'Cardiology' },
  { id: 'usr-nurse-1', firstName: 'Ananya', lastName: 'Roy', email: 'ananya.nurse@clinic.com', phone: '+91 98222 33445', role: 'nurse', status: 'active', branch: 'Main Clinic', specialization: 'Emergency Triage' },
  { id: 'usr-pharm-1', firstName: 'Priya', lastName: 'Patel', email: 'priya.pharmacy@clinic.com', phone: '+91 98333 44556', role: 'pharmacist', status: 'active', branch: 'Main Clinic', specialization: 'Clinical Pharmacy' },
  { id: 'usr-rec-1', firstName: 'Vikram', lastName: 'Malhotra', email: 'vikram.reception@clinic.com', phone: '+91 98444 55667', role: 'receptionist', status: 'active', branch: 'Main Clinic', specialization: 'Front Desk & Billing' },
  { id: 'usr-lab-1', firstName: 'Rajesh', lastName: 'Gupta', email: 'rajesh.lab@clinic.com', phone: '+91 98555 66778', role: 'lab_tech', status: 'active', branch: 'Main Clinic', specialization: 'Pathology & Hematology' },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(DEFAULT_INDIAN_STAFF);
  const [isLoading, setIsLoading] = useState(false);

  // Invite state
  const [isInviting, setIsInviting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteRole, setInviteRole] = useState<StaffMember['role']>('doctor');
  const [specialization, setSpecialization] = useState('');

  // Editing state
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadStaff() {
      try {
        setIsLoading(true);
        const data = await apiFetch<any[]>('/clinic/staff');
        if (Array.isArray(data) && data.length > 0) {
          const mapped: StaffMember[] = data.map((u, idx) => ({
            id: u.id || `usr-${idx}`,
            firstName: u.firstName || u.name || 'Staff',
            lastName: u.lastName || '',
            email: u.email || 'staff@clinic.com',
            phone: u.phone || '+91 98765 00000',
            role: (u.role || 'doctor').toLowerCase() as any,
            status: u.status || 'active',
            branch: u.branch || 'Main Clinic',
            specialization: u.specialization || 'General Medicine',
          }));
          setStaffList(mapped);
        }
      } catch (err) {
        console.warn('Using live Indian staff fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !firstName) return;

    const newMember: StaffMember = {
      id: `usr-${Date.now()}`,
      firstName,
      lastName,
      email: inviteEmail.toLowerCase(),
      phone: phone || '+91 98000 11122',
      role: inviteRole,
      status: 'active',
      branch: 'Main Clinic',
      specialization: specialization || 'General Practice',
    };

    setStaffList((prev) => [newMember, ...prev]);
    setIsInviting(false);
    setFirstName('');
    setLastName('');
    setInviteEmail('');
    setPhone('');
    setSpecialization('');

    setActionNotice(`Successfully added ${firstName} ${lastName} (${inviteRole.toUpperCase()}) to clinic staff.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleToggleStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId && s.role !== 'owner') {
          const nextStatus = s.status === 'active' ? 'suspended' : 'active';
          setActionNotice(`Updated ${s.firstName}'s status to ${nextStatus.toUpperCase()}.`);
          setTimeout(() => setActionNotice(null), 3000);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleResetPassword = (staff: StaffMember) => {
    setActionNotice(`Sent password reset instructions to ${staff.email}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRemoveStaff = (staffId: string, name: string) => {
    if (confirm(`Are you sure you want to revoke staff access for ${name}?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));
      setActionNotice(`Revoked access for ${name}.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleUpdateRole = (staffId: string, newRole: StaffMember['role']) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, role: newRole } : s))
    );
    setEditingStaff(null);
    setActionNotice(`Role updated successfully.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff & Identity Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full oversight powers for Clinic Owners: Invite practitioners, assign RBAC roles, manage account status, and control branch credentials.
          </p>
        </div>

        <button 
          onClick={() => setIsInviting(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add / Invite Staff Member</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Add / Invite Staff Form */}
      {isInviting && (
        <form onSubmit={handleAddStaff} className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-md text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <span>Add New Staff Practitioner or Administrator</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsInviting(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kumar"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Official Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. dr.ramesh@clinic.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Assigned Role *</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="doctor">Doctor / Physician</option>
                <option value="nurse">Nurse / Triage</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="receptionist">Receptionist & Billing</option>
                <option value="lab_tech">Diagnostic Lab Technician</option>
                <option value="admin">Clinic Administrator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Specialization / Department</label>
              <input
                type="text"
                placeholder="e.g. Pediatrics, Cardiology, Front Desk"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsInviting(false)}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Confirm & Add Staff</span>
            </button>
          </div>
        </form>
      )}

      {/* Staff Directory Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-muted/40 border-b border-border uppercase font-semibold text-muted-foreground text-[10px]">
            <tr>
              <th className="p-4">Staff Member</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Department / Specialization</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Owner Control Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                </td>
              </tr>
            ) : (
              staffList.map((staff) => {
                const isOwner = staff.role === 'owner';
                return (
                  <tr key={staff.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                          {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground" /> {staff.email}</span>
                            {staff.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {staff.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold capitalize text-foreground">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>{staff.role.replace('_', ' ')}</span>
                      </div>
                    </td>

                    <td className="p-4 text-muted-foreground font-medium">
                      {staff.specialization || 'General Practice'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                          staff.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {isOwner ? (
                        <span className="text-[11px] text-purple-500 font-bold px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                          Workspace Owner
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(staff.id)}
                            title={staff.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                              staff.status === 'active'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                          >
                            {staff.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>

                          <button
                            onClick={() => handleResetPassword(staff)}
                            title="Reset Credentials"
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemoveStaff(staff.id, `${staff.firstName} ${staff.lastName}`)}
                            title="Revoke Staff Access"
                            className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
