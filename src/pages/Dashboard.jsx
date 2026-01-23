import React from "react";

const stats = [
  { label: "Active habits", value: 6, trend: "+2 this week" },
  { label: "Tasks done", value: 14, trend: "84% completion" },
  { label: "Goals on track", value: 3, trend: "2 milestones due" },
  { label: "Consistency score", value: "88%", trend: "+5% vs last week" },
];

const todayHabits = [
  { name: "Morning stretch", streak: 12, status: "Done" },
  { name: "Read 20 minutes", streak: 9, status: "Pending" },
  { name: "Hydration", streak: 21, status: "Done" },
  { name: "Evening review", streak: 6, status: "Pending" },
];

const upcomingTasks = [
  { title: "Plan weekly sprint", time: "Today, 4:00 PM", tag: "Planning" },
  { title: "Refactor habit tracker", time: "Tomorrow", tag: "Focus" },
  { title: "Update goals checklist", time: "Friday", tag: "Goals" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
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
        <div className="lg:col-span-2 rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Today&#39;s habits</h2>
              <p className="text-xs text-white/60">Keep the streak alive</p>
            </div>
            <button className="rounded-md bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20">
              Mark all done
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todayHabits.map((habit) => (
              <div
                key={habit.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{habit.name}</p>
                  <p className="text-xs text-white/60">{habit.streak} day streak</p>
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
        </div>

        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-lg font-semibold text-white">Upcoming tasks</h2>
          <p className="text-xs text-white/60">Focus on the next step</p>

          <div className="mt-4 space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.title}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-sm font-medium text-white">{task.title}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                  <span>{task.time}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-white/70">
                    {task.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Consistency plan</h2>
            <p className="text-xs text-white/60">Your weekly focus map</p>
          </div>
          <button className="rounded-md border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
            View calendar
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {["Focus", "Momentum", "Recovery"].map((pillar, index) => (
            <div
              key={pillar}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-wide text-white/60">{pillar}</p>
              <p className="mt-2 text-sm text-white/80">
                {index === 0 && "Deep work blocks, 2 hours daily."}
                {index === 1 && "Habit streaks with 80% completion."}
                {index === 2 && "Plan resets + reflection on Sundays."}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                  style={{ width: `${70 + index * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
