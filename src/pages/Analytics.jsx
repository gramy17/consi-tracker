import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { PageLoader } from "../components/LoadingSpinner";

const Analytics = () => {
  const { habits, tasks, goals, loading, getStats } = useData();
  const stats = getStats();

  // Generate heatmap data for last 30 days
  const heatmapData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const completedHabits = habits.filter((h) =>
        (h.completedDates || []).includes(dateStr)
      ).length;
      
      const completionRate = habits.length
        ? Math.round((completedHabits / habits.length) * 100)
        : 0;
      
      days.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: date.getDate(),
        completionRate,
        completedHabits,
      });
    }
    
    return days;
  }, [habits]);

  // Habit performance data
  const habitPerformance = useMemo(() => {
    return habits.map((habit) => {
      const completedDates = habit.completedDates || [];
      const last30Days = heatmapData.map((d) => d.date);
      const completedInPeriod = completedDates.filter((d) =>
        last30Days.includes(d)
      ).length;
      const completionRate = Math.round((completedInPeriod / 30) * 100);
      
      return {
        name: habit.name,
        streak: habit.streak || 0,
        completionRate,
        completedInPeriod,
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
  }, [habits, heatmapData]);

  // Weekly task completion
  const weeklyTaskStats = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    
    const thisWeekTasks = tasks.filter((t) => {
      const createdAt = t.createdAt?.toDate?.() || new Date(t.createdAt);
      return createdAt >= weekAgo;
    });
    
    const completedThisWeek = thisWeekTasks.filter((t) => t.status === "Done").length;
    
    return {
      total: thisWeekTasks.length,
      completed: completedThisWeek,
      pending: thisWeekTasks.filter((t) => t.status === "Pending").length,
      inProgress: thisWeekTasks.filter((t) => t.status === "In progress").length,
    };
  }, [tasks]);

  const getHeatmapColor = (rate) => {
    if (rate === 0) return "bg-white/5";
    if (rate < 25) return "bg-indigo-900/50";
    if (rate < 50) return "bg-indigo-700/50";
    if (rate < 75) return "bg-indigo-500/50";
    return "bg-indigo-400/70";
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 text-slate-50">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Analytics</h1>
            <p className="text-xs text-white/60">Measure the impact of your consistency.</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { 
            label: "Streak stability", 
            value: `${stats.avgStreak}`, 
            unit: "days",
            note: "Average streak" 
          },
          { 
            label: "Weekly completion", 
            value: `${weeklyTaskStats.completed}/${weeklyTaskStats.total}`, 
            unit: "",
            note: `${weeklyTaskStats.pending} pending` 
          },
          { 
            label: "Habits today", 
            value: `${stats.habitsCompletedToday}/${stats.totalHabits}`, 
            unit: "",
            note: `${stats.consistencyScore}% consistency` 
          },
          { 
            label: "Goals progress", 
            value: stats.goalsOnTrack, 
            unit: "",
            note: `of ${stats.totalGoals} on track` 
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur px-4 py-4"
          >
            <p className="text-xs uppercase tracking-wide text-white/60">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stat.value}
              {stat.unit && <span className="text-sm text-white/60 ml-1">{stat.unit}</span>}
            </p>
            <p className="mt-2 text-xs text-emerald-300/80">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <h2 className="text-sm font-semibold text-white">Consistency heatmap</h2>
        <p className="text-xs text-white/60">Last 30 days of habit completion</p>
        
        {habits.length === 0 ? (
          <div className="mt-4 text-center py-8 text-white/40 text-sm">
            Add habits to see your consistency heatmap
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {heatmapData.map((day) => (
                <div
                  key={day.date}
                  className={`w-8 h-8 rounded ${getHeatmapColor(day.completionRate)} flex items-center justify-center text-xs text-white/60 cursor-default transition hover:ring-1 hover:ring-white/30`}
                  title={`${day.date}: ${day.completedHabits}/${habits.length} habits (${day.completionRate}%)`}
                >
                  {day.dayNum}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-white/5" />
                <div className="w-4 h-4 rounded bg-indigo-900/50" />
                <div className="w-4 h-4 rounded bg-indigo-700/50" />
                <div className="w-4 h-4 rounded bg-indigo-500/50" />
                <div className="w-4 h-4 rounded bg-indigo-400/70" />
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Habit Performance */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Habit performance</h2>
          <p className="text-xs text-white/60">30-day completion rates</p>
          
          {habitPerformance.length === 0 ? (
            <div className="mt-4 text-center py-8 text-white/40 text-sm">
              No habits to analyze yet
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {habitPerformance.slice(0, 5).map((habit) => (
                <div key={habit.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80 truncate">{habit.name}</span>
                    <span className="text-white/60">{habit.completionRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                      style={{ width: `${habit.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Distribution */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Task distribution</h2>
          <p className="text-xs text-white/60">Current task status breakdown</p>
          
          {tasks.length === 0 ? (
            <div className="mt-4 text-center py-8 text-white/40 text-sm">
              No tasks to analyze yet
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {[
                { label: "Completed", count: tasks.filter((t) => t.status === "Done").length, color: "bg-emerald-400" },
                { label: "In Progress", count: tasks.filter((t) => t.status === "In progress").length, color: "bg-indigo-400" },
                { label: "Pending", count: tasks.filter((t) => t.status === "Pending").length, color: "bg-amber-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-white/80 flex-1">{item.label}</span>
                  <span className="text-sm text-white/60">{item.count}</span>
                  <span className="text-xs text-white/40">
                    ({tasks.length > 0 ? Math.round((item.count / tasks.length) * 100) : 0}%)
                  </span>
                </div>
              ))}
              
              <div className="h-4 w-full rounded-full bg-white/10 flex overflow-hidden mt-2">
                {tasks.length > 0 && (
                  <>
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${(tasks.filter((t) => t.status === "Done").length / tasks.length) * 100}%` }}
                    />
                    <div
                      className="h-full bg-indigo-400"
                      style={{ width: `${(tasks.filter((t) => t.status === "In progress").length / tasks.length) * 100}%` }}
                    />
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${(tasks.filter((t) => t.status === "Pending").length / tasks.length) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Goal Progress */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Goal progress</h2>
          <p className="text-xs text-white/60">Track your long-term achievements</p>
          
          {goals.length === 0 ? (
            <div className="mt-4 text-center py-8 text-white/40 text-sm">
              No goals to track yet
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80 truncate">{goal.title}</span>
                    <span className="text-white/60">{goal.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak Leaders */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Streak leaders</h2>
          <p className="text-xs text-white/60">Your most consistent habits</p>
          
          {habits.length === 0 ? (
            <div className="mt-4 text-center py-8 text-white/40 text-sm">
              No habits to show
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {[...habits]
                .sort((a, b) => (b.streak || 0) - (a.streak || 0))
                .slice(0, 5)
                .map((habit, index) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className={`text-lg font-bold ${
                      index === 0 ? "text-yellow-400" :
                      index === 1 ? "text-gray-300" :
                      index === 2 ? "text-amber-600" :
                      "text-white/40"
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-sm text-white/80 flex-1 truncate">{habit.name}</span>
                    <span className="text-sm font-semibold text-emerald-300">
                      {habit.streak || 0} days
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
