// src/components/ListaDescontos.jsx
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
import { getDescontos, deleteDesconto } from "../services/rhService";
import FormDescontos from "./FormDescontos";

export default function ListaDescontos() {
  const [descontos, setDescontos] = useState([]);
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
      const data = await getDescontos();
      setDescontos(data || []);
    } catch (error) {
      console.error("Erro ao buscar descontos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (desconto) => {
    setEditing(desconto);
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
      await deleteDesconto(idParaEliminar);
      await fetchData();
      fecharModalEliminar();
    } catch (error) {
      console.error("Erro ao eliminar desconto:", error);
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 1.5 }}>
        <CircularProgress size={32} sx={{ color: "text.secondary" }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sincronizando parâmetros de deduções...
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
            <Box sx={{ p: 1.2, bgcolor: alpha(theme.palette.error.main, 0.08), borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "error.main", border: "1px solid", borderColor: alpha(theme.palette.error.main, 0.15) }}>
              <Percent fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Tabela de Descontos e Retenções
              </Typography>
              <Typography sx={{ fontSize: "11px", fontWeight: 500, color: "text.secondary" }}>
                Configuração de taxas de IRT, Segurança Social e deduções fixas
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* MÓDULO RESPONSIVO: MOBILE */}
        {isMobile ? (
          <Stack spacing={2}>
            {descontos.map((d) => (
              <Paper key={d.id} variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Box>
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                      {d.nome}
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary", mt: 0.5 }}>
                      {d.descricao || "Sem descrição informada"}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${d.percentagem}%`} 
                    size="small" 
                    sx={{ 
                      fontSize: "11px", 
                      fontWeight: "bold", 
                      height: "22px",
                      bgcolor: alpha(theme.palette.error.main, 0.1), 
                      color: "error.main",
                    }} 
                  />
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Chip 
                    label={d.ativo ? "Ativo" : "Inativo"} 
                    size="small" 
                    sx={{ 
                      fontSize: "10px", 
                      fontWeight: "bold", 
                      height: "20px",
                      bgcolor: d.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                      color: d.ativo ? "success.main" : "text.secondary",
                    }} 
                  />
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit sx={{ fontSize: "12px !important" }} />}
                      onClick={() => handleEdit(d)}
                      sx={{ textTransform: "none", fontWeight: "bold", fontSize: "11px", borderColor: "divider", color: "text.primary", borderRadius: "8px", height: "28px" }}
                    >
                      Editar
                    </Button>
                    <IconButton 
                      size="small" 
                      onClick={() => abrirModalEliminar(d.id)} 
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
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Identificador/Nome</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Descrição Funcional</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Alíquota Aplicada</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Estado</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", py: 1.5 }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {descontos.map((d) => (
                  <TableRow key={d.id} sx={{ "&:hover": { bgcolor: "grey.50" }, transition: "background-color 0.15s" }}>
                    
                    {/* NOME */}
                    <TableCell sx={{ py: 1, fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                      {d.nome}
                    </TableCell>

                    {/* DESCRIÇÃO */}
                    <TableCell sx={{ py: 1, fontSize: "11px", color: "text.secondary" }}>
                      {d.descricao || "—"}
                    </TableCell>

                    {/* PERCENTAGEM */}
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        label={`${d.percentagem}%`}
                        size="small"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 800,
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                          color: "error.main",
                          borderRadius: "6px",
                          height: "22px"
                        }}
                      />
                    </TableCell>

                    {/* STATUS CHIP */}
                    <TableCell sx={{ py: 1 }}>
                      <Chip 
                        label={d.ativo ? "ATIVO" : "INATIVO"} 
                        size="small" 
                        sx={{ 
                          fontSize: "10px", 
                          fontWeight: 900, 
                          height: "18px", 
                          borderRadius: "4px",
                          bgcolor: d.ativo ? alpha(theme.palette.success.main, 0.1) : "grey.100", 
                          color: d.ativo ? "success.main" : "text.secondary",
                          border: d.ativo ? "1px solid" : "none",
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
                          onClick={() => handleEdit(d)} 
                          startIcon={<Edit sx={{ fontSize: "11px !important" }} />} 
                          sx={{ px: 1.5, height: "26px", textTransform: "none", fontSize: "11px", fontWeight: "bold", color: "text.primary", borderColor: "divider", borderRadius: "6px" }}
                        >
                          Editar
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={() => abrirModalEliminar(d.id)} 
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
                Total de Regras: {descontos.length}
              </Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Parametrização Fiscal
              </Typography>
            </Box>
          </Paper>
        )}

        {/* MODAL FORMULÁRIO DE EDIÇÃO */}
        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "12px" } }}>
          <DialogContent sx={{ p: 3 }}>
            <FormDescontos
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
                Eliminar Desconto
              </Typography>
              <Typography sx={{ fontSize: "11px", color: "text.secondary", px: 1 }}>
                Pretende remover esta regra de dedução do ERP? Esta ação pode afetar as próximas folhas de salário calculadas.
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