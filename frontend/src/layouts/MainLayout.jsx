import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
