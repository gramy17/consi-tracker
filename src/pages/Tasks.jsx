import React, { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, Check, Circle, Clock } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";

const Tasks = () => {
  const { tasks, loading, createTask, editTask, removeTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    tag: "All",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due: "",
    tag: "Planning",
    priority: "Medium",
    status: "Pending",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await editTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await removeTask(taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await editTask(task.id, { ...task, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      due: task.due || "",
      tag: task.tag || "Planning",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      due: "",
      tag: "Planning",
      priority: "Medium",
      status: "Pending",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status !== "All" && task.status !== filters.status) return false;
      if (filters.priority !== "All" && task.priority !== filters.priority) return false;
      if (filters.tag !== "All" && task.tag !== filters.tag) return false;
      return true;
    });
  }, [tasks, filters]);

  const uniqueTags = useMemo(() => {
    const tags = new Set(tasks.map((t) => t.tag).filter(Boolean));
    return ["All", ...Array.from(tags)];
  }, [tasks]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h1 className="text-lg font-semibold">Tasks</h1>
            <p className="text-xs text-white/60">Plan, prioritize, and ship consistently.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white transition"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>

        <div className="grid gap-4 border-t border-white/10 p-5 md:grid-cols-3">
          <div>
            <label className="text-xs text-white/60">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80"
            >
              {["All", "Pending", "In progress", "Done"].map((option) => (
                <option key={option} value={option} className="bg-slate-800">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80"
            >
              {["All", "High", "Medium", "Low"].map((option) => (
                <option key={option} value={option} className="bg-slate-800">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">Tag</label>
            <select
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80"
            >
              {uniqueTags.map((option) => (
                <option key={option} value={option} className="bg-slate-800">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-10 text-center">
          <p className="text-white/60 mb-4">No tasks yet. Start planning your work!</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition"
          >
            <Plus className="w-4 h-4" />
            Create your first task
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-10 text-center">
          <p className="text-white/60">No tasks match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${task.status === "Done" ? "text-white/60 line-through" : "text-white"}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-1 text-xs text-white/50">{task.description}</p>
                  )}
                  <p className="mt-1 text-xs text-white/60">
                    {task.due ? `Due: ${task.due}` : "No due date"}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  {task.tag || "General"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.status === "Done"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : task.status === "In progress"
                        ? "bg-indigo-400/15 text-indigo-200"
                        : "bg-amber-400/15 text-amber-200"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      task.priority === "High"
                        ? "bg-red-400/15 text-red-200"
                        : task.priority === "Low"
                        ? "bg-slate-400/15 text-slate-300"
                        : "bg-yellow-400/15 text-yellow-200"
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {task.status !== "Done" && (
                    <>
                      {task.status === "Pending" && (
                        <button
                          onClick={() => handleStatusChange(task, "In progress")}
                          className="p-1.5 rounded-md text-white/40 hover:text-indigo-400 hover:bg-indigo-400/10 transition"
                          title="Start task"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(task, "Done")}
                        className="p-1.5 rounded-md text-white/40 hover:text-emerald-400 hover:bg-emerald-400/10 transition"
                        title="Mark as done"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {task.status === "Done" && (
                    <button
                      onClick={() => handleStatusChange(task, "Pending")}
                      className="p-1.5 rounded-md text-white/40 hover:text-amber-400 hover:bg-amber-400/10 transition"
                      title="Reopen task"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Task title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="e.g., Complete project proposal"
              required
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Add more details..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Due date</label>
              <input
                type="date"
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                placeholder="e.g., Work"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="High" className="bg-slate-800">High</option>
                <option value="Medium" className="bg-slate-800">Medium</option>
                <option value="Low" className="bg-slate-800">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Pending" className="bg-slate-800">Pending</option>
                <option value="In progress" className="bg-slate-800">In progress</option>
                <option value="Done" className="bg-slate-800">Done</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition"
            >
              {editingTask ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
