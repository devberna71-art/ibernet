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
    background: "#5C8A5C",
    color: "#5C8A5C",
    boxShadow: "0 0 0 2px white",
    width: 10,
    height: 10,
    borderRadius: "50%",
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
          gap: 1.5,
          px: 1.5,
          py: 1,
          cursor: "pointer",
          borderRadius: "10px",
          background: "#FFFFFF",
          border: "1px solid #ECE5D8",
          boxShadow: "0 2px 8px rgba(33,29,25,0.05)",
          transition: "all .2s ease",
          "&:hover": {
            background: "#FBE3CF",
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
              fontWeight: 600,
              fontSize: ".875rem",
              color: "#211D19",
            }}
          >
            {membro.nome}
          </Typography>


          <Typography
            sx={{
              color: "#5C8A5C",
              fontSize: ".75rem",
              fontWeight: 500,
              mt: .3,
            }}
          >
            ● Online agora
          </Typography>

        </Box>


        <KeyboardArrowDownIcon
          sx={{
            color: "#8B8378",
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

            background: "#FFFFFF",
            border: "1px solid #ECE5D8",
            boxShadow: "0 2px 8px rgba(33,29,25,0.05)",

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
            color: "#211D19",

            "&:hover": {
              background: "#FBE3CF",
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
            color: "#211D19",

            "&:hover": {
              background: "#FBE3CF",
              transform:
                "translateX(5px)",
            },
          }}
        >
          Alterar password
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
            color: "#B5332C",

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
              "#D97A4D",
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

                    background: "#D97A4D",
                    boxShadow: "none",
                    "&:hover": { background: "#C56A3F", boxShadow: "none" },

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