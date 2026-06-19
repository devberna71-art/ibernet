// Resumo.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper
} from "@mui/material";
import {
  AssignmentTurnedIn as SummaryIcon,
  People as PeopleIcon,
  MonetizationOn as MoneyIcon,
  AccessTime as TimeIcon,
  Church as ChurchIcon
} from "@mui/icons-material";

export default function Resumo({ formData, tiposCulto, tiposContribuicao, membros }) {
  // Encontrar o nome do tipo de culto selecionado
  const cultoSelecionado = (tiposCulto || []).find(
    (t) => t.id === parseInt(formData.tipoCultoId)
  );

  // Calcular totais de pessoas
  const totalPessoas =
    (Number(formData.homens) || 0) +
    (Number(formData.mulheres) || 0) +
    (Number(formData.criancas) || 0);

  // Calcular o total geral financeiro de todas as contribuições combinadas
  let totalFinanceiroGeral = 0;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "24px",
        position: "sticky",
        top: "24px",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        background: "radial-gradient(circle at top right, #ffffff 0%, #fdfbf7 100%)",
        boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.03)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.07)",
          borderColor: "rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)"
        },
      }}
    >
      {/* Detalhe Decorativo Superior Minimalista */}
      <Box sx={{ height: "4px", background: "linear-gradient(90deg, #1a1a1a 0%, #718096 100%)" }} />

      <CardContent sx={{ p: 4 }}>
        {/* Header Ultra Premium */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" gap={1.2}>
            <Box 
              sx={{ 
                p: 0.8, 
                bgcolor: "#1a1a1a", 
                borderRadius: "8px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}
            >
              <SummaryIcon sx={{ color: "#ffffff", fontSize: "1.1rem" }} />
            </Box>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{ color: "#1a1a1a", letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.75rem" }}
            >
              Sumário Executivo
            </Typography>
          </Box>
          
          <Chip 
            label="Sincronizado" 
            size="small" 
            sx={{ 
              backgroundColor: "rgba(46, 125, 50, 0.08)", 
              color: "#2e7d32", 
              fontWeight: "800", 
              fontSize: "0.65rem",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              height: "22px",
              border: "1px solid rgba(46, 125, 50, 0.15)",
              "& .MuiChip-label": { px: 1 },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#2e7d32",
                left: "-8px",
                display: "none" // mantido limpo
              }
            }} 
          />
        </Box>

        {/* Bloco 1: Metadados da Sessão */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3.5 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <ChurchIcon fontSize="small" sx={{ color: "#a0aec0" }} />
            <Box>
              <Typography variant="caption" fontWeight="600" color="textSecondary" sx={{ textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                Identificação do Culto
              </Typography>
              <Typography variant="body2" fontWeight="800" color="#1a1a1a" sx={{ mt: 0.2, fontSize: "0.9rem" }}>
                {cultoSelecionado ? cultoSelecionado.nome : "Pendente..."}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <TimeIcon fontSize="small" sx={{ color: "#a0aec0" }} />
            <Box>
              <Typography variant="caption" fontWeight="600" color="textSecondary" sx={{ textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                Cronologia
              </Typography>
              <Typography variant="body2" fontWeight="700" color="#2d3748" sx={{ mt: 0.2, fontSize: "0.85rem" }}>
                {formData.dataHora
                  ? new Date(formData.dataHora).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })
                  : "Aguardando horário"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)", my: 3 }} />

        {/* Bloco 2: Frequência Inteligente */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="caption"
            fontWeight="800"
            color="textSecondary"
            display="flex"
            alignItems="center"
            gap={0.8}
            sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "0.8px", fontSize: "0.65rem" }}
          >
            <PeopleIcon fontSize="inherit" /> Auditoria de Presença
          </Typography>
          
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ 
              p: 2, 
              bgcolor: "rgba(0, 0, 0, 0.02)", 
              borderRadius: "14px", 
              mb: 1.5, 
              border: "1px solid rgba(0, 0, 0, 0.03)" 
            }}
          >
            <Typography variant="body2" fontWeight="700" color="#4a5568">Quorum Total Presente</Typography>
            <Typography variant="h6" fontWeight="900" color="#1a1a1a" sx={{ fontFamily: "monospace" }}>{totalPessoas}</Typography>
          </Box>

          <Grid container spacing={1.5}>
            {[
              { label: "Homens", value: formData.homens },
              { label: "Mulheres", value: formData.mulheres },
              { label: "Crianças", value: formData.criancas }
            ].map((item, idx) => (
              <Grid item xs={4} key={idx}>
                <Paper 
                  elevation={0}
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    textAlign: "center", 
                    borderRadius: "12px", 
                    bgcolor: "#ffffff", 
                    borderColor: "rgba(0, 0, 0, 0.05)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.01)"
                  }}
                >
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: "0.65rem", fontWeight: "600" }}>{item.label}</Typography>
                  <Typography variant="body2" fontWeight="800" color="#1a1a1a" sx={{ mt: 0.5 }}>{item.value || 0}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)", my: 3 }} />

        {/* Bloco 3: Finanças de Alta Performance */}
        <Box>
          <Typography
            variant="caption"
            fontWeight="800"
            color="textSecondary"
            display="flex"
            alignItems="center"
            gap={0.8}
            sx={{ mb: 2, textTransform: "uppercase", letterSpacing: "0.8px", fontSize: "0.65rem" }}
          >
            <MoneyIcon fontSize="inherit" /> Lançamentos de Receita
          </Typography>

          <List disablePadding dense sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {(tiposContribuicao || []).map((tipo) => {
              const valorGeral = Number(formData.contribuicoes[tipo.id]) || 0;
              const membrosObj = formData.membrosContribuicoes[tipo.id] || {};
              const totalMembros = Object.values(membrosObj).reduce((a, b) => a + Number(b), 0);
              const totalCategoria = valorGeral + totalMembros;
              
              totalFinanceiroGeral += totalCategoria;

              if (totalCategoria === 0) return null;

              return (
                <ListItem 
                  key={tipo.id} 
                  disableGutters 
                  sx={{ 
                    py: 1.2, 
                    px: 2,
                    bgcolor: "#ffffff", 
                    borderRadius: "12px", 
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.01)"
                  }}
                >
                  <ListItemText
                    primary={tipo.nome}
                    secondary={valorGeral > 0 ? `Depósito Geral: ${valorGeral.toLocaleString()} Kz` : "Membros identificados"}
                    primaryTypographyProps={{ variant: "body2", fontWeight: "800", color: "#2d3748" }}
                    secondaryTypographyProps={{ variant: "caption", color: "textSecondary", sx: { fontSize: "0.65rem" } }}
                  />
                  <Typography variant="body2" fontWeight="800" color="#1a1a1a" sx={{ fontFamily: "monospace" }}>
                    {totalCategoria.toLocaleString()} Kz
                  </Typography>
                </ListItem>
              );
            })}
          </List>

          {/* Card Matriz de Fechamento Monetário */}
          <Box
            sx={{
              mt: 4,
              p: 2.5,
              background: "linear-gradient(135deg, #0f0f11 0%, #1a1a24 100%)",
              borderRadius: "16px",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)"
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px", fontSize: "0.6rem" }}>
                Balanço Consolidado
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ color: "#ffffff", opacity: 0.9, mt: 0.2 }}>
                Ativo Líquido
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: "-0.5px", color: "#fff", fontFamily: "monospace" }}>
              {totalFinanceiroGeral.toLocaleString()} Kz
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}