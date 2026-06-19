import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Event as EventIcon,
  MonetizationOn as MoneyIcon,
  People as PeopleIcon,
  DeleteOutline as DeleteIcon,
  AddCircleOutline as AddIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";

export default function FormCultos({ culto, onSuccess, onCancel }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tiposCulto, setTiposCulto] = useState([]);
  const [tiposContribuicao, setTiposContribuicao] = useState([]);
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dataHora: "",
    tipoCultoId: "",
    contribuicoes: {},
    membrosContribuicoes: {},
    homens: "",
    mulheres: "",
    criancas: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalTipoId, setModalTipoId] = useState(null);
  const [selectedMembro, setSelectedMembro] = useState(null);
  const [valorMembro, setValorMembro] = useState("");

  const isEdit = Boolean(culto?.id);

  // Buscar dados iniciais
  useEffect(() => {
    (async () => {
      try {
        const [tiposRes, contribRes, membrosRes] = await Promise.all([
          api.get("/lista/tipos-culto"),
          api.get("/lista/tipos-contribuicao"),
          api.get("/membros"),
        ]);
        
        // CORREÇÃO & PROTEÇÃO: Garante que se o backend enviar os dados dentro de um objeto ou formato inesperado, não quebra
        const dadosTiposCulto = Array.isArray(tiposRes.data) ? tiposRes.data : (tiposRes.data?.dados || tiposRes.data?.tipos || []);
        const dadosTiposContrib = Array.isArray(contribRes.data) ? contribRes.data : (contribRes.data?.dados || contribRes.data?.tipos || []);
        const dadosMembros = Array.isArray(membrosRes.data) ? membrosRes.data : (membrosRes.data?.membros || []);

        setTiposCulto(dadosTiposCulto);
        setTiposContribuicao(dadosTiposContrib);
        setMembros(dadosMembros);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados iniciais do servidor.");
      }
    })();
  }, []);

  // Inicializar dados do culto para edição
  useEffect(() => {
    if (culto) {
      const contribGeral = {};      
      const contribPorMembro = {};  

      (culto.contribuicoes || []).forEach((c) => {
        const tipoId = c.tipoId;
        const valor = Number(c.valor);

        if (c.membroId) {
          if (!contribPorMembro[tipoId]) contribPorMembro[tipoId] = {};
          contribPorMembro[tipoId][c.membroId] = valor;
        } else {
          contribGeral[tipoId] = (contribGeral[tipoId] || 0) + valor;
        }
      });

      setFormData({
        dataHora: culto.dataHora ? culto.dataHora.slice(0, 16) : "",
        tipoCultoId: culto.tipoCultoId || "",
        homens: culto.homens || "",
        mulheres: culto.mulheres || "",
        criancas: culto.criancas || "",
        contribuicoes: contribGeral,
        membrosContribuicoes: contribPorMembro,
      });
    }
  }, [culto]);

  const handleRemoveMembroContribuicao = async (tipoId, membroId) => {
    setFormData((prev) => {
      const copia = { ...prev.membrosContribuicoes };
      if (copia[tipoId]) {
        delete copia[tipoId][membroId];
        return { ...prev, membrosContribuicoes: copia };
      }
      return prev;
    });

    if (isEdit) {
      try {
        await api.delete(`/detalhes-cultos/${culto.id}/contribuicao`, {
          data: { tipoId, membroId },
        });
        toast.success("Contribuição de membro removida com sucesso!");
      } catch (error) {
        console.error("Erro ao remover contribuição:", error);
        toast.error("Não foi possível remover a contribuição no servidor.");
      }
    } else {
      toast.info("Membro removido da lista local.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContribuicaoChange = (id, valor) => {
    setFormData((prev) => ({
      ...prev,
      contribuicoes: { ...prev.contribuicoes, [id]: valor },
    }));
  };

  const handleAddMembroContribuicao = () => {
    if (!modalTipoId || !selectedMembro || !valorMembro) {
      toast.warning("Preencha todos os campos do membro.");
      return;
    }

    const valorNum = Number(valorMembro);

    setFormData((prev) => {
      const novosMembros = {
        ...(prev.membrosContribuicoes[modalTipoId] || {}),
        [selectedMembro.id]: valorNum,
      };

      return {
        ...prev,
        membrosContribuicoes: {
          ...prev.membrosContribuicoes,
          [modalTipoId]: novosMembros,
        },
      };
    });

    toast.success(`Adicionado: ${selectedMembro.nome}`);
    setSelectedMembro(null);
    setValorMembro("");
    setModalTipoId(null);
    setOpenModal(false);
  };

  const getVisualTotal = (tipoId) => {
    const valorGeral = Number(formData.contribuicoes[tipoId]) || 0;
    const membrosObj = formData.membrosContribuicoes[tipoId] || {};
    const totalMembros = Object.values(membrosObj).reduce((a, b) => a + Number(b), 0);
    return valorGeral + totalMembros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataHora || !formData.tipoCultoId) {
      toast.error("Por favor, preencha a Data/Hora e o Tipo de Culto.");
      return;
    }

    setLoading(true);

    try {
      const contribArray = [];

      Object.entries(formData.contribuicoes).forEach(([tipoId, valor]) => {
        const valNum = parseFloat(valor);
        if (valNum && valNum > 0) {
          contribArray.push({
            tipoId: parseInt(tipoId),
            valor: valNum,
            membroId: null,
          });
        }
      });

      Object.entries(formData.membrosContribuicoes).forEach(([tipoId, membrosObj]) => {
        Object.entries(membrosObj).forEach(([membroId, valor]) => {
          const valNum = parseFloat(valor);
          if (valNum && valNum > 0) {
            contribArray.push({
              tipoId: parseInt(tipoId),
              membroId: parseInt(membroId),
              valor: valNum,
            });
          }
        });
      });

      const payload = {
        dataHora: formData.dataHora,
        tipoCultoId: formData.tipoCultoId,
        homens: formData.homens || 0,
        mulheres: formData.mulheres || 0,
        criancas: formData.criancas || 0,
        contribuicoes: contribArray,
      };

      if (isEdit) {
        await api.put(`/detalhes-cultos/${culto.id}`, payload);
        toast.success("Culto atualizado com sucesso! 🎉");
      } else {
        await api.post("/detalhes-cultos", payload);
        toast.success("Culto registrado com sucesso! 🎉");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar culto:", error);
      toast.error("Erro ao salvar os dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 4,
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Cabeçalho Premium */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="700"
          sx={{ color: "#1a1a1a", letterSpacing: "-0.5px" }}
        >
          {isEdit ? "Editar Detalhes do Culto" : "Novo Registro de Culto"}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Preencha os dados de participação e finanças da sessão.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          {/* Sessão 1: Informações Gerais */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: "12px", height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ color: "#2c3e50", mb: 3 }}
                >
                  <EventIcon fontSize="small" color="action" /> Dados Gerais
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Data e Hora"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.dataHora}
                      onChange={(e) => handleChange("dataHora", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Tipo de Culto"
                      fullWidth
                      value={formData.tipoCultoId}
                      onChange={(e) => handleChange("tipoCultoId", e.target.value)}
                    >
                      {/* Adicionado Fallback de segurança (|| []) */}
                      {(tiposCulto || []).map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sessão 2: Frequência/Participantes */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: "12px", height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ color: "#2c3e50", mb: 3 }}
                >
                  <PeopleIcon fontSize="small" color="action" /> Frequência de Membros
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Homens"
                      fullWidth
                      value={formData.homens}
                      onChange={(e) => handleChange("homens", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Mulheres"
                      fullWidth
                      value={formData.mulheres}
                      onChange={(e) => handleChange("mulheres", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Crianças"
                      fullWidth
                      value={formData.criancas}
                      onChange={(e) => handleChange("criancas", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sessão 3: Finanças/Contribuições */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: "12px" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ color: "#2c3e50", mb: 3 }}
                >
                  <MoneyIcon fontSize="small" color="action" /> Gestão Financeira (Contribuições)
                </Typography>

                <Grid container spacing={3}>
                  {/* Adicionado Proteção opcional para tiposContribuicao */}
                  {(tiposContribuicao || []).map((tipo) => (
                    <Grid item xs={12} md={6} key={tipo.id}>
                      <Paper 
                        elevation={0} 
                        sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: "8px", border: "1px solid #eaeded" }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={1}>
                          <Typography fontWeight="600" variant="body1" color="#1a1a1a">
                            {tipo.nome}
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setModalTipoId(tipo.id);
                              setOpenModal(true);
                            }}
                            sx={{ textTransform: "none", fontWeight: "600" }}
                          >
                            Filtrar Membro
                          </Button>
                        </Box>

                        <TextField
                          type="number"
                          label="Valor Geral / Anónimo"
                          fullWidth
                          size="small"
                          value={formData.contribuicoes[tipo.id] || ""}
                          onChange={(e) => handleContribuicaoChange(tipo.id, e.target.value)}
                          InputProps={{
                            startAdornment: <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>Kz</Typography>,
                          }}
                          sx={{ bgcolor: "#ffffff" }}
                        />

                        {/* Total consolidado */}
                        <Box display="flex" justifyContent="space-between" mt={1.5} px={0.5}>
                          <Typography variant="caption" color="textSecondary">Total Combinado:</Typography>
                          <Typography variant="caption" fontWeight="700" color="primary.main">
                            {getVisualTotal(tipo.id).toLocaleString()} Kz
                          </Typography>
                        </Box>

                        {/* Listagem de Membros Responsiva */}
                        {formData.membrosContribuicoes[tipo.id] &&
                          Object.keys(formData.membrosContribuicoes[tipo.id]).length > 0 && (
                            <Box sx={{ mt: 2, borderTop: "1px dashed #d5dbdb", pt: 1 }}>
                              {isMobile ? (
                                Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                  const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                  return (
                                    <Box 
                                      key={membroId} 
                                      display="flex" 
                                      justifyContent="space-between" 
                                      alignItems="center"
                                      sx={{ bgcolor: "#fff", p: 1, my: 0.5, borderRadius: "6px", border: "1px solid #e5e8e8" }}
                                    >
                                      <Box>
                                        <Typography variant="body2" fontWeight="600" sx={{ textTransform: "capitalize" }}>
                                          {membro?.nome || "Membro"}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">{valor} Kz</Typography>
                                      </Box>
                                      <IconButton 
                                        size="small" 
                                        color="error"
                                        onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  );
                                })
                              ) : (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ pl: 0 }}><Typography variant="caption" fontWeight="600">Membro</Typography></TableCell>
                                      <TableCell><Typography variant="caption" fontWeight="600">Quantia</Typography></TableCell>
                                      <TableCell align="right"></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                      const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                      return (
                                        <TableRow key={membroId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell sx={{ pl: 0, py: 0.5, textTransform: "capitalize", fontSize: "0.85rem" }}>
                                            {membro?.nome || "Membro"}
                                          </TableCell>
                                          <TableCell sx={{ py: 0.5, fontSize: "0.85rem", fontWeight: "600" }}>
                                            {valor} Kz
                                          </TableCell>
                                          <TableCell align="right" sx={{ pr: 0, py: 0.5 }}>
                                            <IconButton 
                                              size="small" 
                                              color="error" 
                                              onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              )}
                            </Box>
                          )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Botões de Ação do Formulário */}
          <Grid item xs={12} display="flex" flexDirection={isMobile ? "column-reverse" : "row"} justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
            <Button
              variant="text"
              onClick={onCancel}
              fullWidth={isMobile}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "8px",
                fontWeight: "600",
                color: "#566573",
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              fullWidth={isMobile}
              disabled={loading}
              sx={{
                px: 5,
                py: 1.2,
                borderRadius: "8px",
                fontWeight: "600",
                backgroundColor: "#1a1a1a",
                textTransform: "none",
                "&:hover": { backgroundColor: "#333333" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? "Atualizar Registro" : "Confirmar e Salvar"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Modal de Contribuição por Membro */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: "700", pb: 1, fontSize: "1.1rem" }}>
          Vincular Membro à Contribuição
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <Autocomplete
            options={membros || []}
            getOptionLabel={(option) => option.nome || ""}
            value={selectedMembro}
            onChange={(e, newValue) => setSelectedMembro(newValue)}
            renderInput={(params) => <TextField {...params} label="Procurar membro..." variant="outlined" />}
            sx={{ mb: 2.5, mt: 1 }}
          />
          <TextField
            type="number"
            label="Valor do Contributo"
            fullWidth
            value={valorMembro}
            onChange={(e) => setValorMembro(e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>Kz</Typography>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit" sx={{ textTransform: "none", fontWeight: "600" }}>
            Voltar
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleAddMembroContribuicao}
            sx={{
              textTransform: "none",
              fontWeight: "600",
              backgroundColor: "#1a1a1a",
              "&:hover": { backgroundColor: "#333333" },
            }}
          >
            Adicionar à lista
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}