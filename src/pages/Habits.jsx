import React from "react";

const habits = [
  { name: "Morning stretch", cadence: "Daily", streak: 12, goal: "10 min" },
  { name: "Read non-fiction", cadence: "Daily", streak: 9, goal: "20 min" },
  { name: "Deep work block", cadence: "Weekdays", streak: 4, goal: "2 hours" },
  { name: "Evening review", cadence: "Daily", streak: 6, goal: "5 min" },
];

const schedule = [
  { time: "07:00", item: "Stretch + hydrate" },
  { time: "09:30", item: "Deep work block" },
  { time: "13:00", item: "Read 20 minutes" },
  { time: "20:30", item: "Evening review" },
];

const Habits = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-white">Habits</h1>
            <p className="text-xs text-white/60">Design habits that reinforce consistency.</p>
          </div>
          <button className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white">
            Add habit
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
          {habits.map((habit) => (
            <div
              key={habit.name}
              className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{habit.name}</p>
                  <p className="text-xs text-white/60">{habit.cadence} · Goal {habit.goal}</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                  {habit.streak} day streak
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                  style={{ width: `${65 + habit.streak * 2}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Today&#39;s schedule</h2>
          <p className="text-xs text-white/60">Lock in your rhythm.</p>

          <div className="mt-4 space-y-3">
            {schedule.map((slot) => (
              <div
                key={slot.time}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-xs text-white/60">{slot.time}</span>
                <span className="text-sm text-white">{slot.item}</span>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full rounded-md border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
            Adjust schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Habits;
