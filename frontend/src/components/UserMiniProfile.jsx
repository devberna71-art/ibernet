import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Popover,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function UserMiniProfile({ membro }) {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!membro) return null;

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // se usares tokens específicos:
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 2,
          px: 1,
        }}
      >
        {/* MEU PERFIL */}
        <Chip
          onClick={handleOpenMenu}
          label="Meu Perfil"
          deleteIcon={<KeyboardArrowDownIcon />}
          onDelete={handleOpenMenu}
          sx={{
            height: 40,
            cursor: "pointer",
            fontWeight: 700,
            color: "#0f172a",
            background:
              "linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)",
            border: "1px solid rgba(148,163,184,.25)",
            boxShadow: "0 4px 20px rgba(15,23,42,.06)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 8px 24px rgba(15,23,42,.12)",
            },
          }}
        />

        {/* INFO UTILIZADOR */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0f172a",
              }}
            >
              {membro.nome}
            </Typography>

            <VerifiedIcon
              sx={{
                fontSize: 18,
                color: "#2563eb",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.4,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 4px rgba(34,197,94,.15)",
              }}
            />

            <Typography
              sx={{
                fontSize: ".78rem",
                fontWeight: 700,
                color: "#16a34a",
              }}
            >
              Online
            </Typography>
          </Box>
        </Box>

        {/* AVATAR */}
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Avatar
            src={membro.foto || ""}
            sx={{
              width: 62,
              height: 62,
              border: "3px solid white",
              boxShadow:
                "0 12px 35px rgba(15,23,42,.18)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "3px solid white",
              boxShadow: "0 0 0 4px rgba(34,197,94,.18)",
            }}
          />
        </Box>

        {/* BOTÃO SAIR PREMIUM */}
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            minWidth: 100,
            height: 44,
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            color: "#dc2626",
            background:
              "linear-gradient(135deg,#fff5f5 0%,#fee2e2 100%)",
            border: "1px solid rgba(239,68,68,.18)",
            boxShadow: "0 8px 20px rgba(239,68,68,.10)",
            "&:hover": {
              background:
                "linear-gradient(135deg,#fee2e2 0%,#fecaca 100%)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Sair
        </Button>
      </Box>

      {/* DROPDOWN PREMIUM */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 280,
            borderRadius: "22px",
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,.15)",
            boxShadow:
              "0 30px 80px rgba(15,23,42,.18)",
          },
        }}
      >
        <Card elevation={0}>
          <Box
            sx={{
              p: 2.5,
              background:
                "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {membro.nome}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.75)",
                fontSize: ".8rem",
                mt: 0.5,
              }}
            >
              Conta de membro ativa
            </Typography>
          </Box>

          <CardContent
            sx={{
              p: 1.5,
            }}
          >
            <Button
              fullWidth
              startIcon={<PersonIcon />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 700,
                color: "#0f172a",
                borderRadius: 3,
                py: 1.2,
              }}
            >
              Ver Perfil
            </Button>

            <Divider sx={{ my: 1 }} />

            <Button
              fullWidth
              startIcon={<LockResetIcon />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 700,
                color: "#dc2626",
                borderRadius: 3,
                py: 1.2,
              }}
            >
              Alterar Password
            </Button>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
}