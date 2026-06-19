import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Grid,
  useTheme,
  InputAdornment
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";

import api from "../api/axiosConfig";
import FormTipoContribuicao from "../components/FormTipoContribuicao";

import { motion } from "framer-motion";

export default function GestaoContribuicoes() {
  const theme = useTheme();
  const [tipos, setTipos] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openTipoModal, setOpenTipoModal] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTipos();
  }, []);

  const filteredTipos = useMemo(() => {
    if (!search) return tipos;
    return tipos.filter((t) => 
      (t.nome || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tipos]);

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/tipos-contribuicao");
      if (res.data && res.data.tipos) {
        setTipos(res.data.tipos || []);
        setDashboardData(res.data.dashboard);
      } else {
        setTipos(res.data || []);
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao carregar dados do painel.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovoTipo = () => {
    setTipoEditando(null);
    setOpenTipoModal(true);
  };

  const abrirModalEditarTipo = (tipo) => {
    setTipoEditando(tipo);
    setOpenTipoModal(true);
  };

  const deletarTipo = async (id) => {
    try {
      await api.delete(`/tipos-contribuicao/${id}`);
      fetchTipos();
      setSnackbar({ open: true, message: "Tipo de contribuição excluído com sucesso.", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao excluir tipo.", severity: "error" });
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor !== "number" || isNaN(valor)) return "Kz 0,00";
    return `Kz ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  // Sombras Premium Estilo Apple / Stripe (Deep Soft Shadows)
  const premiumShadow = "0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 20px 40px -10px rgba(0, 0, 0, 0.03), inset 0 0 0 1px rgba(255, 255, 255, 0.6)";
  const premiumHoverShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.15)";

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, type: "spring", stiffness: 140, damping: 16 },
    }),
  };

  const maxReceitaGrafico = tipos.length > 0 ? Math.max(...tipos.map(t => t.receitaTotal), 1) : 1;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 10,
        fontFamily: "'Inter', 'Poppins', sans-serif",
        // Fundo branco suave (Off-White) com gradientes de iluminação ambiente surreais
        background: `radial-gradient(800px 600px at 10% 10%, rgba(99, 102, 241, 0.04), transparent),
                     radial-gradient(800px 600px at 90% 80%, rgba(45, 212, 191, 0.03), transparent),
                     #F8F9FA`,
        color: "#1E293B",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 7 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6, flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #0F172A 0%, #312E81 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Gestão de Contribuições
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
              Controle financeiro avançado com métricas de alta fidelidade.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              placeholder="Buscar tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 280,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                  border: "1px solid #E2E8F0",
                  transition: "all 0.2s ease",
                  "& fieldset": { border: "none" },
                  "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" },
                  "&.Mui-focused": { border: "1px solid #6366F1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.12)" }
                },
                "& .MuiInputBase-input": { color: "#334155", pl: 0.5, fontWeight: 500 },
              }}
            />
            <Button
              startIcon={<AddIcon />}
              onClick={abrirModalNovoTipo}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                color: "#FFFFFF",
                textTransform: "none",
                fontSize: "0.92rem",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
                  background: "linear-gradient(135deg, #4338CA 0%, #2E2528 100%)",
                },
              }}
            >
              Novo Tipo
            </Button>
          </Box>
        </Box>

        {/* METRIC CARDS */}
        {dashboardData && (
          <Box component={motion.div} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }} sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: "16px", background: "#FFFFFF", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.02)" }}>
                  <Typography variant="caption" sx={{ color: "#4F46E5", fontWeight: 700, display: "block", mb: 1, letterSpacing: "0.05em" }}>RECEITA TOTAL</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.6rem" }}>{formatarValor(dashboardData.receitaTotal)}</Typography>
                  <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                    <TrendingUpIcon fontSize="small" /> +{dashboardData.crescimentoMensal}% este mês
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: "16px", background: "#FFFFFF", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.02)" }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1, letterSpacing: "0.05em" }}>CATEGORIAS</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.6rem" }}>{dashboardData.totalTipos} Tipos</Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", mt: 1, display: "block", fontWeight: 500 }}>Cadastrados no sistema</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: "16px", background: "#FFFFFF", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.02)" }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1, letterSpacing: "0.05em" }}>STATUS DOS TIPOS</Typography>
                  <Box sx={{ display: "flex", gap: 4, mt: 0.5 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#10B981" }}>{dashboardData.tiposAtivos}</Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500 }}>Ativos</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#EF4444" }}>{dashboardData.tiposInativos}</Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500 }}>Inativos</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, borderRadius: "16px", background: "#FFFFFF", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.02)" }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1, letterSpacing: "0.05em" }}>TOTAL DE MEMBROS</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 1, fontSize: "1.6rem" }}>
                    <PeopleIcon sx={{ color: "#4F46E5", fontSize: 24 }} /> {dashboardData.numeroMembros}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mt: 1, fontWeight: 500 }}>Contribuidores ativos</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 2.5, borderRadius: "16px", background: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.01)", display: "flex", alignItems: "center", gap: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(14, 165, 233, 0.08)", color: "#0EA5E9", display: "flex" }}><StarIcon /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block" }}>MAIOR CONTRIBUIÇÃO REGISTRADA</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0EA5E9", mt: 0.25 }}>{formatarValor(dashboardData.maiorContribuicao)}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Paper component={motion.div} variants={cardVariants} sx={{ p: 2.5, borderRadius: "16px", background: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.01)", display: "flex", alignItems: "center", gap: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(99, 102, 241, 0.08)", color: "#4F46E5", display: "flex" }}><AccountBalanceWalletIcon /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block" }}>CONTRIBUIÇÃO MÉDIA</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#4F46E5", mt: 0.25 }}>{formatarValor(dashboardData.contribuicaoMedia)}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* SECTION GRÁFICO DE BARRAS HORIZONTAIS */}
        {tipos.length > 0 && (
          <Paper sx={{ p: 4, mb: 6, borderRadius: "20px", background: "#FFFFFF", boxShadow: premiumShadow, border: "1px solid rgba(0,0,0,0.01)" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3.5, color: "#0F172A", letterSpacing: "-0.01em", fontSize: "1.1rem" }}>📊 Distribuição de Receita</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {tipos.map((tipo) => {
                const percentual = (tipo.receitaTotal / maxReceitaGrafico) * 100;
                return (
                  <Box key={tipo.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, fontSize: "0.9rem" }}>
                      <Typography sx={{ fontWeight: 600, color: "#334155" }}>{tipo.nome}</Typography>
                      <Typography sx={{ fontWeight: 700, color: "#4F46E5" }}>{formatarValor(tipo.receitaTotal)}</Typography>
                    </Box>
                    <Box sx={{ width: "100%", bgcolor: "#F1F5F9", borderRadius: "99px", height: 8, overflow: "hidden" }}>
                      <Box sx={{
                        height: "100%",
                        width: `${percentual}%`,
                        borderRadius: "99px",
                        background: "linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)",
                        transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}

        {/* LISTAGEM DOS TIPOS */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#0F172A", letterSpacing: "-0.01em", fontSize: "1.3rem" }}>Categorias Detalhadas</Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={48} thickness={4.5} sx={{ color: "#4F46E5" }} />
          </Box>
        ) : filteredTipos.length === 0 ? (
          <Typography align="center" sx={{ mt: 8, color: "#64748B", fontWeight: 500 }}>
            Nenhum tipo de contribuição encontrado.
          </Typography>
        ) : (
          filteredTipos.map((tipo, idx) => (
            <motion.div key={tipo.id} custom={idx} initial="hidden" animate="show" variants={listItemVariants}>
              <Paper
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: premiumShadow,
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: premiumHoverShadow,
                    borderColor: "transparent"
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#0F172A", letterSpacing: "-0.01em" }}>
                      {tipo.nome}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "6px",
                        display: "inline-block",
                        background: tipo.ativo ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: tipo.ativo ? "#10B981" : "#EF4444",
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {tipo.ativo ? "Ativo" : "Inativo"}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Ver Histórico">
                      <IconButton sx={{ color: "#64748B", "&:hover": { color: "#0284C7", background: "rgba(2, 132, 199, 0.06)" } }}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => abrirModalEditarTipo(tipo)} sx={{ color: "#64748B", "&:hover": { color: "#4F46E5", background: "rgba(79, 70, 229, 0.06)" } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => deletarTipo(tipo.id)} sx={{ color: "#64748B", "&:hover": { color: "#EF4444", background: "rgba(239, 68, 68, 0.06)" } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ pt: 2, borderTop: "1px solid #F1F5F9" }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", fontWeight: 600, mb: 0.5 }}>RECEITA TOTAL</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>{formatarValor(tipo.receitaTotal)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", fontWeight: 600, mb: 0.5 }}>RECEITA MÉDIA</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>{formatarValor(tipo.receitaMedia)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", fontWeight: 600, mb: 0.5 }}>MAIOR CONTRIBUIÇÃO</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0EA5E9" }}>{formatarValor(tipo.maiorContribuicao)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))
        )}

        {/* Modal cadastrar/editar */}
        <Dialog
          open={openTipoModal}
          onClose={() => setOpenTipoModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              color: "#1E293B",
              background: "#FFFFFF",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              p: 1
            },
          }}
        >
          <DialogTitle sx={{ color: "#0F172A", fontWeight: 700, fontSize: "1.25rem", borderBottom: "1px solid #F1F5F9" }}>
            {tipoEditando ? "Editar Tipo de Contribuição" : "Cadastrar Tipo de Contribuição"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2, border: "none" }}>
            <FormTipoContribuicao
              tipo={tipoEditando}
              onSuccess={() => {
                setOpenTipoModal(false);
                fetchTipos();
                setSnackbar({ open: true, message: `Tipo ${tipoEditando ? "editado" : "criado"} com sucesso!`, severity: "success" });
              }}
              onCancel={() => setOpenTipoModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Snackbar Premium */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: "14px",
              fontWeight: 600,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              background: "#FFFFFF",
              color: "#1E293B",
              borderLeft: `6px solid ${snackbar.severity === "success" ? "#10B981" : "#EF4444"}`,
              "& .MuiAlert-icon": {
                color: snackbar.severity === "success" ? "#10B981" : "#EF4444"
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}