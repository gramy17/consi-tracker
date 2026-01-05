export default function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {helper ? (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </div>
      ) : null}
    </div>
  )
}
