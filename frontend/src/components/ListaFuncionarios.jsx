// src/components/ListaFuncionarios.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit,
  Delete,
  PeopleAlt,
  WorkOutline,
  MonetizationOn,
  WarningAmber,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";
import GestaoFuncionarios from "./FormFuncionarios";

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Modais Operacionais
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [funcionarioParaEliminar, setFuncionarioParaEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const fetchFuncionarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/lista-funcionarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFuncionarios(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleEditar = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setOpenModal(true);
  };

  const fecharModal = () => {
    setOpenModal(false);
    setFuncionarioSelecionado(null);
  };

  const handleSucesso = () => {
    fetchFuncionarios();
    fecharModal();
  };

  const abrirModalEliminar = (funcionario) => {
    setFuncionarioParaEliminar(funcionario);
    setOpenDeleteModal(true);
  };

  const fecharModalEliminar = () => {
    if (eliminando) return;
    setOpenDeleteModal(false);
    setFuncionarioParaEliminar(null);
  };

  const confirmarEliminacao = async () => {
    if (!funcionarioParaEliminar) return;
    try {
      setEliminando(true);
      const token = localStorage.getItem("token");
      await api.delete(`/funcionarios/${funcionarioParaEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFuncionarios();
      fecharModalEliminar();
    } catch (error) {
      console.error("Erro ao eliminar funcionário:", error);
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 1.5 }}>
        <CircularProgress size={32} sx={{ color: "text.secondary" }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sincronizando base de colaboradores...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* MODAL DE EDIÇÃO */}
      <Dialog open={openModal} onClose={fecharModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
        <DialogContent sx={{ p: 3 }}>
          <GestaoFuncionarios
            funcionarioSelecionado={funcionarioSelecionado}
            onSucesso={handleSucesso}
            onCancelar={fecharModal}
          />
        </DialogContent>
      </Dialog>

      {/* MODAL MINIMALISTA DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Dialog 
        open={openDeleteModal} 
        onClose={() => !eliminando && fecharModalEliminar()} 
        PaperProps={{ sx: { borderRadius: "12px", width: "100%", maxWidth: "360px" } }}
      >
        <DialogContent sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: alpha(theme.palette.error.main, 0.1), border: "1px solid", borderColor: "error.light", color: "error.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto" }}>
            <WarningAmber fontSize="small" />
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.primary", mb: 0.5 }}>
              Desativar Colaborador
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.secondary", px: 1 }}>
              Tem a certeza que deseja suspender a atividade deste funcionário no painel administrativo?
            </Typography>
            <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "success.main", mt: 1 }}>
              {funcionarioParaEliminar?.Membro?.nome || "Colaborador"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button fullWidth variant="outlined" onClick={fecharModalEliminar} disabled={eliminando} sx={{ textTransform: "none", fontSize: "12px", fontWeight: "bold", borderColor: "divider", color: "text.primary", borderRadius: "8px" }}>
              Voltar
            </Button>
            <Button fullWidth variant="contained" onClick={confirmarEliminacao} disabled={eliminando} sx={{ textTransform: "none", fontSize: "12px", fontWeight: "bold", bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" }, boxShadow: "none", borderRadius: "8px" }}>
              {eliminando ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Confirmar"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* CONTEÚDO PRINCIPAL */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>
          
          {/* HEADER DO PAINEL */}
          <Paper variant="outlined" sx={{ p: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: "12px", boxShadow: "none" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1.2, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.15) }}>
                <PeopleAlt fontSize="small" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "12px", fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Quadro de Funcionários
                </Typography>
                <Typography sx={{ fontSize: "11px", fontWeight: 500, color: "text.secondary" }}>
                  Controlo administrativo e parametrização de cargos ativos
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* MÓDULO RESPONSIVO: MOBILE */}
          {isMobile ? (
            <Stack spacing={2}>
              {funcionarios.map((f) => (
                <Paper key={f.id} variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "grey.100", color: "text.primary", fontWeight: "bold" }}>
                        {f.Membro?.nome?.charAt(0) || "F"}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                          {f.Membro?.nome || "Sem Nome"}
                        </Typography>
                        <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 600 }}>Cód: #{f.id}</Typography>
                      </Box>
                    </Stack>
                    <Chip 
                      label={f.ativo ? "Ativo" : "Inativo"} 
                      size="small" 
                      sx={{ 
                        fontSize: "10px", 
                        fontWeight: "bold", 
                        height: "20px",
                        bgcolor: f.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                        color: f.ativo ? "success.main" : "text.secondary",
                      }} 
                    />
                  </Box>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
                      <WorkOutline sx={{ fontSize: 13 }} />
                      <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{f.Cargo?.nome || "Sem Especialidade"}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                      {Number(f.salario_base || 0).toLocaleString()} <span style={{ fontSize: "10px", color: "#94a3b8" }}>Kz</span>
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Edit sx={{ fontSize: "12px !important" }} />}
                      onClick={() => handleEditar(f)}
                      sx={{ textTransform: "none", fontWeight: "bold", fontSize: "11px", borderColor: "divider", color: "text.primary", borderRadius: "8px" }}
                    >
                      Editar
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Delete sx={{ fontSize: "12px !important" }} />}
                      onClick={() => abrirModalEliminar(f)}
                      sx={{ textTransform: "none", fontWeight: "bold", fontSize: "11px", borderRadius: "8px", bgcolor: alpha(theme.palette.error.main, 0.05), borderColor: "error.light" }}
                    >
                      Desativar
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            /* MÓDULO RESPONSIVO: DESKTOP TABLE */
            <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", borderColor: "divider", bgcolor: "background.paper" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
                    <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Funcionário</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Cargo de Lotação</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Vencimento Base</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Estado</TableCell>
                    <TableCell align="center" sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {funcionarios.map((f) => (
                    <TableRow key={f.id} sx={{ "&:hover": { bgcolor: "grey.50" }, transition: "background-color 0.15s" }}>
                      
                      {/* FUNCIONÁRIO COM AVATAR */}
                      <TableCell sx={{ py: 1 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28, fontSize: "11px", bgcolor: "grey.100", color: "text.primary", fontWeight: "bold" }}>
                            {f.Membro?.nome?.charAt(0) || "F"}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                              {f.Membro?.nome || "Sem Nome"}
                            </Typography>
                            <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 600 }}>ID: #{f.id}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* CARGO */}
                      <TableCell sx={{ py: 1 }}>
                        <Chip 
                          icon={<WorkOutline sx={{ fontSize: "12px !important" }} />} 
                          label={f.Cargo?.nome || "Sem Posição"} 
                          size="small" 
                          sx={{ fontSize: "11px", fontWeight: "bold", height: "22px", border: "1px solid", borderColor: "divider", backgroundColor: "transparent" }} 
                        />
                      </TableCell>

                      {/* SALÁRIO BASE */}
                      <TableCell sx={{ py: 1, fontSize: "11px", fontWeight: "bold", color: "text.primary" }}>
                        {Number(f.salario_base || 0).toLocaleString()} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#94a3b8" }}>Kz</span>
                      </TableCell>

                      {/* STATUS CHIP */}
                      <TableCell sx={{ py: 1 }}>
                        <Chip 
                          label={f.ativo ? "ATIVO" : "INATIVO"} 
                          size="small" 
                          sx={{ 
                            fontSize: "10px", 
                            fontWeight: 900, 
                            height: "18px", 
                            borderRadius: "4px",
                            bgcolor: f.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                            color: f.ativo ? "success.main" : "text.secondary",
                            border: f.ativo ? "1px solid" : "none",
                            borderColor: alpha(theme.palette.success.main, 0.2)
                          }} 
                        />
                      </TableCell>

                      {/* AÇÕES OPERACIONAIS */}
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleEditar(f)} 
                            startIcon={<Edit sx={{ fontSize: "11px !important" }} />} 
                            sx={{ minWidth: "auto", px: 1.5, height: "26px", textTransform: "none", fontSize: "11px", fontWeight: "bold", color: "text.primary", borderColor: "divider", borderRadius: "6px" }}
                          >
                            Editar
                          </Button>
                          <IconButton 
                            size="small" 
                            onClick={() => abrirModalEliminar(f)} 
                            sx={{ border: "1px solid", borderColor: "error.light", bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: "6px", p: 0.5 }}
                          >
                            <Delete sx={{ fontSize: 13, color: "error.main" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider />

              {/* RODAPÉ DO CONTROLADOR */}
              <Box sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}>
                <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total de Registros: {funcionarios.length}
                </Typography>
                <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Recursos Humanos
                </Typography>
              </Box>
            </Paper>
          )}

        </Box>
      </motion.div>
    </>
  );
}