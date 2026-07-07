// src/components/ListaSubsidios.jsx
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
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  Percent,
  Edit,
  Delete,
  WarningAmber,
} from "@mui/icons-material";
import api from "../api/axiosConfig";
import FormSubsidios from "./FormSubsidios";

export default function ListaSubsidios() {
  const [subsidios, setSubsidios] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Modais Operacionais
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/subsidios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubsidios(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar subsídios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditing(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditing(null);
    setOpenModal(false);
  };

  const abrirModalEliminar = (id) => {
    setIdParaEliminar(id);
    setOpenDeleteModal(true);
  };

  const fecharModalEliminar = () => {
    if (eliminando) return;
    setOpenDeleteModal(false);
    setIdParaEliminar(null);
  };

  const confirmarEliminacao = async () => {
    if (!idParaEliminar) return;
    try {
      setEliminando(true);
      const token = localStorage.getItem("token");
      await api.delete(`/subsidios/${idParaEliminar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
      fecharModalEliminar();
    } catch (error) {
      console.error("Erro ao eliminar subsídio:", error);
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 1.5 }}>
        <CircularProgress size={32} sx={{ color: "text.secondary" }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sincronizando bonificações e subsídios...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in>
      <Box sx={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>

        {/* HEADER DO PAINEL */}
        <Paper variant="outlined" sx={{ p: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: "12px", boxShadow: "none" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.2, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.15) }}>
              <Percent fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Tabela de Subsídios e Abonos
              </Typography>
              <Typography sx={{ fontSize: "11px", fontWeight: 500, color: "text.secondary" }}>
                Definição de variáveis percentuais sobre o vencimento base (Alimentação, Transporte, Função)
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* MÓDULO RESPONSIVO: MOBILE */}
        {isMobile ? (
          <Stack spacing={2}>
            {subsidios.map((s) => (
              <Paper key={s.id} variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                    {s.nome}
                  </Typography>
                  <Chip 
                    label={`+${s.percentagem}%`} 
                    size="small" 
                    sx={{ 
                      fontSize: "11px", 
                      fontWeight: "bold", 
                      height: "22px",
                      bgcolor: alpha(theme.palette.success.main, 0.1), 
                      color: "success.main",
                    }} 
                  />
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Chip 
                    label={s.ativo ? "Ativo" : "Inativo"} 
                    size="small" 
                    sx={{ 
                      fontSize: "10px", 
                      fontWeight: "bold", 
                      height: "20px",
                      bgcolor: s.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                      color: s.ativo ? "success.main" : "text.secondary",
                    }} 
                  />
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit sx={{ fontSize: "12px !important" }} />}
                      onClick={() => handleEdit(s)}
                      sx={{ textTransform: "none", fontWeight: "bold", fontSize: "11px", borderColor: "divider", color: "text.primary", borderRadius: "8px", height: "28px" }}
                    >
                      Editar
                    </Button>
                    <IconButton 
                      size="small" 
                      onClick={() => abrirModalEliminar(s.id)} 
                      sx={{ border: "1px solid", borderColor: "error.light", bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: "8px", p: 0.5, width: "28px", height: "28px" }}
                    >
                      <Delete sx={{ fontSize: 13, color: "error.main" }} />
                    </IconButton>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          /* MÓDULO RESPONSIVO: DESKTOP TABLE */
          <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", borderColor: "divider", bgcolor: "background.paper" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Designação do Subsídio</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Acréscimo Percentual</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Estado</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subsidios.map((s) => (
                  <TableRow key={s.id} sx={{ "&:hover": { bgcolor: "grey.50" }, transition: "background-color 0.15s" }}>
                    
                    {/* NOME */}
                    <TableCell sx={{ py: 1.5, fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                      {s.nome}
                    </TableCell>

                    {/* PERCENTAGEM */}
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        label={`+${s.percentagem}%`}
                        size="small"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 800,
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          color: "success.main",
                          borderRadius: "6px",
                          height: "22px"
                        }}
                      />
                    </TableCell>

                    {/* STATUS CHIP */}
                    <TableCell sx={{ py: 1 }}>
                      <Chip 
                        label={s.ativo ? "ATIVO" : "INATIVO"} 
                        size="small" 
                        sx={{ 
                          fontSize: "10px", 
                          fontWeight: 900, 
                          height: "18px", 
                          borderRadius: "4px",
                          bgcolor: s.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                          color: s.ativo ? "success.main" : "text.secondary",
                          border: s.ativo ? "1px solid" : "none",
                          borderColor: alpha(theme.palette.success.main, 0.2)
                        }} 
                      />
                    </TableCell>

                    {/* AÇÕES */}
                    <TableCell align="center" sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleEdit(s)} 
                          startIcon={<Edit sx={{ fontSize: "11px !important" }} />} 
                          sx={{ px: 1.5, height: "26px", textTransform: "none", fontSize: "11px", fontWeight: "bold", color: "text.primary", borderColor: "divider", borderRadius: "6px" }}
                        >
                          Editar
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={() => abrirModalEliminar(s.id)} 
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

            {/* METADADOS TABELA */}
            <Box sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}>
              <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total de Abonos: {subsidios.length}
              </Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Parametrização Salarial
              </Typography>
            </Box>
          </Paper>
        )}

        {/* MODAL FORMULÁRIO DE EDIÇÃO */}
        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "12px" } }}>
          <DialogContent sx={{ p: 3 }}>
            <FormSubsidios
              editData={editing}
              onFinish={() => {
                handleClose();
                fetchData();
              }}
              onCancelEdit={handleClose}
            />
          </DialogContent>
        </Dialog>

        {/* MODAL MINIMALISTA DE ELIMINAÇÃO */}
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
                Eliminar Subsídio
              </Typography>
              <Typography sx={{ fontSize: "11px", color: "text.secondary", px: 1 }}>
                Pretende remover este subsídio do sistema? Folhas salariais processadas anteriormente manterão o registro original.
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

      </Box>
    </Fade>
  );
}