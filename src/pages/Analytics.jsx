import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { PageLoader } from "../components/LoadingSpinner";
import { BarChart3, Flame, Target, TrendingUp } from "lucide-react";

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
    if (rate === 0) return "bg-[#1a1a1a]";
    if (rate < 25) return "bg-neutral-700";
    if (rate < 50) return "bg-neutral-600";
    if (rate < 75) return "bg-neutral-400";
    return "bg-white";
  };

  if (loading) {
    return <PageLoader />;
  }

  const mainStats = [
    { 
      label: "Avg Streak", 
      value: `${stats.avgStreak}`, 
      unit: "days",
      note: "Streak stability",
      icon: Flame,
    },
    { 
      label: "Weekly Tasks", 
      value: `${weeklyTaskStats.completed}/${weeklyTaskStats.total}`, 
      unit: "",
      note: `${weeklyTaskStats.pending} pending`,
      icon: TrendingUp,
    },
    { 
      label: "Today's Habits", 
      value: `${stats.habitsCompletedToday}/${stats.totalHabits}`, 
      unit: "",
      note: `${stats.consistencyScore}% consistency`,
      icon: BarChart3,
    },
    { 
      label: "Goals on Track", 
      value: stats.goalsOnTrack, 
      unit: "",
      note: `of ${stats.totalGoals} total`,
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
        <h1 className="text-xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Measure the impact of your consistency</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group p-5 rounded-2xl bg-[#111111] border border-[#1a1a1a] hover:border-[#262626] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white tracking-tight">
                    {stat.value}
                    {stat.unit && <span className="text-lg text-neutral-500 ml-1">{stat.unit}</span>}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">{stat.note}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] group-hover:bg-[#222] transition-colors">
                  <Icon className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
        <h2 className="text-lg font-semibold text-white">Consistency Heatmap</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Last 30 days of habit completion</p>
        
        {habits.length === 0 ? (
          <div className="mt-6 text-center py-12 text-neutral-500 text-sm">
            Add habits to see your consistency heatmap
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-wrap gap-1.5">
              {heatmapData.map((day) => (
                <div
                  key={day.date}
                  className={`w-9 h-9 rounded-lg ${getHeatmapColor(day.completionRate)} flex items-center justify-center text-xs transition-all hover:ring-2 hover:ring-white/20 cursor-default ${day.completionRate > 50 ? 'text-black' : 'text-neutral-500'}`}
                  title={`${day.date}: ${day.completedHabits}/${habits.length} habits (${day.completionRate}%)`}
                >
                  {day.dayNum}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded bg-[#1a1a1a]" />
                <div className="w-5 h-5 rounded bg-neutral-700" />
                <div className="w-5 h-5 rounded bg-neutral-600" />
                <div className="w-5 h-5 rounded bg-neutral-400" />
                <div className="w-5 h-5 rounded bg-white" />
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Habit Performance */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h2 className="text-lg font-semibold text-white">Habit Performance</h2>
          <p className="text-sm text-neutral-500 mt-0.5">30-day completion rates</p>
          
          {habitPerformance.length === 0 ? (
            <div className="mt-6 text-center py-12 text-neutral-500 text-sm">
              No habits to analyze yet
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {habitPerformance.slice(0, 5).map((habit) => (
                <div key={habit.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-300 truncate">{habit.name}</span>
                    <span className="text-white font-medium">{habit.completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                    <div
                      className="h-1.5 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${habit.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Distribution */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h2 className="text-lg font-semibold text-white">Task Distribution</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Current task status breakdown</p>
          
          {tasks.length === 0 ? (
            <div className="mt-6 text-center py-12 text-neutral-500 text-sm">
              No tasks to analyze yet
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {[
                { label: "Completed", count: tasks.filter((t) => t.status === "Done").length, color: "bg-white" },
                { label: "In Progress", count: tasks.filter((t) => t.status === "In progress").length, color: "bg-neutral-500" },
                { label: "Pending", count: tasks.filter((t) => t.status === "Pending").length, color: "bg-neutral-700" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-neutral-300 flex-1">{item.label}</span>
                  <span className="text-sm text-white font-medium">{item.count}</span>
                  <span className="text-xs text-neutral-500 w-12 text-right">
                    {tasks.length > 0 ? Math.round((item.count / tasks.length) * 100) : 0}%
                  </span>
                </div>
              ))}
              
              <div className="h-2 w-full rounded-full bg-[#1a1a1a] flex overflow-hidden mt-4">
                {tasks.length > 0 && (
                  <>
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${(tasks.filter((t) => t.status === "Done").length / tasks.length) * 100}%` }}
                    />
                    <div
                      className="h-full bg-neutral-500 transition-all"
                      style={{ width: `${(tasks.filter((t) => t.status === "In progress").length / tasks.length) * 100}%` }}
                    />
                    <div
                      className="h-full bg-neutral-700 transition-all"
                      style={{ width: `${(tasks.filter((t) => t.status === "Pending").length / tasks.length) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Goal Progress */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h2 className="text-lg font-semibold text-white">Goal Progress</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Track your long-term achievements</p>
          
          {goals.length === 0 ? (
            <div className="mt-6 text-center py-12 text-neutral-500 text-sm">
              No goals to track yet
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-300 truncate">{goal.title}</span>
                    <span className="text-white font-medium">{goal.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                    <div
                      className="h-1.5 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak Leaders */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h2 className="text-lg font-semibold text-white">Streak Leaders</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Your most consistent habits</p>
          
          {habits.length === 0 ? (
            <div className="mt-6 text-center py-12 text-neutral-500 text-sm">
              No habits to show
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {[...habits]
                .sort((a, b) => (b.streak || 0) - (a.streak || 0))
                .slice(0, 5)
                .map((habit, index) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]"
                  >
                    <span className={`text-lg font-bold w-8 ${
                      index === 0 ? "text-white" :
                      index === 1 ? "text-neutral-400" :
                      index === 2 ? "text-neutral-500" :
                      "text-neutral-600"
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-sm text-neutral-300 flex-1 truncate">{habit.name}</span>
                    <span className="text-sm font-semibold text-white">
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
