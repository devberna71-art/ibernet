import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#4F5EF7] border-t-transparent" />
      </div>
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
      {/* Desktop sidebar */}
      {showDesktopSidebar && <Sidebar {...sidebarProps} />}

      {/* Desktop visitor navbar */}
      {!isMobile && !userRole && <NavbarVisitor />}

      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-[1200] bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-2">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <Menu size={22} strokeWidth={1.75} className="text-gray-700" />
            </button>
            <img src={logoBernet} alt="Logo" className="h-10 object-contain" />
            {userRole && membro ? <UserBadge membro={membro} /> : <div className="w-10" />}
          </div>
        </header>
      )}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[1300] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 w-[280px] bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <img src={logoBernet} alt="Logo" className="h-8 object-contain" />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              {userRole ? (
                <Sidebar {...sidebarProps} className="!w-full" />
              ) : (
                <NavbarVisitor toggleDrawer={() => setDrawerOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for mobile header */}
      {isMobile && userRole && <div className="h-16" />}
    </>
  );
}
