import React, { useState } from "react";
import { Plus, Check, Trash2, Edit2 } from "lucide-react";
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
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-white">Habits</h1>
            <p className="text-xs text-white/60">Design habits that reinforce consistency.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white transition"
          >
            <Plus className="w-4 h-4" />
            Add habit
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-10 text-center">
          <p className="text-white/60 mb-4">No habits yet. Start building consistency!</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition"
          >
            <Plus className="w-4 h-4" />
            Create your first habit
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4">
            {habits.map((habit) => {
              const isCompletedToday = (habit.completedDates || []).includes(today);
              return (
                <div
                  key={habit.id}
                  className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur px-5 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(habit)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          isCompletedToday
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-white/30 hover:border-emerald-400"
                        }`}
                      >
                        {isCompletedToday && <Check className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className={`text-sm font-semibold ${isCompletedToday ? "text-white/60 line-through" : "text-white"}`}>
                          {habit.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {habit.cadence || "Daily"}
                          {habit.goal && ` · Goal: ${habit.goal}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                        {habit.streak || 0} day streak
                      </span>
                      <button
                        onClick={() => openEditModal(habit)}
                        className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                      style={{ width: `${Math.min(100, (habit.streak || 0) * 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
            <h2 className="text-sm font-semibold text-white">Today's schedule</h2>
            <p className="text-xs text-white/60">Lock in your rhythm.</p>

            {schedule.length === 0 ? (
              <p className="mt-4 text-xs text-white/40 text-center py-4">
                Add scheduled times to your habits to see them here.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {schedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="text-xs text-white/60">{slot.time}</span>
                    <span className="text-sm text-white">{slot.item}</span>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Habit name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="e.g., Morning meditation"
              required
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Cadence</label>
            <select
              value={formData.cadence}
              onChange={(e) => setFormData({ ...formData, cadence: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Daily" className="bg-slate-800">Daily</option>
              <option value="Weekdays" className="bg-slate-800">Weekdays</option>
              <option value="Weekends" className="bg-slate-800">Weekends</option>
              <option value="Weekly" className="bg-slate-800">Weekly</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60">Goal (optional)</label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="e.g., 10 minutes"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Scheduled time (optional)</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
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
              {editingHabit ? "Save changes" : "Add habit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Habits;
