import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex bg-[#050A20] min-h-screen">
      <Sidebar />

      <div className="flex-1 relative">
        <Navbar />

        <main className="pt-16 p-6 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
