// src/pages/GestaoDepartamentos.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Grid,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BusinessIcon from "@mui/icons-material/Business";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import FunctionsIcon from "@mui/icons-material/Functions";
import api from "../api/axiosConfig";
import FormDepartamento from "../components/FormDepartamento";

export default function GestaoDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchDepartamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/departamentos-membros");
      setDepartamentos(res.data);
      setFilteredDepartamentos(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar departamentos.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (!search) setFilteredDepartamentos(departamentos);
    else
      setFilteredDepartamentos(
        departamentos.filter((d) =>
          d.nome.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, departamentos]);

  // Cálculos automáticos para os Cards e Mini Dashboard
  const estatisticas = useMemo(() => {
    const totalDeps = departamentos.length;
    
    const totalMembros = departamentos.reduce(
      (acc, curr) => acc + (Number(curr.totalMembros) || 0), 
      0
    );

    const mediaMembros = totalDeps > 0 ? (totalMembros / totalDeps).toFixed(1) : 0;

    let maiorDep = "Nenhum";
    let maxMembros = -1;
    let menorDep = "Nenhum";
    let minMembros = Infinity;

    departamentos.forEach((dep) => {
      const membros = Number(dep.totalMembros) || 0;
      
      if (membros > maxMembros) {
        maxMembros = membros;
        maiorDep = dep.nome;
      }
      
      if (membros < minMembros) {
        minMembros = membros;
        menorDep = dep.nome;
      }
    });

    // Se não houver departamentos, ajusta o menor para o padrão
    if (totalDeps === 0) menorDep = "Nenhum";

    // Filtra locais válidos e remove duplicados
    const locaisUnicos = new Set(
      departamentos
        .map((dep) => dep.local?.trim())
        .filter((local) => local && local.toLowerCase() !== "não informado")
    );
    const totalLocais = locaisUnicos.size;

    return { totalDeps, totalMembros, mediaMembros, maiorDep, menorDep, totalLocais };
  }, [departamentos]);

  const abrirModalNovo = () => {
    setDepartamentoEditando(null);
    setOpenModal(true);
  };

  const abrirModalEditar = (dep) => {
    setDepartamentoEditando(dep);
    setOpenModal(true);
  };

  const deletarDepartamento = async (id) => {
    try {
      await api.delete(`/departamentos/${id}`);
      fetchDepartamentos();
      setSnackbar({
        open: true,
        message: "Departamento excluído com sucesso.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao excluir departamento.",
        severity: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Título Premium com Gradiente */}
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        sx={{
          textAlign: "center",
          mb: 4,
          background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Gestão de Departamentos
      </Typography>

      {/* 1. Cards de Resumo no Topo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: Total de Departamentos */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #7c4dff 0%, #4a148c 100%)", color: "#fff" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: "bold" }}>Total Departamentos</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{estatisticas.totalDeps}</Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Card 2: Total de Membros */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #00e5ff 0%, #006064 100%)", color: "#fff" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: "bold" }}>Total de Membros</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{estatisticas.totalMembros}</Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Card 3: Maior Departamento */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #ff1744 0%, #b71c1c 100%)", color: "#fff" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ maxWidth: "75%" }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: "bold" }}>Maior Departamento</Typography>
                    <Typography variant="h6" fontWeight="bold" noWrap sx={{ mt: 1 }}>{estatisticas.maiorDep}</Typography>
                  </Box>
                  <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Card 4: Locais Diferentes */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #ffea00 0%, #f57f17 100%)", color: "#fff" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: "bold" }}>Locais Diferentes</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{estatisticas.totalLocais}</Typography>
                  </Box>
                  <LocationOnIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* 2. Mini Dashboard / Card de Estatísticas Gerais */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card 
          sx={{ 
            borderRadius: 4, 
            mb: 5, 
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
            background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
            border: "1px solid rgba(0,0,0,0.04)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <EqualizerIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Estatísticas Gerais (Dashboard)
              </Typography>
            </Stack>
            
            <Grid container spacing={4} divider={<Divider orientation="vertical" flexItem />}>
              {/* Métrica A */}
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ bgcolor: "rgba(124,77,255,0.1)", p: 1.5, borderRadius: 3 }}>
                    <BusinessIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">Departamentos Ativos</Typography>
                    <Typography variant="h6" fontWeight="bold">{estatisticas.totalDeps} ativos</Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Métrica B */}
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ bgcolor: "rgba(0,229,255,0.1)", p: 1.5, borderRadius: 3 }}>
                    <FunctionsIcon sx={{ color: "#00e5ff" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">Média de Membros</Typography>
                    <Typography variant="h6" fontWeight="bold">{estatisticas.mediaMembros} / dep</Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Métrica C */}
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ bgcolor: "rgba(255,23,68,0.1)", p: 1.5, borderRadius: 3 }}>
                    <TrendingUpIcon sx={{ color: "#ff1744" }} />
                  </Box>
                  <Box sx={{ maxWidth: "75%" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">Maior Departamento</Typography>
                    <Typography variant="h6" fontWeight="bold" noWrap>{estatisticas.maiorDep}</Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Métrica D */}
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ bgcolor: "rgba(245,127,23,0.1)", p: 1.5, borderRadius: 3 }}>
                    <TrendingDownIcon sx={{ color: "#f57f17" }} />
                  </Box>
                  <Box sx={{ maxWidth: "75%" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">Menor Departamento</Typography>
                    <Typography variant="h6" fontWeight="bold" noWrap>{estatisticas.menorDep}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Barra de busca e botão */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Buscar por departamento"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 2,
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirModalNovo}
          sx={{
            background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 30px rgba(124,77,255,0.3)",
            },
          }}
        >
          Novo Departamento
        </Button>
      </Box>

      {/* Lista Premium com Cards e Estatísticas */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredDepartamentos.length === 0 ? (
        <Typography align="center" color="text.secondary" mt={6}>
          Nenhum departamento encontrado.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {filteredDepartamentos.map((dep) => {
            const maxMembros = 100; // ajuste conforme seu contexto
            const membrosPercent = Math.min(
              100,
              Math.round(((dep.totalMembros || 0) / maxMembros) * 100)
            );

            return (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    background: "linear-gradient(135deg,#f0f0ff,#ffffff)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 18px 40px rgba(124,77,255,0.3)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dep.nome}
                    </Typography>
                    {dep.descricao && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {dep.descricao}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2} mt={1} alignItems="center">
                      <LocationOnIcon color="primary" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {dep.local || "Não informado"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={1} alignItems="center">
                      <PeopleIcon color="primary" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {dep.totalMembros || 0} membro(s)
                      </Typography>
                    </Stack>

                    {/* Barra de progresso animada */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Preenchimento de membros
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={membrosPercent}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          mt: 0.5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg,#7c4dff,#00e5ff)",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "right" }}
                      >
                        {membrosPercent}%
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => abrirModalEditar(dep)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => deletarDepartamento(dep.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}

      {/* Modal de Formulário */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {departamentoEditando ? "Editar Departamento" : "Novo Departamento"}
        </DialogTitle>
        <DialogContent dividers>
          <FormDepartamento
            departamento={departamentoEditando}
            onSuccess={() => {
              setOpenModal(false);
              fetchDepartamentos();
              setSnackbar({
                open: true,
                message: `Departamento ${
                  departamentoEditando ? "editado" : "criado"
                } com sucesso!`,
                severity: "success",
              });
            }}
            onCancel={() => setOpenModal(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}