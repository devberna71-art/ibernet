import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  CircularProgress,
  GlobalStyles,
  Toolbar,
} from "@mui/material";
import { Menu } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../api/axiosConfig";
import socket from "../api/socketConfig";
import logoBernet from "../assets/Logo-Bernet.png";
import Sidebar, { SIDEBAR_WIDTH } from "../components/ui/Sidebar";
import UserBadge from "../components/UserMiniProfile";
import NavbarVisitor from "./NavbarVisitor";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
  const [membro, setMembro] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const showDesktopSidebar = !isMobile && userRole;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserRole(null);
          return;
        }
        const res = await api.get("/usuario/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data?.usuario?.funcao ?? null);
      } catch {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/meu-perfil");
        setMembro(res.data?.usuario?.membro || null);
      } catch (error) {
        console.error(error);
      }
    };
    if (userRole) fetchPerfil();
  }, [userRole]);

  useEffect(() => {
    if (!userRole || !membro) return;

    if (!socket.connected) {
      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();
    }

    const handler = (data) => {
      if (
        location.pathname !== "/chat/list" &&
        Number(data.MembroId) !== Number(membro.id)
      ) {
        setUnreadMessagesCount((prev) => prev + 1);
      }
    };

    socket.on("global_new_message", handler);
    return () => socket.off("global_new_message", handler);
  }, [userRole, membro]);

  useEffect(() => {
    if (location.pathname === "/chat/list") {
      setUnreadMessagesCount(0);
    }
  }, [location.pathname]);

  if (userRole === undefined) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F6F1E9",
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  const sidebarProps = {
    userRole,
    membro,
    unreadMessagesCount,
    onNavigate: () => setDrawerOpen(false),
    onProfileClick: () => {
      setDrawerOpen(false);
      navigate("/perfil");
    },
  };

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            paddingLeft: showDesktopSidebar ? `${SIDEBAR_WIDTH}px` : 0,
            transition: "padding-left .25s ease",
            overflowX: "hidden",
          },
        }}
      />

      {/* Desktop sidebar */}
      {showDesktopSidebar && <Sidebar {...sidebarProps} />}

      {/* Desktop visitor navbar */}
      {!isMobile && !userRole && <NavbarVisitor />}

      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-[1200] bg-surface border-b border-surfaceMuted">
          <Toolbar sx={{ minHeight: { xs: 64, sm: 64 }, px: 2, justifyContent: "space-between" }}>
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
              <Menu size={22} strokeWidth={1.75} className="text-text" />
            </IconButton>
            <img src={logoBernet} alt="Logo" className="h-10 object-contain" />
            {userRole && membro ? <UserBadge membro={membro} /> : <div className="w-10" />}
          </Toolbar>
        </header>
      )}

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: SIDEBAR_WIDTH, background: "#FFFFFF", border: "none" },
        }}
      >
        {userRole ? (
          <Sidebar {...sidebarProps} className="relative !w-full" />
        ) : (
          <NavbarVisitor toggleDrawer={() => setDrawerOpen(false)} />
        )}
      </Drawer>

      {isMobile && userRole && <Toolbar sx={{ minHeight: { xs: 64, sm: 64 } }} />}
    </>
  );
}
