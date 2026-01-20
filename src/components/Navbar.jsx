import React from "react";
import { useLocation } from "react-router-dom";
import { routeTitles } from "../constants/routeTitles";

const Navbar = () => {
  const location = useLocation();

  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <nav
      className="h-16 bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)] border-b border-slate-800
                 flex items-center px-6
                 fixed top-0 right-0 left-64 z-10
                 backdrop-blur
                 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
    >
      <h1 className="text-white/90 font-semibold text-lg">
        {title}
      </h1>
    </nav>
  );
};

export default Navbar;
