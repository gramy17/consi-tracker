import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from './Modal'

export default function HabitModal({ open, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (!open) return
    reset({ name: '' })
  }, [open, reset])

  function submit(values) {
    return onSubmit({ name: values.name.trim() })
  }

  return (
    <Modal
      open={open}
      title="Add habit"
      description="Binary daily habits: done / not done."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
            placeholder="e.g. Read 20 minutes"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name ? (
            <div className="mt-1 text-xs text-red-600">{errors.name.message}</div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            Create habit
          </button>
        </div>
      </form>
    </Modal>
  )
}
