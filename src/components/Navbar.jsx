import React from "react";
import { useLocation } from "react-router-dom";
import { routeTitles } from "../constants/routeTitles";

const Navbar = () => {
  const location = useLocation();

  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <nav
      className="h-16 bg-[#9DBDFA] border-b border-slate-800
                 flex items-center px-6
                 fixed top-0 right-0 left-64 z-10
                 backdrop-blur"
    >
      <h1 className="text-slate-800 font-semibold text-lg">
        {title}
      </h1>
    </nav>
  );
};

export default Navbar;
