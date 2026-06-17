import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  CircularProgress,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

import api from "../api/axiosConfig";
import logoBernet from "../assets/Logo-Bernet.png";

import NavbarVisitor from "./NavbarVisitor";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";
import UserBadge from "../components/UserMiniProfile";

// Deve ser igual à largura real da sidebar
const DESKTOP_NAV_WIDTH = 340;

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
  const [membro, setMembro] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // ================= ROLE =================
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUserRole(null);
          return;
        }

        const res = await api.get("/usuario/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRole(res.data?.usuario?.funcao ?? null);
      } catch (error) {
        console.error(error);
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  // ================= PERFIL =================
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/meu-perfil");

        setMembro(res.data?.usuario?.membro || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerfil();
  }, []);

  // ================= LOADING =================
  if (userRole === undefined) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
          background: "#1e3a8a",
        }}
      >
        <CircularProgress
          size={24}
          sx={{
            color: "#fff",
          }}
        />
      </Box>
    );
  }

  return (
    <>
      {/* Corrige o deslocamento do conteúdo */}
      <GlobalStyles
        styles={{
          html: {
            margin: 0,
            padding: 0,
          },
          body: {
            margin: 0,
            padding: 0,
            paddingLeft: isMobile ? 0 : `${DESKTOP_NAV_WIDTH}px`,
            transition: "padding-left .25s ease",
            overflowX: "hidden",
          },
          "#root": {
            margin: 0,
            padding: 0,
          },
        }}
      />

      {/* ================= MOBILE ================= */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={3}
          sx={{
            background:
              "linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#60a5fa 100%)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Box
                component="img"
                src={logoBernet}
                alt="Logo"
                sx={{
                  height: 70,
                  display: "block",
                }}
              />
            </Box>

            {userRole && <UserBadge membro={membro} />}
          </Toolbar>
        </AppBar>
      )}

      {/* ================= DESKTOP ================= */}
      {!isMobile &&
        (userRole ? (
          <NavbarDesktop
            userRole={userRole}
            membro={membro}
          />
        ) : (
          <NavbarVisitor />
        ))}

      {/* ================= DRAWER MOBILE ================= */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {userRole ? (
          <NavbarMobile
            userRole={userRole}
            toggleDrawer={toggleDrawer}
          />
        ) : (
          <NavbarVisitor
            toggleDrawer={toggleDrawer}
          />
        )}
      </Drawer>

      {/* Espaço APENAS para AppBar Mobile */}
      {isMobile && <Toolbar />}
    </>
  );
}