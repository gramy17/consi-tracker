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
    <aside className="hidden md:flex flex-col w-72 bg-[#0f0f0f] border-r border-[#1a1a1a]">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
          <span className="text-black font-bold text-sm">CT</span>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white tracking-tight">Consi Tracker</p>
          <p className="text-xs text-neutral-500">Build consistency</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-[#141414]">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white font-medium text-sm">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-neutral-500 truncate">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors"
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
