import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  Grid,
  InputAdornment,
  TablePagination
} from "@mui/material";

import { PieChart } from '@mui/x-charts/PieChart';

import api from "../api/axiosConfig";
import {
  AdminPanelSettingsRounded,
  EditRounded,
  DeleteRounded,
  PeopleAltRounded,
  DateRangeRounded,
  TrendingUpRounded,
  SearchRounded,
  FilterListRounded,
  AddRounded
} from "@mui/icons-material";

// Importação do seu componente de cadastro
import CadastrarIgrejaDono from "../components/CadastrarIgrejaDono";

export default function Configuracoes() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsuarios: 0,
    usuariosNovosSemana: 0,
    usuariosNovosMes: 0,
    usuariosPorFuncao: {}
  });

  // Estados de Filtros e Paginação
  const [busca, setBusca] = useState("");
  const [filtroFuncao, setFiltroFuncao] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalFiltrados, setTotalFiltrados] = useState(0);

  // Estados dos Modais
  const [openModal, setOpenModal] = useState(false);
  const [openCadastroModal, setOpenCadastroModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ role: "usuario" });

  const currentSedeId = 1; 

  const API_URL = "/gestao-usuarios";
  const API_USUARIOS_URL = "/usuarios";

  // Buscar usuários com paginação e filtros acoplados
  const fetchUsuarios = useCallback(async () => {
    try {
      const response = await api.get(API_URL, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          busca: busca,
          funcao: filtroFuncao
        }
      });

      const listaUsuarios = response.data.usuarios || [];
      setTotalFiltrados(response.data.totalFiltrados || 0);

      setMetrics({
        totalUsuarios: response.data.totalUsuarios || 0,
        usuariosNovosSemana: response.data.usuariosNovosSemana || 0,
        usuariosNovosMes: response.data.usuariosNovosMes || 0,
        usuariosPorFuncao: response.data.usuariosPorFuncao || {}
      });

      const mappedUsers = listaUsuarios.map(u => ({
        id: u.id,
        name: u.nome,
        role: u.funcao, 
        SedeId: u.SedeId,
        FilhalId: u.FilhalId,
        foto: u.Membro?.foto || null,
        cargos: u.Membro?.cargos || []
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Erro de conexão com a API:", error);
    }
  }, [page, rowsPerPage, busca, filtroFuncao]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setPage(0);
  };

  const handleFiltroFuncaoChange = (e) => {
    setFiltroFuncao(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setFormData({ role: user.role === "super_admin" ? "admin" : user.role });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await api.put(`${API_USUARIOS_URL}/${selectedUser.id}`, {
          funcao: formData.role 
        });
        fetchUsuarios(); 
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao atualizar função.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await api.delete(`${API_USUARIOS_URL}/${id}`);
        fetchUsuarios();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert(error.response?.data?.message || "Erro ao deletar usuário.");
      }
    }
  };

  // Cores Premium em tom Pastel/Soft com bordas elegantes
  const getRoleChip = (role) => {
    const configs = {
      super_admin: { label: "Super Admin", bg: "#FEF2F2", text: "#EF4444", border: "#FEE2E2" },
      admin: { label: "Admin", bg: "#EEF2FF", text: "#4F46E5", border: "#E0E7FF" },
      moderador: { label: "Moderador", bg: "#FFFBEB", text: "#D97706", border: "#FEF3C7" },
      usuario: { label: "Usuário", bg: "#F0FDF4", text: "#16A34A", border: "#DCFCE7" },
    };
    const current = configs[role] || { label: role || "N/A", bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };
    return (
      <Chip 
        label={current.label} 
        sx={{ 
          bgcolor: current.bg, 
          color: current.text, 
          border: `1px solid ${current.border}`,
          fontWeight: 600,
          fontSize: "0.75rem",
          height: "24px"
        }} 
      />
    );
  };

  const colorsPalette = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const pieChartData = Object.entries(metrics.usuariosPorFuncao).map(([funcao, qtd], index) => ({
    id: index,
    value: qtd,
    label: `${funcao}`,
    color: colorsPalette[index % colorsPalette.length]
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER DA PÁGINA */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 1.5, letterSpacing: "-0.02em" }}>
            <Box sx={{ bgcolor: "#4F46E5", p: 1, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}>
              <AdminPanelSettingsRounded sx={{ color: "#FFFFFF", fontSize: 26 }} />
            </Box> 
            Controle & Auditoria
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1, fontSize: "0.9rem" }}>
            Gerencie permissões de acesso, audite perfis e monitore o crescimento geral dos usuários.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => setOpenCadastroModal(true)}
          sx={{ 
            bgcolor: "#4F46E5", 
            fontWeight: 600, 
            textTransform: "none", 
            borderRadius: "12px", 
            px: 3, 
            py: 1.2, 
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
            transition: "all 0.2s ease-in-out",
            '&:hover': { bgcolor: "#4338CA", boxShadow: "0 6px 20px rgba(79, 70, 229, 0.4)", transform: "translateY(-1px)" } 
          }}
        >
          Novo Usuário
        </Button>
      </Box>

      {/* MÉTRICAS & DASHBOARD */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Card 1 */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", transition: "transform 0.2s", '&:hover': { transform: "translateY(-2px)" } }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.05em" }}>Total de Usuários</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mt: 1, letterSpacing: "-0.03em" }}>{metrics.totalUsuarios}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(79, 70, 229, 0.08)", color: "#4F46E5", width: 52, height: 52, borderRadius: "14px" }}>
                  <PeopleAltRounded sx={{ fontSize: 26 }} />
                </Avatar>
              </Paper>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", transition: "transform 0.2s", '&:hover': { transform: "translateY(-2px)" } }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.05em" }}>Novos (7 dias)</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#10B981", mt: 1, letterSpacing: "-0.03em" }}>+{metrics.usuariosNovosSemana}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", color: "#10B981", width: 52, height: 52, borderRadius: "14px" }}>
                  <TrendingUpRounded sx={{ fontSize: 26 }} />
                </Avatar>
              </Paper>
            </Grid>

            {/* Card 3 */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", transition: "transform 0.2s", '&:hover': { transform: "translateY(-2px)" } }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.05em" }}>Novos (30 dias)</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#F59E0B", mt: 1, letterSpacing: "-0.03em" }}>+{metrics.usuariosNovosMes}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "rgba(245, 158, 11, 0.08)", color: "#F59E0B", width: 52, height: 52, borderRadius: "14px" }}>
                  <DateRangeRounded sx={{ fontSize: 26 }} />
                </Avatar>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico de Rosca Estilizado */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Distribuição de Funções</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 110 }}>
              {pieChartData.length > 0 ? (
                <PieChart
                  series={[{
                    data: pieChartData,
                    innerRadius: 28,
                    outerRadius: 46,
                    paddingAngle: 4,
                    cornerRadius: 6,
                  }]}
                  legend={{ 
                    position: { vertical: 'middle', horizontal: 'right' }, 
                    labelStyle: { fontSize: 12, fontWeight: 600, fill: '#475569' },
                    itemGap: 8
                  }}
                  width={280}
                  height={110}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "#94A3B8" }}>Nenhum dado analítico encontrado</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* FILTROS AVANÇADOS */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.01)", bgcolor: "#FFFFFF" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar por nome de usuário..."
              value={busca}
              onChange={handleBuscaChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ color: "#94A3B8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filtrar por Acesso"
              value={filtroFuncao}
              onChange={handleFiltroFuncaoChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListRounded sx={{ color: "#4F46E5", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="">Todos os Níveis</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="moderador">Moderador</MenuItem>
              <MenuItem value="usuario">Usuário Comum</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* TABELA DE LISTAGEM */}
      <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", overflow: "hidden" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 2 }}>Usuário / Membro</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 2 }}>Nível de Acesso</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 2, pr: 3 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 8, color: "#94A3B8", fontSize: "0.9rem" }}>
                  Nenhum usuário atende aos critérios de filtro aplicados.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} sx={{ transition: "all 0.2s", '&:hover': { background: 'linear-gradient(90deg, rgba(238,242,255,0.3) 0%, rgba(255,255,255,0) 100%)' } }}>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar 
                        src={user.foto} 
                        alt={user.name} 
                        sx={{ 
                          width: 44, 
                          height: 44, 
                          background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", 
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.15)"
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.95rem" }}>{user.name}</Typography>
                        {user.cargos && user.cargos.length > 0 && (
                          <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                            {user.cargos.map((cargo) => (
                              <Chip key={cargo.id} label={cargo.nome} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: "18px", color: "#64748B", borderColor: "#E2E8F0", bgcolor: "#F8FAFC" }} />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>{getRoleChip(user.role)}</TableCell>
                  <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                    <IconButton 
                      onClick={() => handleOpenModal(user)} 
                      sx={{ 
                        color: "#4F46E5", 
                        bgcolor: "rgba(79, 70, 229, 0.04)", 
                        mr: 1, 
                        borderRadius: "10px",
                        transition: "all 0.2s",
                        '&:hover': { bgcolor: "rgba(79, 70, 229, 0.1)" }
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteUser(user.id)} 
                      sx={{ 
                        color: "#EF4444", 
                        bgcolor: "rgba(239, 68, 68, 0.04)", 
                        borderRadius: "10px",
                        transition: "all 0.2s",
                        '&:hover': { bgcolor: "rgba(239, 68, 68, 0.1)" }
                      }}
                    >
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalFiltrados}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          sx={{ borderTop: "1px solid #E2E8F0", color: "#64748B", fontWeight: 500 }}
        />
      </TableContainer>

      {/* MODAL: ALTERAR PERMISSÃO */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="xs" 
        PaperProps={{ sx: { borderRadius: "16px", p: 1, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } }}
      >
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Alterar Nível de Acesso</DialogTitle>
          <DialogContent dividers sx={{ borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", py: 3 }}>
            <TextField
              select
              fullWidth
              label="Nível de Acesso"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="moderador">Moderador</MenuItem>
              <MenuItem value="usuario">Usuário Comum</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={handleCloseModal} sx={{ color: "#64748B", fontWeight: 600, textTransform: "none" }}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ bgcolor: "#4F46E5", fontWeight: 600, textTransform: "none", borderRadius: "10px", px: 3, '&:hover': { bgcolor: "#4338CA" } }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* MODAL: CADASTRO */}
      <Dialog 
        open={openCadastroModal} 
        onClose={() => setOpenCadastroModal(false)} 
        fullWidth 
        maxWidth="sm" 
        PaperProps={{ sx: { borderRadius: "20px", p: 1.5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 0, color: "#0F172A", letterSpacing: "-0.02em" }}>Cadastrar Novo Usuário</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <CadastrarIgrejaDono 
            sedeId={currentSedeId} 
            filhalExistenteId={null} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #F1F5F9", mt: 2 }}>
          <Button 
            onClick={() => {
              setOpenCadastroModal(false);
              fetchUsuarios();
            }} 
            variant="outlined"
            sx={{ color: "#475569", borderColor: "#E2E8F0", fontWeight: 600, textTransform: "none", borderRadius: "10px", px: 3, '&:hover': { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" } }}
          >
            Fechar Janela
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}