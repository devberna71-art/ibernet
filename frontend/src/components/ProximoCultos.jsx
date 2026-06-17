import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  Box,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";

import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

export default function ProximosCultos() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      setLoading(true);
      const res = await api.get("/cultos/proximos");
      setDados(res.data?.proximosCultos || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const corPresenca = (v) => {
    if (v === 0) return "#94A3B8";
    if (v < 50) return "#F59E0B";
    return "#16A34A";
  };

  const formatDiaCurto = (d) => (d ? d.slice(0, 3).toUpperCase() : "");

  if (loading) {
    return (
      <Box sx={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "28px",
        border: "1px solid #EEF2F6",
        background: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <CircularProgress size={26} sx={{ color: "#4F46E5" }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      borderRadius: "28px",
      background: "#FFFFFF",
      border: "1px solid #EEF2F6",
      overflow: "hidden",

      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* HEADER */}
      <Box sx={{
        px: 3,
        py: 2.8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #F1F5F9",
      }}>
        <Box>
          <Typography sx={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#0F172A",
          }}>
            Próximos Cultos
          </Typography>

          <Typography sx={{
            fontSize: 13,
            color: "#64748B",
            mt: 0.5,
            fontWeight: 500,
          }}>
            Agenda organizada dos eventos da igreja
          </Typography>
        </Box>

        <Box sx={{
          width: 44,
          height: 44,
          borderRadius: "14px",
          background: "linear-gradient(135deg,#F8FAFC,#EEF2F6)",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <GroupRoundedIcon sx={{ fontSize: 20, color: "#0F172A" }} />
        </Box>
      </Box>

      {/* LISTA */}
      <Box sx={{ p: 2.4 }}>
        <Stack spacing={1.1}>

          {dados.map((culto) => (
            <Box
              key={culto.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                px: 2.2,
                py: 1.8,
                borderRadius: "18px",

                background: "rgba(255,255,255,0.9)",
                border: "1px solid transparent",

                transition: "all .22s ease",

                "&:hover": {
                  background: "#F8FAFC",
                  border: "1px solid #EAECEF",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                },
              }}
            >

              {/* LEFT */}
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.6,
                flex: 1,
              }}>

                {/* CHIP PREMIUM */}
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "16px",
                  position: "relative",
                  overflow: "hidden",

                  background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                  boxShadow: "0 14px 30px rgba(37,99,235,0.25)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {/* shine */}
                  <Box sx={{
                    position: "absolute",
                    top: -25,
                    left: -25,
                    width: 70,
                    height: 70,
                    background: "rgba(255,255,255,0.18)",
                    transform: "rotate(25deg)",
                    filter: "blur(10px)",
                  }} />

                  <Typography sx={{
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: 1.3,
                    color: "#fff",
                    zIndex: 2,
                  }}>
                    {formatDiaCurto(culto.diaSemana)}
                  </Typography>
                </Box>

                {/* TEXTO */}
                <Box>
                  <Typography sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0F172A",
                    letterSpacing: "-0.3px",
                  }}>
                    {culto.tipo}
                  </Typography>

                  <Typography sx={{
                    fontSize: 12.5,
                    color: "#64748B",
                    fontWeight: 500,
                  }}>
                    {culto.diaSemana}
                  </Typography>
                </Box>
              </Box>

              {/* RIGHT */}
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 110,
                justifyContent: "flex-end",
              }}>
                <GroupRoundedIcon sx={{
                  fontSize: 20,
                  color: corPresenca(culto.ultimaPresencaTipoCulto),
                }} />

                <Typography sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0F172A",
                }}>
                  {culto.ultimaPresencaTipoCulto}
                </Typography>
              </Box>

            </Box>
          ))}

        </Stack>
      </Box>
    </Box>
  );
}