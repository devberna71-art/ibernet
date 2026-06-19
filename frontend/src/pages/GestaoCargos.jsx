import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Avatar,
  Stack,
  Divider,
  LinearProgress
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PieChartIcon from "@mui/icons-material/PieChart";

import { motion } from "framer-motion";

import api from "../api/axiosConfig";
import FormCargos from "../components/FormCargos";
import AtribuirCargoMembro from "../components/AtribuirCargoMembro";

export default function GestaoCargos() {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openCargoModal, setOpenCargoModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [deletingCargo, setDeletingCargo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
  };

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/cargos");
      setCargos(res.data);
      setFilteredCargos(res.data);
    } catch {
      setSnackbar({ open: true, message: "Erro ao carregar cargos.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCargos(); }, []);
  
  useEffect(() => {
    setFilteredCargos(!search ? cargos : cargos.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())));
  }, [search, cargos]);

  // Estatísticas Calculadas Dinamicamente
  const stats = useMemo(() => {
    const totalCargos = cargos.length;
    const totalMembros = cargos.reduce((acc, curr) => acc + (curr.totalMembros || 0), 0);
    const mediaMembros = totalCargos > 0 ? (totalMembros / totalCargos).toFixed(1) : 0;
    
    let cargoMaisOcupado = { nome: "Nenhum", totalMembros: 0 };
    if (totalCargos > 0) {
      const topCargo = [...cargos].sort((a, b) => b.totalMembros - a.totalMembros)[0];
      if (topCargo && topCargo.totalMembros > 0) {
        cargoMaisOcupado = topCargo;
      }
    }

    return { totalCargos, totalMembros, mediaMembros, cargoMaisOcupado };
  }, [cargos]);

  const handleOpenNewCargo = () => { setEditingCargo(null); setOpenCargoModal(true); };
  const handleEditCargo = (cargo) => { setEditingCargo(cargo); setOpenCargoModal(true); };
  const handleDeleteClick = (cargo) => setDeletingCargo(cargo);
  
  const confirmDelete = async () => {
    try {
      await api.delete(`/cargos/${deletingCargo.id}`);
      setSnackbar({ open: true, message: "Cargo excluído com sucesso.", severity: "success" });
      setDeletingCargo(null);
      fetchCargos();
    } catch {
      setSnackbar({ open: true, message: "Erro ao excluir cargo.", severity: "error" });
    }
  };

  const cancelDelete = () => setDeletingCargo(null);
  const handleCloseModal = () => { setOpenCargoModal(false); setEditingCargo(null); };
  const closeSnack = () => setSnackbar(s => ({ ...s, open: false }));

  return (
    <Box sx={{
      minHeight: "100vh",
      pb: 10,
      px: { xs: 2, md: 4 },
      background: `radial-gradient(600px 300px at 10% 5%, rgba(0, 97, 255, 0.04), transparent),
                   radial-gradient(600px 300px at 90% 85%, rgba(0, 168, 255, 0.03), transparent),
                   #f8fafc`,
      color: "#0f172a",
      fontFamily: "'Poppins', sans-serif",
    }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3, mb: 5, flexWrap: "wrap" }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                background: "linear-gradient(90deg, #0041ca, #0061ff, #00a8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                letterSpacing: -0.5,
                mb: 1,
                backgroundSize: "200% auto",
                animation: "gradientFlow 6s ease infinite",
              }}
            >
              Gestão de Cargos
            </Typography>
            <Typography sx={{ color: "#475569", fontWeight: 500, fontSize: "0.95rem" }}>
              Acompanhe métricas, gerencie funções corporativas e distribua sua equipe de forma inteligente.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleOpenNewCargo}
              sx={{
                borderRadius: "12px",
                px: 3.5,
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(90deg, #0052d4, #0061ff)",
                boxShadow: "0 4px 20px rgba(0, 97, 255, 0.2)",
                color: "white",
                textTransform: "none",
                fontSize: "0.9rem",
                "&:hover": { 
                  transform: "translateY(-2px)", 
                  boxShadow: "0 8px 25px rgba(0, 97, 255, 0.35)",
                  background: "linear-gradient(90deg, #0041ca, #0052d4)",
                },
                transition: "all 0.2s ease"
              }}
            >
              Novo Cargo
            </Button>
            <TextField
              placeholder="Buscar cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 280,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "#ffffff",
                  color: "#0f172a",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: "#0061ff" },
                },
                "& .MuiInputBase-input": { pl: 1.5, fontSize: "0.9rem" },
              }}
            />
          </Box>
        </Box>

        {/* Seção de Estatísticas (Métricas Avançadas) */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { title: "Total de Cargos", value: stats.totalCargos, icon: <WorkIcon />, color: "#0061ff", subtitle: "Funções mapeadas" },
            { title: "Membros Alocados", value: stats.totalMembros, icon: <GroupIcon />, color: "#00a8ff", subtitle: "Colaboradores ativos" },
            { title: "Média por Cargo", value: `${stats.mediaMembros} memb.`, icon: <PieChartIcon />, color: "#3b82f6", subtitle: "Densidade organizacional" },
            { title: "Mais Ocupado", value: stats.cargoMaisOcupado.nome, icon: <LeaderboardIcon />, color: "#0041ca", subtitle: `${stats.cargoMaisOcupado.totalMembros || 0} membros ativos` },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #edf2f7",
                  boxShadow: "0 4px 18px rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Box sx={{ maxWidth: '70%' }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", tracking: 0.5 }}>{stat.title}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5, color: "#1e293b", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>{stat.subtitle}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${stat.color}10`, color: stat.color, width: 48, height: 48, borderRadius: "12px", border: `1px solid ${stat.color}20` }}>
                  {stat.icon}
                </Avatar>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "#e2e8f0", mb: 5 }} />

        {/* Listagem de Cargos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
            <CircularProgress size={50} thickness={4.5} sx={{ color: "#0061ff" }} />
          </Box>
        ) : filteredCargos.length === 0 ? (
          <Typography align="center" sx={{ mt: 8, color: "#64748b", fontWeight: 500 }}>
            Nenhum cargo encontrado.
          </Typography>
        ) : (
          <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="show">
            {filteredCargos.map((cargo, idx) => {
              const percentagemMembros = stats.totalMembros > 0 ? (cargo.totalMembros / stats.totalMembros) * 100 : 0;
              
              return (
                <Grid item xs={12} md={6} key={cargo.id} component={motion.div} variants={cardVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.015)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.25s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0, 97, 255, 0.08)",
                        borderColor: "#0061ff",
                      },
                    }}
                  >
                    {/* Header do Cargo */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2.5 }}>
                      <Avatar sx={{ background: "linear-gradient(135deg, #0061ff, #00a8ff)", width: 48, height: 48, borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,97,255,0.15)" }}>
                        <WorkIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, maxWidth: 'calc(100% - 100px)' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#0f172a", lineHeight: 1.3 }}>
                          {cargo.nome}
                        </Typography>
                        
                      </Box>

                      {/* Ações */}
                      <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditCargo(cargo)} sx={{ color: "#0061ff", bgcolor: "#0061ff08", p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#0061ff15" } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton onClick={() => handleDeleteClick(cargo)} sx={{ color: "#ef4444", bgcolor: "#ef444408", p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#ef444415" } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Descrição */}
                    <Typography variant="body2" sx={{ color: "#475569", mb: 3, minHeight: 40, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.875rem", lineHeight: 1.5 }}>
                      {cargo.descricao || "Nenhuma descrição fornecida para este cargo corporativo estruturado."}
                    </Typography>

                    {/* Barra de Distribuição Interna */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>Representação na Equipe</Typography>
                        <Typography variant="caption" sx={{ color: "#0061ff", fontWeight: 700 }}>{percentagemMembros.toFixed(0)}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentagemMembros > 0 ? Math.max(percentagemMembros, 5) : 0} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #0061ff, #00a8ff)" } }} 
                      />
                    </Box>

                    {/* Meta-dados inferiores */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2, borderTop: "1px solid #f1f5f9" }} justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <GroupIcon sx={{ color: "#94a3b8", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "#334155", fontWeight: 600 }}>
                          {cargo.totalMembros || 0} membro(s) alocado(s)
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon sx={{ color: "#94a3b8", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                          Última Alteração: {cargo.ultimoAtribuido ? new Date(cargo.ultimoAtribuido).toLocaleDateString("pt-BR") : "Sem histórico"}
                        </Typography>
                      </Stack>
                    </Stack>

                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Modal cadastro/edição */}
        <Dialog open={openCargoModal} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: "#ffffff", color: "#0f172a", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" } }}>
          <DialogTitle sx={{ color: "#0f172a", fontWeight: 700, px: 3, pt: 3 }}>{editingCargo ? "Editar Cargo" : "Cadastrar Novo Cargo"}</DialogTitle>
          <DialogContent dividers sx={{ borderColor: "#f1f5f9", px: 3 }}>
            <FormCargos
              cargo={editingCargo}
              onSuccess={() => { handleCloseModal(); fetchCargos(); setSnackbar({ open: true, message: `Cargo ${editingCargo ? "atualizado" : "cadastrado"} com sucesso!`, severity: "success" }); }}
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>

        {/* Modal confirmação exclusão */}
        <Dialog open={Boolean(deletingCargo)} onClose={cancelDelete} PaperProps={{ sx: { bgcolor: "#ffffff", color: "#0f172a", borderRadius: "16px" } }}>
          <DialogTitle sx={{ color: "#0f172a", fontWeight: 700 }}>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#475569" }}>
              Deseja realmente excluir o cargo <strong>{deletingCargo?.nome}</strong>? Essa operação é irreversível.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={cancelDelete} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>Cancelar</Button>
            <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: "10px", px: 3, textTransform: "none", fontWeight: 600, boxShadow: "none" }}>Excluir Cargo</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 6 }}>
          <AtribuirCargoMembro cargos={cargos} />
        </Box>

        {/* Snackbar Premium */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} sx={{ width: "100%", fontWeight: 600, borderRadius: "12px", background: snackbar.severity === "success" ? "#0061ff" : "#ef4444", color: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}