import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#DCE8FF] text-slate-900">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 text-[#4B0879] font-semibold">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5E059C] to-black flex items-center justify-center text-white font-bold">
          CT
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold">Consi Tracker</p>
          <p className="text-xs text-slate-600">Command center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1">
        {[
          { name: "Dashboard", path: "/" },
          { name: "Tasks", path: "/tasks" },
          { name: "Habits", path: "/habits" },
          { name: "Goals", path: "/goals" },
          { name: "Analytics", path: "/analytics" },
          { name: "Settings", path: "/settings" },
        ].map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm transition
              ${
              isActive
              ? "bg-[#cddcff] text-[#4B0879] font-semibold"
                  : "text-slate-700 hover:bg-[#e6efff] hover:text-[#4B0879]"
              }`
            }
          >
          {item.name}
          </NavLink>

        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-slate-300 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5E059C] to-black flex items-center justify-center text-white font-semibold">
          U
        </div>

        <div className="text-sm leading-tight">
          <p className="text-slate-900 font-medium">User</p>
          <p className="text-slate-600">user@example.com</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;