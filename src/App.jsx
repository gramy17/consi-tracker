import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar"; 

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";

const App = () => {
  return (
    <div className="flex bg-[#030619] min-h-screen">
      <Sidebar />

      <div className="flex-1 relative">
        <Navbar />

        <main className="pt-16 p-6 text-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
