"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatientSelfBookingPage;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const client_1 = require("@/lib/api/client");
function todayUtc() {
    return new Date().toISOString().slice(0, 10);
}
function inferTenantSlug() {
    if (typeof window === 'undefined')
        return '';
    const parts = window.location.hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www')
        return parts[0].toLowerCase();
    return process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || '';
}
function PatientSelfBookingPage() {
    const [step, setStep] = (0, react_1.useState)(1);
    const [tenantSlug, setTenantSlug] = (0, react_1.useState)('');
    const [date, setDate] = (0, react_1.useState)(todayUtc);
    const [availability, setAvailability] = (0, react_1.useState)(null);
    const [branchId, setBranchId] = (0, react_1.useState)('');
    const [doctorId, setDoctorId] = (0, react_1.useState)('');
    const [startTime, setStartTime] = (0, react_1.useState)('');
    const [loadingAvailability, setLoadingAvailability] = (0, react_1.useState)(false);
    const [availabilityError, setAvailabilityError] = (0, react_1.useState)('');
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [submitError, setSubmitError] = (0, react_1.useState)('');
    const [confirmation, setConfirmation] = (0, react_1.useState)(null);
    const [patient, setPatient] = (0, react_1.useState)({
        firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'other', chiefComplaint: '',
    });
    (0, react_1.useEffect)(() => setTenantSlug(inferTenantSlug()), []);
    async function loadAvailability(nextBranchId = branchId) {
        if (!tenantSlug.trim() || !date)
            return;
        setLoadingAvailability(true);
        setAvailabilityError('');
        setStartTime('');
        try {
            const result = await (0, client_1.apiFetch)('/platform/patient/booking/availability', {
                method: 'POST',
                body: JSON.stringify({ tenantSlug: tenantSlug.trim(), branchId: nextBranchId || undefined, date }),
            });
            setAvailability(result);
            const resolvedBranchId = nextBranchId || result.branches[0]?.id || '';
            setBranchId(resolvedBranchId);
            setDoctorId((current) => result.doctors.some((doctor) => doctor.id === current) ? current : result.doctors[0]?.id || '');
        }
        catch (error) {
            setAvailability(null);
            setBranchId('');
            setDoctorId('');
            setAvailabilityError(error instanceof Error ? error.message : 'Unable to load appointment availability.');
        }
        finally {
            setLoadingAvailability(false);
        }
    }
    (0, react_1.useEffect)(() => {
        if (tenantSlug.trim() && date)
            void loadAvailability();
        // Loading is intentionally driven by the date and resolved tenant rather than every form change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenantSlug, date]);
    const selectedDoctor = availability?.doctors.find((doctor) => doctor.id === doctorId);
    const selectedBranch = availability?.branches.find((branch) => branch.id === branchId);
    const slots = (0, react_1.useMemo)(() => availability?.slots.filter((slot) => slot.doctorId === doctorId && slot.branchId === branchId) ?? [], [availability, doctorId, branchId]);
    function moveToSlotStep() {
        if (!doctorId) {
            setAvailabilityError('Choose a doctor before continuing.');
            return;
        }
        setStep(2);
    }
    async function submitBooking(event) {
        event.preventDefault();
        if (!startTime || !branchId || !doctorId) {
            setSubmitError('Choose an available appointment slot first.');
            setStep(2);
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const result = await (0, client_1.apiFetch)('/platform/patient/booking', {
                method: 'POST',
                body: JSON.stringify({ tenantSlug: tenantSlug.trim(), branchId, doctorId, startTime, ...patient }),
            });
            setConfirmation(result);
            setStep(4);
        }
        catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Unable to schedule this appointment.');
        }
        finally {
            setSubmitting(false);
        }
    }
    function resetBooking() {
        setStep(1);
        setStartTime('');
        setConfirmation(null);
        setSubmitError('');
        setPatient({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'other', chiefComplaint: '' });
        void loadAvailability();
    }
    return (<div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-xs shadow-sm">
        {['Doctor', 'Time', 'Your details', 'Confirmation'].map((label, index) => {
            const number = (index + 1);
            return <div key={label} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold ${step === number ? 'bg-primary text-primary-foreground' : step > number ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{step > number ? '✓' : number}</span>
            <span className="hidden font-semibold text-muted-foreground sm:inline">{label}</span>
          </div>;
        })}
      </div>

      {step === 1 && <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div><h1 className="text-xl font-bold text-foreground">Book an appointment</h1><p className="mt-1 text-xs text-muted-foreground">Choose a doctor and consultation type.</p></div>
        {!inferTenantSlug() && !process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG && <div className="space-y-1 text-xs"><label className="font-semibold">Clinic slug</label><input value={tenantSlug} onChange={(event) => setTenantSlug(event.target.value)} placeholder="your-clinic" className="w-full rounded-xl border border-border bg-muted/30 p-3"/><p className="text-muted-foreground">Enter the slug for the clinic you want to book with.</p></div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 text-xs"><label className="font-semibold">Appointment date</label><input type="date" min={todayUtc()} value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-border bg-muted/30 p-3"/></div>
          <div className="space-y-1 text-xs"><label className="font-semibold">Clinic branch</label><select value={branchId} onChange={(event) => { setBranchId(event.target.value); void loadAvailability(event.target.value); }} disabled={loadingAvailability || !availability} className="w-full rounded-xl border border-border bg-muted/30 p-3"><option value="">Select a branch</option>{availability?.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
        </div>
        {loadingAvailability && <p className="flex items-center gap-2 text-xs text-muted-foreground"><lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> Loading availability…</p>}
        {availabilityError && <p className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive"><lucide_react_1.AlertCircle className="h-4 w-4"/>{availabilityError}</p>}
        {!loadingAvailability && availability && availability.doctors.length === 0 && <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">No doctors are currently available for online booking at this clinic.</p>}
        <div className="space-y-3"><label className="text-xs font-bold uppercase tracking-wider text-primary">Doctor</label><div className="grid gap-3 sm:grid-cols-2">{availability?.doctors.map((doctor) => <button type="button" key={doctor.id} onClick={() => { setDoctorId(doctor.id); setStartTime(''); }} className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${doctorId === doctor.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/40'}`}>{doctor.name}</button>)}</div></div>
        <div className="space-y-1 text-xs"><label className="font-semibold">Consultation type</label><select disabled className="w-full rounded-xl border border-border bg-muted/30 p-3"><option>General consultation</option></select></div>
        <div className="flex justify-end"><button type="button" onClick={moveToSlotStep} disabled={!doctorId} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">Choose a time <lucide_react_1.ChevronRight className="h-4 w-4"/></button></div>
      </section>}

      {step === 2 && <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div><h2 className="text-xl font-bold">Choose an available time</h2><p className="mt-1 text-xs text-muted-foreground">{selectedDoctor?.name} at {selectedBranch?.name} on {date}.</p></div>
        {loadingAvailability && <p className="flex items-center gap-2 text-xs text-muted-foreground"><lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> Refreshing availability…</p>}
        {availabilityError && <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{availabilityError}</p>}
        {!loadingAvailability && !availabilityError && slots.length === 0 && <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">No available slots for this doctor on the selected date. Choose another doctor, branch, or date.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{slots.map((slot) => <button type="button" key={slot.startTime} onClick={() => setStartTime(slot.startTime)} className={`rounded-xl border px-4 py-3 text-xs font-bold ${startTime === slot.startTime ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}>{slot.label}</button>)}</div>
        <div className="flex justify-between"><button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold"><lucide_react_1.ArrowLeft className="h-4 w-4"/> Back</button><button type="button" disabled={!startTime} onClick={() => setStep(3)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">Your details <lucide_react_1.ChevronRight className="h-4 w-4"/></button></div>
      </section>}

      {step === 3 && <form onSubmit={submitBooking} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div><h2 className="text-xl font-bold">Your details</h2><p className="mt-1 text-xs text-muted-foreground">Your appointment will be scheduled immediately once confirmed.</p></div>
        {submitError && <p className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive"><lucide_react_1.AlertCircle className="h-4 w-4"/>{submitError}</p>}
        <div className="grid gap-4 text-xs sm:grid-cols-2">
          {[['firstName', 'First name', 'text'], ['lastName', 'Last name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel'], ['dateOfBirth', 'Date of birth', 'date']].map(([field, label, type]) => <div className="space-y-1" key={field}><label className="font-semibold">{label} *</label><input required type={type} max={field === 'dateOfBirth' ? todayUtc() : undefined} value={patient[field]} onChange={(event) => setPatient((current) => ({ ...current, [field]: event.target.value }))} className="w-full rounded-xl border border-border bg-muted/30 p-3"/></div>)}
          <div className="space-y-1"><label className="font-semibold">Gender *</label><select required value={patient.gender} onChange={(event) => setPatient((current) => ({ ...current, gender: event.target.value }))} className="w-full rounded-xl border border-border bg-muted/30 p-3"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
        </div>
        <div className="space-y-1 text-xs"><label className="font-semibold">Reason for visit / symptoms (optional)</label><textarea rows={3} value={patient.chiefComplaint} onChange={(event) => setPatient((current) => ({ ...current, chiefComplaint: event.target.value }))} className="w-full rounded-xl border border-border bg-muted/30 p-3"/></div>
        <div className="flex justify-between"><button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold"><lucide_react_1.ArrowLeft className="h-4 w-4"/> Back</button><button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">{submitting && <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>} Schedule appointment</button></div>
      </form>}

      {step === 4 && confirmation && <section className="space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-xl"><lucide_react_1.CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500"/><div><h2 className="text-2xl font-bold">Appointment confirmed</h2><p className="mt-1 text-xs text-muted-foreground">Your appointment has been scheduled.</p></div><div className="mx-auto max-w-md space-y-3 rounded-xl border border-border bg-muted/20 p-5 text-left text-xs"><div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Confirmation</span><strong className="font-mono text-primary">{confirmation.appointmentNumber}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><strong>{confirmation.doctorName}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Branch</span><strong>{confirmation.branchName}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Time</span><strong>{new Date(confirmation.startTime).toLocaleString()}</strong></div></div><button type="button" onClick={resetBooking} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground">Book another appointment</button></section>}
    </div>);
}
