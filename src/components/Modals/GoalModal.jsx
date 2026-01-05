import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Modal from './Modal'

export default function GoalModal({ open, mode, initialValues, tasks, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      targetDate: '',
      progress: 0,
      linkedTaskIds: [],
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      startDate: initialValues?.startDate || '',
      targetDate: initialValues?.targetDate || '',
      progress: typeof initialValues?.progress === 'number' ? initialValues.progress : 0,
      linkedTaskIds: initialValues?.linkedTaskIds || [],
    })
  }, [open, initialValues, reset])

  const progressValue = useWatch({ control, name: 'progress' })
  const progress = Number(progressValue || 0)

  function submit(values) {
    return onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      startDate: values.startDate,
      targetDate: values.targetDate,
      progress: Math.max(0, Math.min(100, Number(values.progress || 0))),
      linkedTaskIds: values.linkedTaskIds || [],
    })
  }

  const title = mode === 'edit' ? 'Edit goal' : 'Add goal'

  return (
    <Modal open={open} title={title} description="Long-term outcomes with visible progress." onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
            placeholder="e.g. Ship MVP in 30 days"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title ? (
            <div className="mt-1 text-xs text-red-600">{errors.title.message}</div>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Start date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              {...register('startDate')}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Target date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              {...register('targetDate')}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Progress ({progress}%)</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            className="mt-2 w-full"
            {...register('progress')}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Link tasks</label>
          <div className="mt-2 max-h-40 space-y-2 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
            {tasks.length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400">No tasks yet.</div>
            ) : (
              tasks.map((t) => (
                <label key={t.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={t.id}
                    {...register('linkedTaskIds')}
                  />
                  <span className="truncate">{t.title}</span>
                </label>
              ))
            )}
          </div>
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
            {mode === 'edit' ? 'Save changes' : 'Create goal'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
