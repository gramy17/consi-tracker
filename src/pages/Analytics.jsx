import React from "react";

const Analytics = () => {
  return (
    <div className="space-y-6 text-slate-50">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Analytics</h1>
            <p className="text-xs text-white/60">Measure the impact of your consistency.</p>
          </div>
          <button className="rounded-md border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
            Export report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Streak stability", value: "86%", note: "Up 4% this week" },
          { label: "Weekly completion", value: "32 / 40", note: "8 tasks remaining" },
          { label: "Goal momentum", value: "3.2", note: "Milestones per week" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur px-4 py-4"
          >
            <p className="text-xs uppercase tracking-wide text-white/60">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-xs text-emerald-300/80">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          {
            title: "Consistency heatmap",
            body: "Visualize the days you hit your daily rituals. Identify gaps and recovery windows.",
          },
          {
            title: "Habit trendlines",
            body: "Compare completion rate across habits to double down on the highest impact ones.",
          },
          {
            title: "Focus balance",
            body: "Track how time is distributed across goals, tasks, and personal habits.",
          },
          {
            title: "Weekly reflection",
            body: "Capture learnings, blockers, and wins for a clean weekly reset.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5"
          >
            <h2 className="text-sm font-semibold text-white">{card.title}</h2>
            <p className="mt-2 text-xs text-white/60">{card.body}</p>
            <button className="mt-4 text-xs text-white/70 hover:text-white">View details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
