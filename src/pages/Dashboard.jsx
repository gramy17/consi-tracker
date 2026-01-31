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
    <div className="space-y-8">
      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group p-5 rounded-2xl bg-[#111111] border border-[#1a1a1a] hover:border-[#262626] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">{stat.subtext}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] group-hover:bg-[#222] transition-colors">
                  <Icon className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Today's Habits - Takes 3 columns */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Today's Habits</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Keep your streak alive</p>
            </div>
            <Link 
              to="/habits"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {todayHabits.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-neutral-600" />
              </div>
              <p className="text-neutral-400 mb-3">No habits yet</p>
              <Link 
                to="/habits"
                className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors"
              >
                Create your first habit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#262626] transition-all"
                >
                  <button
                    onClick={() => handleToggleHabit(habit)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      habit.status === "Done"
                        ? "bg-white border-white"
                        : "border-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    {habit.status === "Done" && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${habit.status === "Done" ? "text-neutral-500 line-through" : "text-white"}`}>
                      {habit.name}
                    </p>
                    <p className="text-xs text-neutral-600 mt-0.5">{habit.streak || 0} day streak</p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      habit.status === "Done"
                        ? "bg-white/10 text-neutral-400"
                        : "bg-[#1a1a1a] text-neutral-400"
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
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming Tasks</h2>
              <p className="text-sm text-neutral-500 mt-0.5">What's next on your list</p>
            </div>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6 text-neutral-600" />
              </div>
              <p className="text-neutral-400 mb-3">No pending tasks</p>
              <Link 
                to="/tasks"
                className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors"
              >
                Add a task <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#262626] transition-all"
                >
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{task.time}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-xs text-neutral-400">
                      {task.tag || "General"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/tasks"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] transition-all"
          >
            View all tasks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Goals Overview */}
      <section className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Goals Overview</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Track your long-term progress</p>
          </div>
          <Link 
            to="/goals"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] transition-all"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {goals.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-neutral-400 mb-3">No goals set yet</p>
            <Link 
              to="/goals"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors"
            >
              Set your first goal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#262626] transition-all"
              >
                <p className="text-sm font-medium text-white truncate">{goal.title}</p>
                <p className="mt-1 text-xs text-neutral-500 truncate">
                  {goal.description || "No description"}
                </p>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
