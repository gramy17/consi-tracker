import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, ChevronDown, ChevronUp, Target } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Goals</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track your long-term objectives and milestones
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111111] border border-[#1a1a1a] text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-5">
            <Target className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No goals yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">Set your targets and track your progress over time</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all"
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
              className="p-5 rounded-2xl bg-[#111111] border border-[#1a1a1a] hover:border-[#262626] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{goal.title}</p>
                  {goal.description && (
                    <p className="mt-2 text-xs text-neutral-500 line-clamp-2">{goal.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-neutral-400">
                    {formatDate(goal.dueDate)}
                  </span>
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-neutral-500">Progress</span>
                  <span className="text-white font-medium">{goal.progress || 0}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                  <div
                    className="h-1.5 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Milestones Section */}
              {(goal.milestones || []).length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                    className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-all"
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
                          className="flex items-center gap-3 text-xs p-2 rounded-lg bg-[#0a0a0a]"
                        >
                          <button
                            onClick={() => toggleMilestone(goal, idx)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              milestone.completed
                                ? "bg-white border-white"
                                : "border-neutral-600 hover:border-neutral-400"
                            }`}
                          >
                            {milestone.completed && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                          </button>
                          <span className={milestone.completed ? "text-neutral-500 line-through" : "text-neutral-300"}>
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Linked habits: {(goal.linkedHabits || []).length}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProgressChange(goal, Math.max(0, (goal.progress || 0) - 10))}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-neutral-400 hover:text-white hover:bg-[#222] transition-all"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleProgressChange(goal, Math.min(100, (goal.progress || 0) + 10))}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-neutral-400 hover:text-white hover:bg-[#222] transition-all"
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Goal title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              placeholder="e.g., Launch MVP by Q1"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
              placeholder="Describe your goal..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Due date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Milestones</label>
            <div className="mt-2 space-y-2">
              {formData.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-neutral-300 bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5">
                    {milestone.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="p-2 text-neutral-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
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
                  className="flex-1 rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMilestone())}
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-3 py-2.5 rounded-xl bg-[#1a1a1a] text-neutral-400 hover:text-white hover:bg-[#222] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {habits.length > 0 && (
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Link habits</label>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto p-3 rounded-xl bg-[#0a0a0a] border border-[#262626]">
                {habits.map((habit) => (
                  <label key={habit.id} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-white transition-colors">
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
                      className="rounded bg-[#1a1a1a] border-neutral-600"
                    />
                    {habit.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-xl border border-[#262626] px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-all"
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