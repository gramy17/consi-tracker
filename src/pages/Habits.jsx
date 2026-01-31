import React, { useState } from "react";
import { Plus, Check, Trash2, Edit2, Flame, Clock } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";

const Habits = () => {
  const { habits, loading, createHabit, editHabit, removeHabit, completeHabit, uncompleteHabit } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cadence: "Daily",
    goal: "",
    scheduledTime: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await editHabit(editingHabit.id, formData);
      } else {
        await createHabit(formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await removeHabit(habitId);
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  const handleToggleComplete = async (habit) => {
    const isCompletedToday = (habit.completedDates || []).includes(today);
    try {
      if (isCompletedToday) {
        await uncompleteHabit(habit.id, new Date());
      } else {
        await completeHabit(habit.id, new Date());
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      cadence: habit.cadence || "Daily",
      goal: habit.goal || "",
      scheduledTime: habit.scheduledTime || "",
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setFormData({
      name: "",
      cadence: "Daily",
      goal: "",
      scheduledTime: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setFormData({ name: "", cadence: "Daily", goal: "", scheduledTime: "" });
  };

  const schedule = habits
    .filter((h) => h.scheduledTime)
    .sort((a, b) => (a.scheduledTime || "").localeCompare(b.scheduledTime || ""))
    .map((h) => ({
      time: h.scheduledTime,
      item: h.name,
      id: h.id,
    }));

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="ui-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="ui-h1">Habits</h1>
            <p className="ui-subtitle mt-1">Build consistent routines that stick</p>
          </div>
          <button
            onClick={openAddModal}
            className="ui-btn ui-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add habit
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="ui-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-6">
            <Flame className="w-8 h-8 text-white/35" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No habits yet</h3>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">Start building consistency by creating your first habit</p>
          <button
            onClick={openAddModal}
            className="ui-btn ui-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create your first habit
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Habits List */}
          <div className="lg:col-span-2 space-y-4">
            {habits.map((habit) => {
              const isCompletedToday = (habit.completedDates || []).includes(today);
              const streakProgress = Math.min(100, (habit.streak || 0) * 5);
              return (
                <div
                  key={habit.id}
                  className="ui-card p-5 transition-colors hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(habit)}
                        className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isCompletedToday
                            ? "bg-white border-white"
                            : "border-white/25 hover:border-white/45"
                        }`}
                      >
                        {isCompletedToday && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isCompletedToday ? "text-white/45 line-through" : "text-white/90"}`}>
                          {habit.name}
                        </p>
                        <p className="text-xs text-white/45 mt-2">
                          {habit.cadence || "Daily"}
                          {habit.goal && ` · ${habit.goal}`}
                          {habit.scheduledTime && ` · ${habit.scheduledTime}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-3 py-2 rounded-lg bg-white/8 text-xs font-medium text-white/60">
                        {habit.streak || 0} day streak
                      </span>
                      <button
                        onClick={() => openEditModal(habit)}
                        className="ui-icon-btn"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        className="ui-icon-btn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-white transition-all duration-500"
                        style={{ width: `${streakProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Schedule */}
          <div className="ui-card p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <Clock className="w-4 h-4 text-white/55" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Today's Schedule</h2>
                <p className="text-xs text-white/50">Your daily rhythm</p>
              </div>
            </div>

            {schedule.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-white/45">
                  Add scheduled times to your habits to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                  >
                    <span className="text-xs font-medium text-white/45">{slot.time}</span>
                    <span className="text-sm text-white/90">{slot.item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingHabit ? "Edit Habit" : "Add New Habit"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ui-label">Habit name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="ui-input"
              placeholder="e.g., Morning meditation"
              required
            />
          </div>

          <div>
            <label className="ui-label">Cadence</label>
            <select
              value={formData.cadence}
              onChange={(e) => setFormData({ ...formData, cadence: e.target.value })}
              className="ui-select"
            >
              <option value="Daily" className="bg-[#111]">Daily</option>
              <option value="Weekdays" className="bg-[#111]">Weekdays</option>
              <option value="Weekends" className="bg-[#111]">Weekends</option>
              <option value="Weekly" className="bg-[#111]">Weekly</option>
            </select>
          </div>

          <div>
            <label className="ui-label">Goal (optional)</label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="ui-input"
              placeholder="e.g., 10 minutes"
            />
          </div>

          <div>
            <label className="ui-label">Scheduled time (optional)</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="ui-input"
            />
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
              {editingHabit ? "Save changes" : "Add habit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Habits;
