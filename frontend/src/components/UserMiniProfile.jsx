import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Popover,
  Divider,
  Button,
  IconButton,
  TextField,
  Stack,
  InputAdornment,
  Alert,
  Badge,
  styled,
  Fade,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Perfil from "../pages/Perfil";
import api from "../api/axiosConfig";


// ======================================
// BADGE ONLINE PREMIUM
// ======================================

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    background:
      "linear-gradient(135deg, #00ff99, #00c853)",
    color: "#00ff99",
    boxShadow:
      "0 0 0 3px white, 0 0 15px rgba(0,255,153,.8)",
    width: 14,
    height: 14,
    borderRadius: "50%",

    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "2px solid currentColor",
      content: '""',
      animation: "ripple 1.8s infinite",
    },
  },

  "@keyframes ripple": {
    "0%": {
      transform: "scale(.7)",
      opacity: 1,
    },

    "100%": {
      transform: "scale(2.8)",
      opacity: 0,
    },
  },
}));



// ======================================
// COMPONENTE
// ======================================

export default function UserMiniProfile({
  membro,
}) {

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [profileAnchorEl,
    setProfileAnchorEl] =
    useState(null);


  const [viewMode,
    setViewMode] =
    useState("perfil");


  const [passwords,
    setPasswords] =
    useState({
      senhaAtual: "",
      novaSenha: "",
    });


  const [showPassword,
    setShowPassword] =
    useState(false);


  const [feedback,
    setFeedback] =
    useState(null);


  if (!membro) return null;


  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

    return (
    <>
      {/* ============================
          BOTÃO PERFIL PREMIUM
      ============================ */}
      <Box
        onClick={handleOpenMenu}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.8,
          px: 1.5,
          py: 1,
          cursor: "pointer",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.85))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow:
            "0 10px 35px rgba(15,23,42,.12)",
          transition: "all .35s ease",
          
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow:
              "0 18px 45px rgba(15,23,42,.18)",
            background:
              "linear-gradient(135deg,#ffffff,#f8fafc)",
          },
        }}
      >

        {/* Avatar */}
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar
            src={membro.foto || ""}
            sx={{
              width: 55,
              height: 55,
              borderRadius: "18px",
              border: "3px solid white",
              boxShadow:
                "0 8px 20px rgba(0,0,0,.15)",
            }}
          />
        </StyledBadge>


        {/* Dados */}
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: ".92rem",
              color: "#0f172a",
              letterSpacing: ".3px",
            }}
          >
            {membro.nome}
          </Typography>


          <Typography
            sx={{
              color: "#10b981",
              fontSize: ".75rem",
              fontWeight: 700,
              mt: .3,
            }}
          >
            ● Online agora
          </Typography>

        </Box>


        <KeyboardArrowDownIcon
          sx={{
            color: "#64748b",
            fontSize: 26,
            transition: ".3s",

            ".MuiBox-root:hover &": {
              transform: "rotate(180deg)",
            }
          }}
        />

      </Box>



      {/* ============================
          MENU PREMIUM
      ============================ */}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}

        TransitionComponent={Fade}

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}

        PaperProps={{
          sx: {
            mt: 1.5,
            width: 260,
            p: 1.5,
            borderRadius: "24px",

            background:
              "rgba(255,255,255,.75)",

            backdropFilter:
              "blur(25px)",

            border:
              "1px solid rgba(255,255,255,.8)",

            boxShadow:
              "0 25px 60px rgba(15,23,42,.20)",

            overflow: "hidden",
          }
        }}
      >

        {/* Cabeçalho do menu */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
          }}
        >

          <Avatar
            src={membro.foto || ""}
            sx={{
              width: 75,
              height: 75,
              mx: "auto",
              mb: 1,
              border: "4px solid white",
              boxShadow:
                "0 12px 30px rgba(0,0,0,.18)",
            }}
          />

          <Typography
            fontWeight={800}
            color="#0f172a"
          >
            {membro.nome}
          </Typography>


          <Typography
            fontSize=".75rem"
            color="#64748b"
          >
            Conta Premium
          </Typography>

        </Box>


        <Divider sx={{ mb: 1 }} />


        {/* Ver Perfil */}
        <Button
          fullWidth
          startIcon={<PersonIcon />}

          onClick={() => {
            setProfileAnchorEl(anchorEl);
            setViewMode("perfil");
            handleCloseMenu();
          }}

          sx={{
            justifyContent: "flex-start",
            py: 1.3,
            borderRadius: "15px",
            textTransform: "none",
            fontWeight: 700,
            color: "#334155",

            "&:hover": {
              background:
                "rgba(59,130,246,.12)",
              transform:
                "translateX(5px)",
            },
          }}
        >
          Meu Perfil
        </Button>



        {/* Segurança */}
        <Button
          fullWidth
          startIcon={<LockResetIcon />}

          onClick={() => {
            setProfileAnchorEl(anchorEl);
            setViewMode("senha");
            handleCloseMenu();
          }}

          sx={{
            justifyContent: "flex-start",
            py: 1.3,
            borderRadius: "15px",
            textTransform: "none",
            fontWeight: 700,
            color: "#334155",

            "&:hover": {
              background:
                "rgba(168,85,247,.12)",
              transform:
                "translateX(5px)",
            },
          }}
        >
          Segurança
        </Button>


        <Divider sx={{ my: 1 }} />


        {/* Logout */}
        <Button
          fullWidth
          startIcon={<LogoutIcon />}

          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}

          sx={{
            justifyContent: "flex-start",
            py: 1.3,
            borderRadius: "15px",
            textTransform: "none",
            fontWeight: 800,
            color: "#ef4444",

            "&:hover": {
              background:
                "rgba(239,68,68,.12)",
              transform:
                "translateX(5px)",
            },
          }}
        >
          Terminar Sessão
        </Button>

      </Popover>

            {/* ============================
          MODAL PERFIL PREMIUM
      ============================ */}

      <Popover
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        onClose={() => setProfileAnchorEl(null)}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 2,
            width: {
              xs: "95vw",
              sm: 430,
            },
            borderRadius: "30px",
            overflow: "hidden",
            background:
              "rgba(255,255,255,.92)",
            backdropFilter:
              "blur(30px)",
            boxShadow:
              "0 30px 80px rgba(15,23,42,.30)",
            border:
              "1px solid rgba(255,255,255,.7)",
          },
        }}
      >

        {/* CABEÇALHO PREMIUM */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #0f172a, #2563eb, #06b6d4)",
            color: "white",
            textAlign: "center",
            py: 3,
            position: "relative",
          }}
        >

          <IconButton
            onClick={() => setProfileAnchorEl(null)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "white",
              background:
                "rgba(255,255,255,.15)",

              "&:hover": {
                background:
                  "rgba(255,255,255,.25)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>


          <Avatar
            src={membro.foto || ""}
            sx={{
              width: 90,
              height: 90,
              mx: "auto",
              mb: 1,
              border: "4px solid white",
              boxShadow:
                "0 15px 35px rgba(0,0,0,.35)",
            }}
          />


          <Typography
            fontWeight="900"
            fontSize="1.3rem"
          >
            {membro.nome}
          </Typography>


          <Typography
            sx={{
              opacity: .85,
              fontSize: ".85rem",
            }}
          >
            Área pessoal segura
          </Typography>

        </Box>



        {/* CONTEÚDO */}
        <Box sx={{ p: 3 }}>

          {
            feedback && (

              <Alert
                severity={feedback.type}
                sx={{
                  mb: 2,
                  borderRadius: "15px",
                  fontWeight: 700,
                }}
              >
                {feedback.text}
              </Alert>

            )
          }



          {
            viewMode === "perfil" ? (

              <Perfil membro={membro} />

            ) : (


              <Stack spacing={2.3}>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#0f172a",
                  }}
                >
                  Alterar Credenciais
                </Typography>


                {/* Senha Atual */}
                <TextField
                  label="Senha Atual"
                  type="password"
                  variant="outlined"
                  fullWidth

                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      senhaAtual:
                        e.target.value,
                    })
                  }

                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                    },
                  }}
                />


                {/* Nova Senha */}
                <TextField
                  label="Nova Senha"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  variant="outlined"
                  fullWidth

                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      novaSenha:
                        e.target.value,
                    })
                  }


                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">

                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >

                          {
                            showPassword
                              ? <VisibilityOff />
                              : <Visibility />
                          }

                        </IconButton>

                      </InputAdornment>
                    ),
                  }}


                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                    },
                  }}

                />



                {/* BOTÃO SALVAR */}
                <Button

                  variant="contained"

                  onClick={async () => {

                    try {

                      await api.put(
                        "/meu-perfil",
                        passwords
                      );

                      setFeedback({
                        type: "success",
                        text:
                          "Credenciais atualizadas com sucesso!",
                      });


                      setPasswords({
                        senhaAtual: "",
                        novaSenha: "",
                      });


                    } catch {

                      setFeedback({
                        type: "error",
                        text:
                          "Não foi possível atualizar a senha.",
                      });

                    }

                  }}


                  sx={{
                    mt: 1,
                    py: 1.6,
                    borderRadius: "18px",
                    fontWeight: 800,
                    fontSize: ".95rem",

                    background:
                      "linear-gradient(135deg,#0f172a,#2563eb)",

                    boxShadow:
                      "0 12px 30px rgba(37,99,235,.45)",

                    textTransform:
                      "none",

                    transition:
                      ".35s",

                    "&:hover": {
                      transform:
                        "translateY(-3px)",

                      boxShadow:
                        "0 18px 40px rgba(37,99,235,.55)",

                      background:
                        "linear-gradient(135deg,#020617,#1d4ed8)",
                    },

                  }}

                >

                  Atualizar Credenciais

                </Button>

              </Stack>

            )

          }

        </Box>

      </Popover>

    </>
  );

}