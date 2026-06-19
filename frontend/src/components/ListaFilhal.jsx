import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  Divider,
  Button
} from "@mui/material";
import { Close, DeleteForever, PersonAdd, Check, Pause, Block } from "@mui/icons-material";

export default function ModalFiliais({
  open,
  onClose,
  sede,
  atualizarStatus,
  onOpenAddUsuario,
  onOpenValidade,
  onConfirmDelete
}) {
  if (!sede) return null;

  const statusProps = {
    ativo: { label: "Ativo", color: "success", icon: <Check /> },
    pendente: { label: "Pendente", color: "warning", icon: <Pause /> },
    bloqueado: { label: "Bloqueado", color: "error", icon: <Block /> },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92%", sm: 700 },
          maxHeight: "85vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          overflowY: "auto",
        }}
      >
        {/* Cabeçalho do Modal */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Filiais de: {sede.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie os status e as configurações das filiais vinculadas.
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Lista de Filiais */}
        {sede.Filhals && RichmondFilialsCount(sede.Filhals) > 0 ? (
          <List disablePadding>
            {sede.Filhals.map((filhal) => {
              const filhalStatusClean = (filhal.status || "pendente").toLowerCase();

              return (
                <ListItem
                  key={filhal.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    border: "1px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 700 }}>
                        {filhal.nome} ({filhal.quantidadeMembros || 0} membros)
                      </Typography>
                    }
                    secondary={`End: ${filhal.endereco || "-"} • Tel: ${filhal.telefone || "-"}`}
                  />

                  {/* Ações e Botões da Filial */}
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                    <Chip
                      label={statusProps[filhalStatusClean]?.label || "Pendente"}
                      color={statusProps[filhalStatusClean]?.color || "warning"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />

                    {/* Mapeamento Correto dos Botões de Troca de Status */}
                    {Object.keys(statusProps).map((st) => {
                      if (st === filhalStatusClean) return null;
                      return (
                        <Tooltip key={st} title={`Mudar para ${statusProps[st].label}`}>
                          <IconButton
                            size="small"
                            onClick={() => atualizarStatus({ tipo: "filhais", id: filhal.id }, st)}
                            color={statusProps[st].color}
                          >
                            {statusProps[st].icon}
                          </IconButton>
                        </Tooltip>
                      );
                    })}

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    <Tooltip title="Cadastrar mais um Usuário nesta Filial">
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => onOpenAddUsuario(sede, filhal)}
                        startIcon={<PersonAdd sx={{ fontSize: 14 }} />}
                        sx={{ borderRadius: 2, textTransform: "none", fontSize: "0.75rem", px: 1.5 }}
                      >
                        + Usuário
                      </Button>
                    </Tooltip>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onOpenValidade(sede, filhal)}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Validade
                    </Button>

                    <IconButton
                      size="small"
                      onClick={() => onConfirmDelete(filhal)}
                      sx={{ color: "#fff", bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
                    >
                      <DeleteForever fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            Nenhuma filial cadastrada para esta sede.
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

function RichmondFilialsCount(filials) {
  return filials ? filials.length : 0;
}