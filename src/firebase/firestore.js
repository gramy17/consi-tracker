import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ============ HABITS ============

export const addHabit = async (userId, habitData) => {
  const habitsRef = collection(db, "users", userId, "habits");
  const habit = {
    ...habitData,
    streak: 0,
    completedDates: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(habitsRef, habit);
  return { id: docRef.id, ...habit };
};

export const updateHabit = async (userId, habitId, habitData) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  await updateDoc(habitRef, {
    ...habitData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteHabit = async (userId, habitId) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(habitRef);
};

export const markHabitComplete = async (userId, habitId, date) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  const habitDoc = await getDoc(habitRef);
  
  if (habitDoc.exists()) {
    const habitData = habitDoc.data();
    const completedDates = habitData.completedDates || [];
    const dateStr = date.toISOString().split('T')[0];
    
    if (!completedDates.includes(dateStr)) {
      completedDates.push(dateStr);
      
      // Calculate streak
      const streak = calculateStreak(completedDates);
      
      await updateDoc(habitRef, {
        completedDates,
        streak,
        updatedAt: serverTimestamp(),
      });
    }
  }
};

export const unmarkHabitComplete = async (userId, habitId, date) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  const habitDoc = await getDoc(habitRef);
  
  if (habitDoc.exists()) {
    const habitData = habitDoc.data();
    const dateStr = date.toISOString().split('T')[0];
    const completedDates = (habitData.completedDates || []).filter(d => d !== dateStr);
    const streak = calculateStreak(completedDates);
    
    await updateDoc(habitRef, {
      completedDates,
      streak,
      updatedAt: serverTimestamp(),
    });
  }
};

const calculateStreak = (completedDates) => {
  if (!completedDates.length) return 0;
  
  const sortedDates = [...completedDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Check if the most recent date is today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i - 1]);
    const prevDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((currentDate - prevDate) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const subscribeToHabits = (userId, callback) => {
  const habitsRef = collection(db, "users", userId, "habits");
  const q = query(habitsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const habits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(habits);
  });
};

// ============ TASKS ============

export const addTask = async (userId, taskData) => {
  const tasksRef = collection(db, "users", userId, "tasks");
  const task = {
    ...taskData,
    status: taskData.status || "Pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(tasksRef, task);
  return { id: docRef.id, ...task };
};

export const updateTask = async (userId, taskId, taskData) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await updateDoc(taskRef, {
    ...taskData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (userId, taskId) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await deleteDoc(taskRef);
};

export const subscribeToTasks = (userId, callback) => {
  const tasksRef = collection(db, "users", userId, "tasks");
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

// ============ GOALS ============

export const addGoal = async (userId, goalData) => {
  const goalsRef = collection(db, "users", userId, "goals");
  const goal = {
    ...goalData,
    progress: 0,
    milestones: goalData.milestones || [],
    linkedHabits: goalData.linkedHabits || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(goalsRef, goal);
  return { id: docRef.id, ...goal };
};

export const updateGoal = async (userId, goalId, goalData) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  await updateDoc(goalRef, {
    ...goalData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteGoal = async (userId, goalId) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  await deleteDoc(goalRef);
};

export const subscribeToGoals = (userId, callback) => {
  const goalsRef = collection(db, "users", userId, "goals");
  const q = query(goalsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const goals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(goals);
  });
};

// ============ USER PROFILE ============

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (doc) => {
    callback(doc.exists() ? doc.data() : null);
  });
};

// ============ ANALYTICS HELPERS ============

export const getAnalyticsData = async (userId) => {
  const [habitsSnap, tasksSnap, goalsSnap] = await Promise.all([
    getDocs(collection(db, "users", userId, "habits")),
    getDocs(collection(db, "users", userId, "tasks")),
    getDocs(collection(db, "users", userId, "goals")),
  ]);

  const habits = habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const tasks = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const goals = goalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Calculate analytics
  const today = new Date().toISOString().split('T')[0];
  
  const completedTasksThisWeek = tasks.filter(t => {
    if (t.status !== "Done") return false;
    const updatedAt = t.updatedAt?.toDate?.() || new Date(t.updatedAt);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return updatedAt >= weekAgo;
  }).length;

  const totalTasksThisWeek = tasks.filter(t => {
    const createdAt = t.createdAt?.toDate?.() || new Date(t.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return createdAt >= weekAgo;
  }).length;

  const habitsCompletedToday = habits.filter(h => 
    (h.completedDates || []).includes(today)
  ).length;

  const avgStreak = habits.length 
    ? Math.round(habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length)
    : 0;

  const goalsOnTrack = goals.filter(g => (g.progress || 0) >= 50).length;

  const consistencyScore = habits.length
    ? Math.round((habitsCompletedToday / habits.length) * 100)
    : 0;

  return {
    habits,
    tasks,
    goals,
    stats: {
      activeHabits: habits.length,
      completedTasksThisWeek,
      totalTasksThisWeek,
      habitsCompletedToday,
      totalHabits: habits.length,
      avgStreak,
      goalsOnTrack,
      totalGoals: goals.length,
      consistencyScore,
    },
  };
};
