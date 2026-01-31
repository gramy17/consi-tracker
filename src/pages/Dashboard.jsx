import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { PageLoader } from "../components/LoadingSpinner";

const Dashboard = () => {
  const { habits, tasks, goals, loading, completeHabit, uncompleteHabit, getStats } = useData();

  const today = new Date().toISOString().split("T")[0];
  const stats = getStats();

  const todayHabits = habits.slice(0, 4).map((habit) => ({
    ...habit,
    status: (habit.completedDates || []).includes(today) ? "Done" : "Pending",
  }));

  const upcomingTasks = tasks
    .filter((t) => t.status !== "Done")
    .slice(0, 3)
    .map((task) => ({
      ...task,
      time: task.due || "No due date",
    }));

  const handleToggleHabit = async (habit) => {
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

  const statsDisplay = [
    { 
      label: "Active habits", 
      value: stats.activeHabits, 
      trend: `${stats.habitsCompletedToday}/${stats.totalHabits} done today` 
    },
    { 
      label: "Tasks done", 
      value: stats.tasksDone, 
      trend: `${stats.completionRate}% completion` 
    },
    { 
      label: "Goals on track", 
      value: stats.goalsOnTrack, 
      trend: `of ${stats.totalGoals} total` 
    },
    { 
      label: "Consistency score", 
      value: `${stats.consistencyScore}%`, 
      trend: `Avg streak: ${stats.avgStreak} days` 
    },
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur px-4 py-4"
          >
            <p className="text-xs uppercase tracking-wide text-white/60">
              {stat.label}
            </p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold text-white">
                {stat.value}
              </span>
              <span className="text-xs text-emerald-300/90">{stat.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Today's Habits */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Today's habits</h2>
              <p className="text-xs text-white/60">Keep the streak alive</p>
            </div>
            <Link 
              to="/habits"
              className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20 transition"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {todayHabits.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-white/60 text-sm">No habits yet.</p>
              <Link 
                to="/habits"
                className="inline-block mt-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                Create your first habit →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {todayHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleHabit(habit)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        habit.status === "Done"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-white/30 hover:border-emerald-400"
                      }`}
                    >
                      {habit.status === "Done" && <Check className="w-3 h-3" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${habit.status === "Done" ? "text-white/60 line-through" : "text-white"}`}>
                        {habit.name}
                      </p>
                      <p className="text-xs text-white/60">{habit.streak || 0} day streak</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      habit.status === "Done"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : "bg-amber-400/15 text-amber-200"
                    }`}
                  >
                    {habit.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming tasks</h2>
              <p className="text-xs text-white/60">Focus on the next step</p>
            </div>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-white/60 text-sm">No pending tasks.</p>
              <Link 
                to="/tasks"
                className="inline-block mt-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                Add a task →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                    <span>{task.time}</span>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-white/70">
                      {task.tag || "General"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/tasks"
            className="mt-4 flex items-center justify-center gap-1 w-full rounded-md border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition"
          >
            View all tasks
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* Goals Overview */}
      <section className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Goals overview</h2>
            <p className="text-xs text-white/60">Track your long-term progress</p>
          </div>
          <Link 
            to="/goals"
            className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        {goals.length === 0 ? (
          <div className="mt-4 text-center py-8">
            <p className="text-white/60 text-sm">No goals set yet.</p>
            <Link 
              to="/goals"
              className="inline-block mt-2 text-purple-400 hover:text-purple-300 text-sm"
            >
              Set your first goal →
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="text-sm font-medium text-white truncate">{goal.title}</p>
                <p className="mt-1 text-xs text-white/60 truncate">
                  {goal.description || "No description"}
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/60 text-right">{goal.progress || 0}%</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
