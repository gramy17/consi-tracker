import React from "react";
import { useLocation } from "react-router-dom";
import { routeMeta } from "../constants/routeMeta";

const Navbar = () => {
  const { pathname } = useLocation();

  const meta = routeMeta[pathname] || routeMeta["/"];

  return (
    <nav
      className="h-16 bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)]
                 border-b border-slate-800
                 flex items-center px-6
                 fixed top-0 right-0 left-64 z-10
                 backdrop-blur
                 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
    >
      {/* Left: title + subtitle */}
      <div className="leading-tight">
        <h1 className="text-white/90 font-semibold text-lg">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-white/70 text-xs">
            {meta.subtitle}
          </p>
        )}
      </div>

      {/* Right: actions */}
      <div className="ml-auto flex items-center gap-3">
        <button className="px-3 py-2 rounded-md text-white/90 hover:bg-white/10 text-sm font-medium transition">
          Light
        </button>

        <button className="px-4 py-2 rounded-md bg-white/90 text-[#4B0879] text-sm font-medium hover:bg-white transition">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
