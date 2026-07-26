export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
          Phase 1 Foundation Operational
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Quravo Healthcare SaaS
        </h1>
        <p className="text-lg text-slate-400">
          Multi-tenant white-label platform layer built with Next.js 15, NestJS, BullMQ, and Drizzle ORM.
        </p>

        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
            <h3 className="font-medium text-slate-200">API Endpoint</h3>
            <p className="mt-1 text-xs text-sky-400 font-mono">/api/v1</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
            <h3 className="font-medium text-slate-200">Structured Logging</h3>
            <p className="mt-1 text-xs text-emerald-400 font-mono">Pino + AsyncLocalStorage</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
            <h3 className="font-medium text-slate-200">Queue Infrastructure</h3>
            <p className="mt-1 text-xs text-purple-400 font-mono">BullMQ Worker Process</p>
          </div>
        </div>
      </div>
    </main>
  );
}
