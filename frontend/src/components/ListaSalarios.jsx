// src/components/ListaSalarios.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Stack,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  Button,
  alpha,
} from "@mui/material";

import { motion } from "framer-motion";
import {
  MonetizationOn,
  CalendarMonth,
  Edit,
  Delete,
  WarningAmber,
} from "@mui/icons-material";

import api from "../api/axiosConfig";
import FormSalario from "./FormSalarios";

export default function ListaSalarios() {
  const [salarios, setSalarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [salarioSelecionado, setSalarioSelecionado] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [salarioParaEliminar, setSalarioParaEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchSalarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/salarios/lista", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalarios(res.data.salarios || []);
    } catch (error) {
      console.error("Erro ao buscar salários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalarios();
  }, []);

  const handleEditar = (salario) => {
    setSalarioSelecionado(salario);
    setOpenModal(true);
  };

  const handleEliminar = (salario) => {
    setSalarioParaEliminar(salario);
    setOpenDeleteModal(true);
  };

  const confirmarEliminacao = async () => {
    if (!salarioParaEliminar) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await api.delete(`/salarios/${salarioParaEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenDeleteModal(false);
      setSalarioParaEliminar(null);
      fetchSalarios();
    } catch (error) {
      console.error("Erro ao eliminar salário:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 1.5 }}>
        <CircularProgress size={32} sx={{ color: "text.secondary" }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sincronizando histórico de pagamentos...
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Box sx={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>

        {/* HEADER DO PAINEL */}
        <Paper variant="outlined" sx={{ p: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: "12px", boxShadow: "none" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.2, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.15) }}>
              <MonetizationOn fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Processamento Salarial
              </Typography>
              <Typography sx={{ fontSize: "11px", fontWeight: 500, color: "text.secondary" }}>
                Histórico detalhado e auditoria de folhas de pagamento em vigor
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* MÓDULO RESPONSIVO: MOBILE */}
        {isMobile ? (
          <Stack spacing={2}>
            {salarios.map((s) => (
              <Paper key={s.id} variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "grey.100", color: "text.primary", fontWeight: "bold" }}>
                      {s.Funcionario?.Membro?.nome?.charAt(0) || "F"}
                    </Avatar>
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                      {s.Funcionario?.Membro?.nome || "Sem Nome"}
                    </Typography>
                  </Stack>
                  <Chip 
                    icon={<CalendarMonth sx={{ fontSize: "11px !important" }} />}
                    label={s.mes_ano} 
                    size="small" 
                    sx={{ fontSize: "10px", fontWeight: "bold", height: "20px" }} 
                  />
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Stack spacing={0.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <Typography color="text.secondary">Salário Base:</Typography>
                    <Typography sx={{ fontWeight: 600, color: "text.primary" }}>{Number(s.salario_base).toLocaleString()} Kz</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <Typography color="text.secondary">Subsídios:</Typography>
                    <Typography sx={{ fontWeight: 600, color: "success.main" }}>+{Number(s.total_subsidios).toLocaleString()} Kz</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <Typography color="text.secondary">Descontos:</Typography>
                    <Typography sx={{ fontWeight: 600, color: "error.main" }}>-{Number(s.total_descontos).toLocaleString()} Kz</Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "text.secondary" }}>Líquido:</Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 900, color: "success.main" }}>
                      {Number(s.salario_liquido).toLocaleString()} Kz
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Edit sx={{ fontSize: "12px !important" }} />}
                    onClick={() => handleEditar(s)}
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
                    onClick={() => handleEliminar(s)}
                    sx={{ textTransform: "none", fontWeight: "bold", fontSize: "11px", borderRadius: "8px", bgcolor: alpha(theme.palette.error.main, 0.05), borderColor: "error.light" }}
                  >
                    Eliminar
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
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Competência</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Vencimento Base</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Vantagens (+)</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Retenções (-)</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Valor Líquido</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {salarios.map((s) => (
                  <TableRow key={s.id} sx={{ "&:hover": { bgcolor: "grey.50" }, transition: "background-color 0.15s" }}>
                    
                    {/* FUNCIONÁRIO */}
                    <TableCell sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28, fontSize: "11px", bgcolor: "grey.100", color: "text.primary", fontWeight: "bold" }}>
                          {s.Funcionario?.Membro?.nome?.charAt(0) || "F"}
                        </Avatar>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                          {s.Funcionario?.Membro?.nome || "Sem Nome"}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* MÊS/ANO */}
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        icon={<CalendarMonth sx={{ fontSize: "12px !important" }} />}
                        label={s.mes_ano}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "11px", fontWeight: "bold", height: "22px", borderColor: "divider" }}
                      />
                    </TableCell>

                    {/* BASE */}
                    <TableCell sx={{ py: 1, fontSize: "11px", color: "text.secondary" }}>
                      {Number(s.salario_base).toLocaleString()} Kz
                    </TableCell>

                    {/* SUBSÍDIOS */}
                    <TableCell sx={{ py: 1, fontSize: "11px", fontWeight: "bold", color: "success.main" }}>
                      +{Number(s.total_subsidios).toLocaleString()} Kz
                    </TableCell>

                    {/* DESCONTOS */}
                    <TableCell sx={{ py: 1, fontSize: "11px", fontWeight: "bold", color: "error.main" }}>
                      -{Number(s.total_descontos).toLocaleString()} Kz
                    </TableCell>

                    {/* LÍQUIDO */}
                    <TableCell sx={{ py: 1, fontSize: "12px", fontWeight: 900, color: "success.main" }}>
                      {Number(s.salario_liquido).toLocaleString()} Kz
                    </TableCell>

                    {/* AÇÕES */}
                    <TableCell align="center" sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleEditar(s)} 
                          startIcon={<Edit sx={{ fontSize: "11px !important" }} />} 
                          sx={{ px: 1.5, height: "26px", textTransform: "none", fontSize: "11px", fontWeight: "bold", color: "text.primary", borderColor: "divider", borderRadius: "6px" }}
                        >
                          Editar
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEliminar(s)} 
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

            {/* CONTROLADOR DE REGISTROS */}
            <Box sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}>
              <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Registros Processados: {salarios.length}
              </Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Departamento Financeiro
              </Typography>
            </Box>
          </Paper>
        )}

        {/* MODAL FORMULÁRIO DE EDIÇÃO */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: "12px" } }}>
          <DialogContent sx={{ p: 3 }}>
            <FormSalario
              salarioEditando={salarioSelecionado}
              onSalvo={() => {
                setOpenModal(false);
                fetchSalarios();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* MODAL MINIMALISTA DE ELIMINAÇÃO */}
        <Dialog 
          open={openDeleteModal} 
          onClose={() => !deleting && setOpenDeleteModal(false)} 
          PaperProps={{ sx: { borderRadius: "12px", width: "100%", maxWidth: "360px" } }}
        >
          <DialogContent sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: alpha(theme.palette.error.main, 0.1), border: "1px solid", borderColor: "error.light", color: "error.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto" }}>
              <WarningAmber fontSize="small" />
            </Box>
            
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.primary", mb: 0.5 }}>
                Eliminar Registro
              </Typography>
              <Typography sx={{ fontSize: "11px", color: "text.secondary", px: 1 }}>
                Pretende apagar esta folha de cálculo? Esta operação não reverterá os lançamentos bancários correntes.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenDeleteModal(false)} disabled={deleting} sx={{ textTransform: "none", fontSize: "12px", fontWeight: "bold", borderColor: "divider", color: "text.primary", borderRadius: "8px" }}>
                Voltar
              </Button>
              <Button fullWidth variant="contained" onClick={confirmarEliminacao} disabled={deleting} sx={{ textTransform: "none", fontSize: "12px", fontWeight: "bold", bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" }, boxShadow: "none", borderRadius: "8px" }}>
                {deleting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Confirmar"}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

      </Box>
    </motion.div>
  );
}