import React from "react";

const goals = [
  {
    title: "Ship Consi Tracker MVP",
    description: "Core dashboards, habits, tasks, and goal flows.",
    progress: 68,
    due: "Feb 12",
  },
  {
    title: "Establish 90-day consistency plan",
    description: "Focus on 3 habits and 2 long-term goals.",
    progress: 42,
    due: "Mar 08",
  },
  {
    title: "Improve weekly review ritual",
    description: "Automate metrics and weekly reflection.",
    progress: 76,
    due: "Jan 30",
  },
];

const Goals = () => {
  return (
    <div className="space-y-6 text-white">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Goals</h1>
            <p className="text-xs text-white/60">
              Keep goals visible and review progress weekly.
            </p>
          </div>
          <button className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white">
            Add goal
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {goals.map((goal) => (
          <div
            key={goal.title}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{goal.title}</p>
                <p className="mt-2 text-xs text-white/60">{goal.description}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                Due {goal.due}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-white/60">
              <span>Linked habits: 2</span>
              <button className="text-white/70 hover:text-white">Review milestones</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;