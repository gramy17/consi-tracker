import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = userProfile?.displayName || user?.displayName || "User";

  const metaByPath = {
    "/": { title: "Dashboard", subtitle: "Structured, opinionated productivity" },
    "/tasks": { title: "Tasks", subtitle: "Manage your daily tasks efficiently" },
    "/habits": { title: "Habits", subtitle: "Track and build your daily habits" },
    "/goals": { title: "Goals", subtitle: "Set and achieve your long-term goals" },
    "/analytics": { title: "Analytics", subtitle: "View your productivity metrics" },
    "/settings": { title: "Settings", subtitle: "Configure your preferences and account" },
  };

  const meta = metaByPath[pathname] || {
    title: "Consi Tracker",
    subtitle: "Your consistency control center",
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mobileNavItems = [
    { name: "Dashboard", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Habits", path: "/habits" },
    { name: "Goals", path: "/goals" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <>
      <nav
        className="h-16 bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)]
                   border-b border-slate-800
                   flex items-center px-6
                   fixed top-0 right-0 left-0 md:left-64 z-10
                   backdrop-blur
                   shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
      >
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 mr-3 rounded-md text-white/90 hover:bg-white/10 transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Left: title + subtitle */}
        <div className="leading-tight">
          <h1 className="text-white/90 font-semibold text-lg">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-white/70 text-xs hidden sm:block">
              {meta.subtitle}
            </p>
          )}
        </div>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/80 text-sm hidden sm:block">
            Hi, {displayName.split(" ")[0]}
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-white/90 text-[#4B0879] text-sm font-medium hover:bg-white transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 w-64 h-full bg-[#DCE8FF] shadow-xl">
            <div className="flex items-center gap-3 px-6 py-5 text-[#4B0879] font-semibold border-b border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)] flex items-center justify-center text-white font-bold text-sm">
                CT
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Consi Tracker</p>
                <p className="text-xs text-slate-600">Command center</p>
              </div>
            </div>

            <nav className="px-4 py-4 space-y-1">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    pathname === item.path
                      ? "bg-[#cddcff] text-[#4B0879] font-semibold"
                      : "text-slate-700 hover:bg-[#e6efff] hover:text-[#4B0879]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-slate-300">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
