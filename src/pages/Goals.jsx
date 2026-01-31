import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";

const Goals = () => {
  const { goals, habits, loading, createGoal, editGoal, removeGoal } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    progress: 0,
    milestones: [],
    linkedHabits: [],
  });
  const [newMilestone, setNewMilestone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await editGoal(editingGoal.id, formData);
      } else {
        await createGoal(formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await removeGoal(goalId);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleProgressChange = async (goal, newProgress) => {
    try {
      await editGoal(goal.id, { ...goal, progress: newProgress });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const toggleMilestone = async (goal, milestoneIndex) => {
    const updatedMilestones = [...(goal.milestones || [])];
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      completed: !updatedMilestones[milestoneIndex].completed,
    };
    
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);
    
    try {
      await editGoal(goal.id, { milestones: updatedMilestones, progress });
    } catch (error) {
      console.error("Error toggling milestone:", error);
    }
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, { text: newMilestone.trim(), completed: false }],
      });
      setNewMilestone("");
    }
  };

  const removeMilestone = (index) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    });
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      dueDate: goal.dueDate || "",
      progress: goal.progress || 0,
      milestones: goal.milestones || [],
      linkedHabits: goal.linkedHabits || [],
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      progress: 0,
      milestones: [],
      linkedHabits: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setNewMilestone("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Goals</h1>
            <p className="text-xs text-white/60">
              Keep goals visible and review progress weekly.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white transition"
          >
            <Plus className="w-4 h-4" />
            Add goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-10 text-center">
          <p className="text-white/60 mb-4">No goals yet. Set your targets!</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition"
          >
            <Plus className="w-4 h-4" />
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{goal.title}</p>
                  {goal.description && (
                    <p className="mt-2 text-xs text-white/60">{goal.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    Due {formatDate(goal.dueDate)}
                  </span>
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Progress</span>
                  <span>{goal.progress || 0}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Milestones Section */}
              {(goal.milestones || []).length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                    className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition"
                  >
                    {expandedGoal === goal.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                  </button>
                  
                  {expandedGoal === goal.id && (
                    <div className="mt-3 space-y-2">
                      {goal.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs"
                        >
                          <button
                            onClick={() => toggleMilestone(goal, idx)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              milestone.completed
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-white/30 hover:border-emerald-400"
                            }`}
                          >
                            {milestone.completed && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <span className={milestone.completed ? "text-white/40 line-through" : "text-white/80"}>
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                <span>Linked habits: {(goal.linkedHabits || []).length}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProgressChange(goal, Math.max(0, (goal.progress || 0) - 10))}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleProgressChange(goal, Math.min(100, (goal.progress || 0) + 10))}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    +10%
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
        title={editingGoal ? "Edit Goal" : "Add New Goal"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Goal title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="e.g., Launch MVP by Q1"
              required
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Describe your goal..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Due date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Milestones</label>
            <div className="mt-2 space-y-2">
              {formData.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-white/80 bg-white/5 rounded px-3 py-2">
                    {milestone.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMilestone())}
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-3 py-2 rounded-md bg-white/10 text-white/80 hover:bg-white/20 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {habits.length > 0 && (
            <div>
              <label className="text-xs text-white/60">Link habits</label>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {habits.map((habit) => (
                  <label key={habit.id} className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={formData.linkedHabits.includes(habit.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            linkedHabits: [...formData.linkedHabits, habit.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            linkedHabits: formData.linkedHabits.filter((id) => id !== habit.id),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    {habit.name}
                  </label>
                ))}
              </div>
            </div>
          )}

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
              {editingGoal ? "Save changes" : "Add goal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;