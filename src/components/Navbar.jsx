import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, CheckSquare, Flame, Target, BarChart3, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = userProfile?.displayName || user?.displayName || "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const metaByPath = {
    "/": { title: "Dashboard", subtitle: "Overview of your consistency journey" },
    "/tasks": { title: "Tasks", subtitle: "Manage and track your tasks" },
    "/habits": { title: "Habits", subtitle: "Build lasting daily habits" },
    "/goals": { title: "Goals", subtitle: "Track your long-term goals" },
    "/analytics": { title: "Analytics", subtitle: "Insights into your progress" },
    "/settings": { title: "Settings", subtitle: "Manage your preferences" },
  };

  const meta = metaByPath[pathname] || {
    title: "Consi Tracker",
    subtitle: "Your consistency companion",
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mobileNavItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Habits", path: "/habits", icon: Flame },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      <nav className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a] flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-72 z-10">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -ml-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Title */}
        <div className="flex-1 md:flex-none">
          <h1 className="text-white font-semibold text-lg tracking-tight">{meta.title}</h1>
          <p className="text-neutral-500 text-xs hidden sm:block">{meta.subtitle}</p>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-sm text-white font-medium">{displayName}</p>
            <p className="text-xs text-neutral-500">Welcome back</p>
          </div>
          
          {user?.photoURL ? (
            <img src={user.photoURL} alt={displayName} className="w-9 h-9 rounded-full" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm">
              {initials}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-72 h-full bg-[#0f0f0f] border-r border-[#1a1a1a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-6 border-b border-[#1a1a1a]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">CT</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white tracking-tight">Consi Tracker</p>
                <p className="text-xs text-neutral-500">Build consistency</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="px-3 py-4">
              <div className="space-y-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${pathname === item.path
                          ? "bg-white text-black"
                          : "text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
                        }`}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1a1a1a]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a1a1a] text-neutral-400 hover:text-white text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
