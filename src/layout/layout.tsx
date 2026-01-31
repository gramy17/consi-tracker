import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-svh bg-[var(--ui-bg)]">
      <Sidebar />

      <div className="flex-1 relative">
        <Navbar />

        <main className="pt-16 p-6 text-[var(--ui-text)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
