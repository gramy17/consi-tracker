import React, { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, Check, Circle, Clock, CheckSquare, Filter } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="ui-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="ui-h1">Tasks</h1>
            <p className="ui-subtitle mt-1">Plan, prioritize, and ship consistently</p>
          </div>
          <button
            onClick={openAddModal}
            className="ui-btn ui-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="ui-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="ui-select mt-2"
            >
              {["All", "Pending", "In progress", "Done"].map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ui-label">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="ui-select mt-2"
            >
              {["All", "High", "Medium", "Low"].map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ui-label">Tag</label>
            <select
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              className="ui-select mt-2"
            >
              {uniqueTags.map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="ui-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="w-8 h-8 text-white/35" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">Start planning your work by creating your first task</p>
          <button onClick={openAddModal} className="ui-btn ui-btn-primary">
            <Plus className="w-4 h-4" />
            Create your first task
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="ui-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-6">
            <Filter className="w-8 h-8 text-white/35" />
          </div>
          <p className="text-white/60">No tasks match your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="ui-card p-5 transition-colors hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === "Done" ? "text-white/45 line-through" : "text-white/90"}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-2 text-xs text-white/45 line-clamp-2">{task.description}</p>
                  )}
                  <p className="mt-2 text-xs text-white/40">
                    {task.due ? `Due: ${task.due}` : "No due date"}
                  </p>
                </div>
                <span className="px-3 py-2 rounded-lg bg-white/8 text-xs text-white/60 flex-shrink-0">
                  {task.tag || "General"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-2 rounded-lg text-xs font-medium ${
                      task.status === "Done"
                        ? "bg-white/10 text-white/60"
                        : task.status === "In progress"
                        ? "bg-white/12 text-white/75"
                        : "bg-white/8 text-white/60"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-3 py-2 rounded-lg text-xs ${
                      task.priority === "High"
                        ? "bg-white text-black font-medium"
                        : task.priority === "Low"
                        ? "bg-white/6 text-white/40"
                        : "bg-white/8 text-white/60"
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
                          className="ui-icon-btn"
                          title="Start task"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(task, "Done")}
                        className="ui-icon-btn"
                        title="Mark as done"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {task.status === "Done" && (
                    <button
                      onClick={() => handleStatusChange(task, "Pending")}
                      className="ui-icon-btn"
                      title="Reopen task"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(task)}
                    className="ui-icon-btn"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="ui-icon-btn"
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ui-label">Task title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="ui-input"
              placeholder="e.g., Complete project proposal"
              required
            />
          </div>

          <div>
            <label className="ui-label">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="ui-input resize-none"
              placeholder="Add more details..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ui-label">Due date</label>
              <input
                type="date"
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                className="ui-input"
              />
            </div>
            <div>
              <label className="ui-label">Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="ui-input"
                placeholder="e.g., Work"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ui-label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="ui-select"
              >
                <option value="High" className="bg-black">High</option>
                <option value="Medium" className="bg-black">Medium</option>
                <option value="Low" className="bg-black">Low</option>
              </select>
            </div>
            <div>
              <label className="ui-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="ui-select"
              >
                <option value="Pending" className="bg-black">Pending</option>
                <option value="In progress" className="bg-black">In progress</option>
                <option value="Done" className="bg-black">Done</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 ui-btn ui-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 ui-btn ui-btn-primary"
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
