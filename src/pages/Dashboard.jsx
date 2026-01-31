import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Flame, Target, CheckSquare, TrendingUp } from "lucide-react";
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
      label: "Active Habits", 
      value: stats.activeHabits, 
      subtext: `${stats.habitsCompletedToday} completed today`,
      icon: Flame,
    },
    { 
      label: "Tasks Done", 
      value: stats.tasksDone, 
      subtext: `${stats.completionRate}% completion rate`,
      icon: CheckSquare,
    },
    { 
      label: "Goals On Track", 
      value: stats.goalsOnTrack, 
      subtext: `of ${stats.totalGoals} total goals`,
      icon: Target,
    },
    { 
      label: "Consistency", 
      value: `${stats.consistencyScore}%`, 
      subtext: `${stats.avgStreak} day avg streak`,
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group ui-card p-5 transition-colors duration-200 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="ui-label">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{stat.subtext}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/8 transition-colors">
                  <Icon className="w-5 h-5 text-white/55" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Today's Habits - Takes 3 columns */}
        <div className="lg:col-span-3 ui-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Today's Habits</h2>
              <p className="text-sm text-white/50 mt-1">Keep your streak alive</p>
            </div>
            <Link 
              to="/habits"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium bg-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {todayHabits.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-white/35" />
              </div>
              <p className="text-white/60 mb-3">No habits yet</p>
              <Link 
                to="/habits"
                className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors"
              >
                Create your first habit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="ui-card p-4 flex items-center gap-4 transition-colors hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
                >
                  <button
                    onClick={() => handleToggleHabit(habit)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      habit.status === "Done"
                        ? "bg-white border-white"
                        : "border-white/25 hover:border-white/45"
                    }`}
                  >
                    {habit.status === "Done" && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${habit.status === "Done" ? "text-white/45 line-through" : "text-white/90"}`}>
                      {habit.name}
                    </p>
                    <p className="text-xs text-white/40 mt-1">{habit.streak || 0} day streak</p>
                  </div>
                  <span
                    className={`px-3 py-2 rounded-lg text-xs font-medium ${
                      habit.status === "Done"
                        ? "bg-white/10 text-white/60"
                        : "bg-white/8 text-white/60"
                    }`}
                  >
                    {habit.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks - Takes 2 columns */}
        <div className="lg:col-span-2 ui-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming Tasks</h2>
            </div>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6 text-white/35" />
              </div>
              <p className="text-white/60 mb-3">No pending tasks</p>
              <Link 
                to="/tasks"
                className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors"
              >
                Add a task <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="ui-card p-4 transition-colors hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
                >
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-white/45">{task.time}</span>
                    <span className="px-3 py-2 rounded-lg bg-white/8 text-xs text-white/60">
                      {task.tag || "General"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/tasks"
            className="mt-4 ui-btn ui-btn-secondary w-full"
          >
            View all tasks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Goals Overview */}
      <section className="ui-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Goals Overview</h2>
            <p className="text-sm text-white/50 mt-1">Track your long-term progress</p>
          </div>
          <Link 
            to="/goals"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium bg-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {goals.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white/35" />
            </div>
            <p className="text-white/60 mb-3">No goals set yet</p>
            <Link 
              to="/goals"
              className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors"
            >
              Set your first goal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="ui-card p-5 transition-colors hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
              >
                <p className="text-sm font-medium text-white truncate">{goal.title}</p>
                <p className="mt-1 text-xs text-white/45 truncate">
                  {goal.description || "No description"}
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-white/45">Progress</span>
                    <span className="text-white font-medium">{goal.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
