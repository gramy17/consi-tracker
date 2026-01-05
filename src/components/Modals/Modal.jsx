import { useEffect } from 'react'

export default function Modal({ open, title, description, onClose, children }) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="text-base font-semibold">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
