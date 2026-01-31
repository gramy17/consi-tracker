import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, CheckSquare, Flame, Target, BarChart3, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = userProfile?.displayName || user?.displayName || "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

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
      <nav className="fixed top-0 right-0 left-0 md:left-72 z-10 bg-[#0a0a0a]/75 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="ui-container h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden ui-icon-btn -ml-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Title */}
          <div className="flex-1 md:flex-none min-w-0">
            <h1 className="text-white/90 font-semibold text-[17px] tracking-tight truncate">{meta.title}</h1>
            <p className="text-white/50 text-xs hidden sm:block truncate">{meta.subtitle}</p>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm text-white/90 font-medium leading-tight">{displayName}</p>
              <p className="text-xs text-white/45">Welcome back</p>
            </div>

            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} className="w-9 h-9 rounded-full" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
                {initials}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu (slide-in) */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 w-72 h-full bg-[#0f0f0f] shadow-2xl transform transition-transform duration-200 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Header */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
                <span className="text-black font-bold text-sm">CT</span>
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white tracking-tight truncate">Consi Tracker</p>
                <p className="text-xs text-white/50 truncate">Build consistency</p>
              </div>
            </div>
            <div className="ui-divider mt-6" />
          </div>

          {/* Nav */}
          <nav className="px-3 py-4">
            <div className="space-y-1">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                      ${
                        isActive
                          ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="ui-divider mb-4" />
            <button onClick={handleLogout} className="w-full ui-btn ui-btn-secondary">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
