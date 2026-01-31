import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="flex min-h-svh bg-[var(--ui-bg)]">
      <Sidebar />

      <div className="flex-1 relative">
        <Navbar />

        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="ui-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout
