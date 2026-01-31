import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Habits", path: "/habits", icon: Flame },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const { user, userProfile, logout } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || "User";
  const email = user?.email || "user@example.com";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#DCE8FF] text-slate-900">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 text-[#4B0879] font-semibold">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)] flex items-center justify-center text-white font-bold">
          CT
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold">Consi Tracker</p>
          <p className="text-xs text-slate-600">Command center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm
                 cursor-pointer
                transition-colors duration-150 ease-out
                ${
                  isActive
                    ? "bg-[#cddcff] text-[#4B0879] font-semibold"
                    : "text-slate-700 hover:bg-[#e6efff] hover:text-[#4B0879]"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>

          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-300">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)] flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
          )}

          <div className="text-sm leading-tight flex-1 min-w-0">
            <p className="text-slate-900 font-medium truncate">{displayName}</p>
            <p className="text-slate-600 text-xs truncate">{email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
