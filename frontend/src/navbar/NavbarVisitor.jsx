import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  AppBar,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
  Home,
  People,
  Assessment,
  Work,
  Build,
  AccountBalance,
  AccountCircle,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import logoBernet from "../assets/Logo-Bernet.png";

export default function NavbarVisitor({ toggleDrawer }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const safeClose = () => {
    if (typeof toggleDrawer === "function") {
      toggleDrawer(false)();
    }
  };

  // ================= MOBILE / TABLET =================
  if (isMobile) {
    return (
      <Box
        sx={{
          width: 280,
          background:
            "linear-gradient(180deg,#0f172a 0%, #1e293b 100%)",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 3,
            }}
          >
            <Box
              component="img"
              src={logoBernet}
              sx={{
                height: 95,
                objectFit: "contain",
              }}
            />
          </Box>

          <Divider
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              mb: 2,
            }}
          />

          <ListItem sx={{ mb: 2 }}>
            <Button
              component={Link}
              to="/criar/conta/membro"
              onClick={safeClose}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: "14px",

                background:
                  "linear-gradient(135deg,#10b981,#34d399)",

                color: "#fff",

                fontWeight: 700,

                textTransform: "none",

                fontSize: "15px",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#059669,#10b981)",
                },
              }}
            >
              Criar Conta
            </Button>
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Home />
            </ListItemIcon>
            <ListItemText
              primary="Início"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/sobre-equipe"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <People />
            </ListItemIcon>
            <ListItemText
              primary="Sobre a Equipa"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/planos"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText
              primary="Planos"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/testemunhos"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Assessment />
            </ListItemIcon>
            <ListItemText
              primary="Testemunhos"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/contato"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Work />
            </ListItemIcon>
            <ListItemText
              primary="Contacto"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/servicos"
            onClick={safeClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Build />
            </ListItemIcon>
            <ListItemText
              primary="Serviços"
              primaryTypographyProps={{
                color: "#fff",
              }}
            />
          </ListItem>

          <ListItem sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              onClick={safeClose}
              fullWidth
              startIcon={<AccountCircle />}
              sx={{
                py: 1.4,

                borderRadius: "14px",

                background:
                  "linear-gradient(135deg,#f59e0b,#f97316)",

                color: "#fff",

                fontWeight: 700,

                textTransform: "none",

                fontSize: "15px",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#ea580c,#f97316)",
                },
              }}
            >
              Login
            </Button>
          </ListItem>
        </List>
      </Box>
    );
  }

  // ================= DESKTOP PREMIUM =================
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background:
          "linear-gradient(135deg,#0f172a 0%, #1e293b 45%, #334155 100%)",

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        borderBottom: "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 12px 40px rgba(0,0,0,0.35)",

        height: 95,

        justifyContent: "center",

        zIndex: 1400,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "95px !important",
          px: 5,
        }}
      >
        {/* LOGO */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 7,
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={logoBernet}
            sx={{
              height: 85,

              transition: ".3s",

              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        {/* MENUS */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          {[
            { label: "Início", path: "/" },
            { label: "Sobre a Equipa", path: "/sobre-equipe" },
            { label: "Planos", path: "/planos" },
            { label: "Testemunhos", path: "/testemunhos" },
            { label: "Contacto", path: "/contato" },
            { label: "Serviços", path: "/servicos" },
          ].map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              disableRipple
              sx={{
                color: "#ffffff",

                fontSize: "16px",

                fontWeight: 600,

                textTransform: "none",

                letterSpacing: ".3px",

                position: "relative",

                "&:hover": {
                  background: "transparent",
                  color: "#ffffff",
                },

                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -6,
                  width: 0,
                  height: 2,

                  background:
                    "linear-gradient(90deg,#60a5fa,#93c5fd)",

                  transition: ".3s",
                },

                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* CRIAR CONTA */}
        <Button
          component={Link}
          to="/criar/conta/membro"
          variant="contained"
          sx={{
            mr: 2,

            px: 3.5,
            py: 1.4,

            borderRadius: "14px",

            fontSize: "15px",

            fontWeight: 700,

            textTransform: "none",

            color: "#fff",

            background:
              "linear-gradient(135deg,#10b981,#34d399)",

            boxShadow:
              "0 10px 25px rgba(16,185,129,.35)",

            "&:hover": {
              transform: "translateY(-2px)",

              background:
                "linear-gradient(135deg,#059669,#10b981)",
            },

            transition: ".3s",
          }}
        >
          Criar Conta
        </Button>

        {/* LOGIN */}
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            px: 3.5,
            py: 1.4,

            borderRadius: "14px",

            fontSize: "15px",

            fontWeight: 700,

            textTransform: "none",

            color: "#fff",

            background:
              "linear-gradient(135deg,#f59e0b,#f97316)",

            boxShadow:
              "0 10px 25px rgba(249,115,22,.35)",

            "&:hover": {
              transform: "translateY(-2px)",

              background:
                "linear-gradient(135deg,#ea580c,#f97316)",
            },

            transition: ".3s",
          }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}