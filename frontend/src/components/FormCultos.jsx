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
  Alpha,
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

// Importação do novo componente criado
import Resumo from "./Resumo";

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

  // Estilos compartilhados Premium para Inputs
  const premiumInputStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f9fbfd",
      borderRadius: "10px",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#1a1a1a", borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a1a" },
  };

  // Buscar dados iniciais
  useEffect(() => {
    (async () => {
      try {
        const [tiposRes, contribRes, membrosRes] = await Promise.all([
          api.get("/lista/tipos-culto"),
          api.get("/lista/tipos-contribuicao"),
          api.get("/membros"),
        ]);
        
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
      loading && setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 3 : 5,
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        backgroundColor: "#ffffff",
        maxWidth: "1250px",
        margin: "0 auto",
        border: "1px solid #f1f5f9",
      }}
    >
      {/* Cabeçalho Premium */}
      <Box sx={{ mb: 5, borderBottom: "1px solid #f1f5f9", pb: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="800"
          sx={{ color: "#0f172a", letterSpacing: "-0.8px", mb: 1 }}
        >
          {isEdit ? "Editar Detalhes do Culto" : "Novo Registro de Culto"}
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b", fontWeight: "400" }}>
          Gerencie e documente a frequência corporativa e os fluxos financeiros deste culto.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          
          {/* LADO ESQUERDO: Formulários de Preenchimento */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              
              {/* Sessão 1: Informações Gerais */}
              <Grid item xs={12}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: "16px", 
                    backgroundColor: "#ffffff", 
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      sx={{ color: "#1e293b", mb: 3, letterSpacing: "-0.2px" }}
                    >
                      <Box sx={{ p: 1, bgcolor: "#f1f5f9", borderRadius: "8px", display: "flex" }}>
                        <EventIcon fontSize="small" sx={{ color: "#475569" }} />
                      </Box>
                      Dados Gerais Básicos
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Data e Hora"
                          type="datetime-local"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={formData.dataHora}
                          onChange={(e) => handleChange("dataHora", e.target.value)}
                          sx={premiumInputStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Tipo de Culto"
                          fullWidth
                          value={formData.tipoCultoId}
                          onChange={(e) => handleChange("tipoCultoId", e.target.value)}
                          sx={premiumInputStyles}
                        >
                          {(tiposCulto || []).map((tipo) => (
                            <MenuItem key={tipo.id} value={tipo.id} sx={{ py: 1.5, borderRadius: "8px", mx: 1, my: 0.5 }}>
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
              <Grid item xs={12}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: "16px", 
                    backgroundColor: "#ffffff", 
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      sx={{ color: "#1e293b", mb: 3, letterSpacing: "-0.2px" }}
                    >
                      <Box sx={{ p: 1, bgcolor: "#f1f5f9", borderRadius: "8px", display: "flex" }}>
                        <PeopleIcon fontSize="small" sx={{ color: "#475569" }} />
                      </Box>
                      Frequência & Presença
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          type="number"
                          label="Homens"
                          fullWidth
                          value={formData.homens}
                          onChange={(e) => handleChange("homens", e.target.value)}
                          sx={premiumInputStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          type="number"
                          label="Mulheres"
                          fullWidth
                          value={formData.mulheres}
                          onChange={(e) => handleChange("mulheres", e.target.value)}
                          sx={premiumInputStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          type="number"
                          label="Crianças"
                          fullWidth
                          value={formData.criancas}
                          onChange={(e) => handleChange("criancas", e.target.value)}
                          sx={premiumInputStyles}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sessão 3: Finanças/Contribuições */}
              <Grid item xs={12}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: "16px", 
                    backgroundColor: "#ffffff", 
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      sx={{ color: "#1e293b", mb: 3, letterSpacing: "-0.2px" }}
                    >
                      <Box sx={{ p: 1, bgcolor: "#f1f5f9", borderRadius: "8px", display: "flex" }}>
                        <MoneyIcon fontSize="small" sx={{ color: "#475569" }} />
                      </Box>
                      Gestão Financeira Avançada
                    </Typography>

                    <Grid container spacing={3}>
                      {(tiposContribuicao || []).map((tipo) => (
                        <Grid item xs={12} key={tipo.id}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 3, 
                              bgcolor: "#f8fbc20", 
                              borderRadius: "14px", 
                              border: "1px solid #f1f5f9",
                              backgroundImage: "linear-gradient(to right, #fafafa, #ffffff)"
                            }}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
                              <Typography fontWeight="700" variant="body1" color="#0f172a">
                                {tipo.nome}
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                  setModalTipoId(tipo.id);
                                  setOpenModal(true);
                                }}
                                sx={{ 
                                  textTransform: "none", 
                                  fontWeight: "600",
                                  borderRadius: "8px",
                                  borderColor: "#e2e8f0",
                                  color: "#334155",
                                  bgcolor: "#fff",
                                  "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" }
                                }}
                              >
                                Vincular Membro
                              </Button>
                            </Box>

                            <TextField
                              type="number"
                              label="Valor Geral / Colecta Anónima"
                              fullWidth
                              size="medium"
                              value={formData.contribuicoes[tipo.id] || ""}
                              onChange={(e) => handleContribuicaoChange(tipo.id, e.target.value)}
                              InputProps={{
                                startAdornment: <Typography variant="body2" sx={{ mr: 1.5, color: "#94a3b8", fontWeight: "600" }}>Kz</Typography>,
                              }}
                              sx={premiumInputStyles}
                            />

                            <Box display="flex" justifyContent="space-between" mt={2} px={1}>
                              <Typography variant="body2" sx={{ color: "#64748b" }}>Total Combinado:</Typography>
                              <Typography variant="body2" fontWeight="700" color="#0f172a">
                                {getVisualTotal(tipo.id).toLocaleString()} Kz
                              </Typography>
                            </Box>

                            {formData.membrosContribuicoes[tipo.id] &&
                              Object.keys(formData.membrosContribuicoes[tipo.id]).length > 0 && (
                                <Box sx={{ mt: 2.5, borderTop: "1px dashed #e2e8f0", pt: 2 }}>
                                  {isMobile ? (
                                    Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                      const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                      return (
                                        <Box 
                                          key={membroId} 
                                          display="flex" 
                                          justifyContent="space-between" 
                                          alignItems="center"
                                          sx={{ bgcolor: "#fff", p: 1.5, my: 1, borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                        >
                                          <Box>
                                            <Typography variant="body2" fontWeight="600" color="#334155" sx={{ textTransform: "capitalize" }}>
                                              {membro?.nome || "Membro"}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "500" }}>{valor} Kz</Typography>
                                          </Box>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                            sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}
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
                                          <TableCell sx={{ pl: 1, borderColor: "#f1f5f9" }}><Typography variant="caption" fontWeight="700" color="#64748b">MEMBRO IDENTIFICADO</Typography></TableCell>
                                          <TableCell sx={{ borderColor: "#f1f5f9" }}><Typography variant="caption" fontWeight="700" color="#64748b">VALOR DECLARADO</Typography></TableCell>
                                          <TableCell align="right" sx={{ pr: 1, borderColor: "#f1f5f9" }}></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                          const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                          return (
                                            <TableRow key={membroId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                              <TableCell sx={{ pl: 1, py: 1.5, textTransform: "capitalize", fontSize: "0.875rem", color: "#334155", fontWeight: "500", borderColor: "#f1f5f9" }}>
                                                {membro?.nome || "Membro"}
                                              </TableCell>
                                              <TableCell sx={{ py: 1.5, fontSize: "0.875rem", fontWeight: "700", color: "#0f172a", borderColor: "#f1f5f9" }}>
                                                {valor?.toLocaleString()} Kz
                                              </TableCell>
                                              <TableCell align="right" sx={{ pr: 1, py: 1.5, borderColor: "#f1f5f9" }}>
                                                <IconButton 
                                                  size="small" 
                                                  onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                                  sx={{ color: "#disabled", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}
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
            </Grid>
          </Grid>

          {/* LADO DIREITO: Componente Resumo Acoplado */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: "24px" }}>
              <Resumo 
                formData={formData} 
                tiposCulto={tiposCulto} 
                tiposContribuicao={tiposContribuicao} 
                membros={membros} 
              />
            </Box>
          </Grid>

          {/* Botões de Ação do Formulário */}
          <Grid item xs={12} display="flex" flexDirection={isMobile ? "column-reverse" : "row"} justifyContent="flex-end" gap={2} sx={{ mt: 3, borderTop: "1px solid #f1f5f9", pt: 4 }}>
            <Button
              variant="text"
              onClick={onCancel}
              fullWidth={isMobile}
              sx={{
                px: 4,
                py: 1.6,
                borderRadius: "12px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": { backgroundColor: "#f1f5f9", color: "#334155" }
              }}
            >
              Cancelar Operação
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              fullWidth={isMobile}
              disabled={loading}
              sx={{
                px: 5,
                py: 1.6,
                borderRadius: "12px",
                fontWeight: "700",
                backgroundColor: "#0f172a",
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
                "&:hover": { backgroundColor: "#1e293b", boxShadow: "0 6px 20px rgba(15,23,42,0.2)" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? "Atualizar Registro" : "Finalizar e Lançar"}
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
        PaperProps={{ 
          sx: { 
            borderRadius: "20px", 
            p: 2,
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: "800", pb: 1, fontSize: "1.25rem", color: "#0f172a", letterSpacing: "-0.4px" }}>
          Vincular Membro Ativo
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            Selecione o membro na base de dados para atribuir um valor nominal específico.
          </Typography>
          <Autocomplete
            options={membros || []}
            getOptionLabel={(option) => option.nome || ""}
            value={selectedMembro}
            onChange={(e, newValue) => setSelectedMembro(newValue)}
            renderInput={(params) => <TextField {...params} label="Procurar membro pelo nome..." variant="outlined" />}
            sx={{ mb: 3, ...premiumInputStyles }}
          />
          <TextField
            type="number"
            label="Quantia do Contributo"
            fullWidth
            value={valorMembro}
            onChange={(e) => setValorMembro(e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1.5, color: "#94a3b8", fontWeight: "600" }}>Kz</Typography>,
            }}
            sx={premiumInputStyles}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, mt: 2 }}>
          <Button 
            onClick={() => setOpenModal(false)} 
            color="inherit" 
            sx={{ textTransform: "none", fontWeight: "700", borderRadius: "10px", color: "#64748b" }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleAddMembroContribuicao}
            sx={{
              textTransform: "none",
              fontWeight: "700",
              borderRadius: "10px",
              backgroundColor: "#0f172a",
              px: 3,
              "&:hover": { backgroundColor: "#1e293b" },
            }}
          >
            Confirmar Vínculo
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}