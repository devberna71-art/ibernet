import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo */}
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          p: 0,
          m: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}