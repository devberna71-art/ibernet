import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { SIDEBAR_WIDTH } from "../navbar/navConfig";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="transition-all duration-300 ease-in-out lg:pl-[220px]">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
