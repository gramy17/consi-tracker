import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  subscribeToHabits,
  subscribeToTasks,
  subscribeToGoals,
  addHabit,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  unmarkHabitComplete,
  addTask,
  updateTask,
  deleteTask,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../firebase/firestore";

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to all data when user is logged in
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setTasks([]);
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeHabits = subscribeToHabits(user.uid, (data) => {
      setHabits(data);
    });

    const unsubscribeTasks = subscribeToTasks(user.uid, (data) => {
      setTasks(data);
    });

    const unsubscribeGoals = subscribeToGoals(user.uid, (data) => {
      setGoals(data);
      setLoading(false);
    });

    return () => {
      unsubscribeHabits();
      unsubscribeTasks();
      unsubscribeGoals();
    };
  }, [user]);

  // Habit operations
  const createHabit = async (habitData) => {
    if (!user) return;
    return await addHabit(user.uid, habitData);
  };

  const editHabit = async (habitId, habitData) => {
    if (!user) return;
    await updateHabit(user.uid, habitId, habitData);
  };

  const removeHabit = async (habitId) => {
    if (!user) return;
    await deleteHabit(user.uid, habitId);
  };

  const completeHabit = async (habitId, date = new Date()) => {
    if (!user) return;
    await markHabitComplete(user.uid, habitId, date);
  };

  const uncompleteHabit = async (habitId, date = new Date()) => {
    if (!user) return;
    await unmarkHabitComplete(user.uid, habitId, date);
  };

  // Task operations
  const createTask = async (taskData) => {
    if (!user) return;
    return await addTask(user.uid, taskData);
  };

  const editTask = async (taskId, taskData) => {
    if (!user) return;
    await updateTask(user.uid, taskId, taskData);
  };

  const removeTask = async (taskId) => {
    if (!user) return;
    await deleteTask(user.uid, taskId);
  };

  // Goal operations
  const createGoal = async (goalData) => {
    if (!user) return;
    return await addGoal(user.uid, goalData);
  };

  const editGoal = async (goalId, goalData) => {
    if (!user) return;
    await updateGoal(user.uid, goalId, goalData);
  };

  const removeGoal = async (goalId) => {
    if (!user) return;
    await deleteGoal(user.uid, goalId);
  };

  // Computed statistics
  const getStats = () => {
    const today = new Date().toISOString().split("T")[0];
    
    const habitsCompletedToday = habits.filter((h) =>
      (h.completedDates || []).includes(today)
    ).length;

    const tasksDone = tasks.filter((t) => t.status === "Done").length;
    const completionRate = tasks.length
      ? Math.round((tasksDone / tasks.length) * 100)
      : 0;

    const goalsOnTrack = goals.filter((g) => (g.progress || 0) >= 50).length;

    const consistencyScore = habits.length
      ? Math.round((habitsCompletedToday / habits.length) * 100)
      : 0;

    const avgStreak = habits.length
      ? Math.round(
          habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length
        )
      : 0;

    return {
      activeHabits: habits.length,
      habitsCompletedToday,
      tasksDone,
      totalTasks: tasks.length,
      completionRate,
      goalsOnTrack,
      totalGoals: goals.length,
      consistencyScore,
      avgStreak,
    };
  };

  const value = {
    // Data
    habits,
    tasks,
    goals,
    loading,
    
    // Habit operations
    createHabit,
    editHabit,
    removeHabit,
    completeHabit,
    uncompleteHabit,
    
    // Task operations
    createTask,
    editTask,
    removeTask,
    
    // Goal operations
    createGoal,
    editGoal,
    removeGoal,
    
    // Stats
    getStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
