import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";

export default function MembroCriadoCard({ data, onClose }) {
  const [copiado, setCopiado] = useState(false);

  const copiarSenha = async () => {
    try {
      await navigator.clipboard.writeText(data.senhaInicial);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const whatsapp = () => {
    const msg = `🎉 Membro criado com sucesso!\n\n👤 Nome: ${data.nome}\n🔑 Senha: ${data.senhaInicial}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        p: 2,
        animation: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: "28px",
          bgcolor: "rgba(255, 255, 255, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 30px 70px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          animation: "scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          "@keyframes scaleUp": {
            "0%": { transform: "scale(0.92) translateY(10px)", opacity: 0 },
            "100%": { transform: "scale(1) translateY(0)", opacity: 1 },
          },
        }}
      >
        {/* BOTÃO FECHAR CUSTOMIZADO */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "#64748b",
            bgcolor: "rgba(15, 23, 42, 0.04)",
            border: "1px solid rgba(15, 23, 42, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              color: "#0f172a",
              bgcolor: "rgba(15, 23, 42, 0.08)",
              transform: "rotate(90deg) scale(1.05)",
            },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>

        {/* HEADER ILUMINADO */}
        <Box sx={{ pt: 6, pb: 3, px: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "24px",
              background: "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              mb: 3,
              boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)",
              animation: "pulseIcon 2s infinite alternate",
              "@keyframes pulseIcon": {
                "0%": { transform: "scale(1)" },
                "100%": { transform: "scale(1.03)" },
              }
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 36, color: "#14532d" }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: "1.6rem",
              background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
            }}
          >
            Membro Criado
          </Typography>

          <Typography sx={{ color: "#64748b", mt: 0.8, fontSize: "0.95rem", fontWeight: 500 }}>
            Credenciais geradas e prontas.
          </Typography>
        </Box>

        {/* CORPO DO CARD */}
        <Box sx={{ px: 4, pb: 5 }}>
          
          {/* IDENTIFICAÇÃO DO UTILIZADOR */}
          <Box 
            sx={{ 
              mb: 3, 
              p: 2.5, 
              bgcolor: "rgba(15, 23, 42, 0.03)", 
              borderRadius: "18px", 
              border: "1px solid rgba(15, 23, 42, 0.05)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#94a3b8",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Nome do Utilizador
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#0f172a", letterSpacing: "-0.01em" }}>
              {data.nome}
            </Typography>
          </Box>

          {/* ÁREA DA SENHA VIP */}
          <Box
            sx={{
              background: "linear-gradient(145deg, #020617 0%, #0f172a 100%)",
              color: "#fff",
              borderRadius: "22px",
              p: 3,
              mb: 4,
              boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.4)",
              position: "relative",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: "#22c55e", borderRadius: "50%" }} />
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Senha de Acesso
                </Typography>
              </Box>

              <Tooltip title={copiado ? "Copiado!" : "Copiar"} arrow placement="top">
                <IconButton
                  onClick={copiarSenha}
                  size="small"
                  sx={{
                    color: copiado ? "#4ade80" : "#94a3b8",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      color: "#fff",
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      transform: "scale(1.08)",
                    },
                  }}
                >
                  {copiado ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                background: "linear-gradient(120deg, #ffffff 0%, #cbd5e1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {data.senhaInicial}
            </Typography>
          </Box>

          {/* GRUPO DE BOTÕES MODERNOS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={whatsapp}
              sx={{
                borderRadius: "16px",
                py: 1.6,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.98rem",
                bgcolor: "#00e676",
                color: "#052e16",
                boxShadow: "0 6px 20px rgba(0, 230, 118, 0.25)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  bgcolor: "#00c853",
                  boxShadow: "0 10px 25px rgba(0, 230, 118, 0.35)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Enviar para WhatsApp
            </Button>

            <Button
              variant="text"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                borderRadius: "16px",
                py: 1.4,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#475569",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#0f172a",
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Imprimir Documento
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}