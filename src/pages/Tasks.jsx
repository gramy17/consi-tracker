import React from "react";

const tasks = [
  {
    title: "Draft weekly planning",
    due: "Today 6:00 PM",
    tag: "Planning",
    status: "In progress",
  },
  {
    title: "Refine habit cadence",
    due: "Tomorrow",
    tag: "Focus",
    status: "Pending",
  },
  {
    title: "Ship analytics mock",
    due: "Friday",
    tag: "Design",
    status: "Done",
  },
  {
    title: "Outline Q1 goals",
    due: "Next week",
    tag: "Goals",
    status: "Pending",
  },
];

const Tasks = () => {
  return (
    <div className="space-y-6 text-white">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h1 className="text-lg font-semibold">Tasks</h1>
            <p className="text-xs text-white/60">Plan, prioritize, and ship consistently.</p>
          </div>
          <button className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white">
            Add task
          </button>
        </div>

        <div className="grid gap-4 border-t border-white/10 p-5 md:grid-cols-4">
          {[
            { label: "Status", options: ["All", "Pending", "In progress", "Done"] },
            { label: "Priority", options: ["All", "High", "Medium", "Low"] },
            { label: "Focus", options: ["All", "Planning", "Focus", "Design"] },
            { label: "Due", options: ["Any", "Today", "This week", "This month"] },
          ].map((filter) => (
            <div key={filter.label}>
              <label className="text-xs text-white/60">{filter.label}</label>
              <select className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80">
                {filter.options.map((option) => (
                  <option key={option} value={option} className="text-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{task.title}</p>
                <p className="mt-1 text-xs text-white/60">Due {task.due}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                {task.tag}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.status === "Done"
                    ? "bg-emerald-400/15 text-emerald-200"
                    : task.status === "In progress"
                    ? "bg-indigo-400/15 text-indigo-200"
                    : "bg-amber-400/15 text-amber-200"
                }`}
              >
                {task.status}
              </span>
              <button className="text-xs text-white/70 hover:text-white">View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
