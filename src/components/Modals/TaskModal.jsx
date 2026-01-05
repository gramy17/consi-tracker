import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from './Modal'

export default function TaskModal({ open, mode, initialValues, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: '',
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      priority: initialValues?.priority || 'medium',
      dueDate: initialValues?.dueDate || '',
      tags: (initialValues?.tags || []).join(', '),
    })
  }, [open, initialValues, reset])

  function submit(values) {
    const tags = values.tags
      ? values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    return onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate,
      tags,
    })
  }

  const title = mode === 'edit' ? 'Edit task' : 'Add task'

  return (
    <Modal open={open} title={title} description="Tasks are actionable, time-bound items." onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
            placeholder="Write a clear task title"
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
            placeholder="Optional details"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Due date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              {...register('dueDate')}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Tags</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
            placeholder="Comma-separated (e.g. work, deep-focus)"
            {...register('tags')}
          />
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
            {mode === 'edit' ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
