
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

      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const whatsapp = () => {
    const msg = `🎉 Membro criado com sucesso!

👤 Nome: ${data.nome}
🔑 Senha: ${data.senhaInicial}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.65)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: "28px",
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "0 40px 100px rgba(15,23,42,.22)",
        }}
      >
        {/* FECHAR */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        {/* HEADER */}
        <Box
          sx={{
            p: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "22px",
              bgcolor: "#ecfdf5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 42,
                color: "#16a34a",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 24,
              color: "#0f172a",
            }}
          >
            Membro criado
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Conta criada com sucesso
          </Typography>
        </Box>

        {/* CONTEÚDO */}
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            Utilizador
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: "#0f172a",
              mb: 3,
            }}
          >
            {data.nome}
          </Typography>

          {/* SENHA */}
          <Box
            sx={{
              bgcolor: "#0f172a",
              color: "#fff",
              borderRadius: "20px",
              p: 2.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <KeyRoundedIcon
                  sx={{
                    color: "#22c55e",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    opacity: 0.7,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Senha Inicial
                </Typography>
              </Box>

              <Tooltip
                title={
                  copiado
                    ? "Copiado"
                    : "Copiar senha"
                }
              >
                <IconButton
                  onClick={copiarSenha}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,.08)",

                    "&:hover": {
                      bgcolor:
                        "rgba(255,255,255,.15)",
                    },
                  }}
                >
                  {copiado ? (
                    <CheckRoundedIcon />
                  ) : (
                    <ContentCopyIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              {data.senhaInicial}
            </Typography>
          </Box>

          {/* BOTÕES */}
          <Box
            sx={{
              display: "grid",
              gap: 1.2,
            }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={whatsapp}
              sx={{
                borderRadius: 3,
                py: 1.3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Enviar por WhatsApp
            </Button>

            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                borderRadius: 3,
                py: 1.3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Imprimir Credencial
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}