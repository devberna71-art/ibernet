
// src/components/FormCategoria.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import api from "../api/axiosConfig";

export default function FormCategoria({
  categoria = null,
  onSuccess,
  onCancel,
}) {
  const [nome, setNome] = useState(categoria?.nome || "");
  const [descricao, setDescricao] = useState(categoria?.descricao || "");
  const [ativa, setAtiva] = useState(
    categoria?.ativa !== undefined ? categoria.ativa : true
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      return alert("O nome da categoria é obrigatório.");
    }

    setLoading(true);

    const payload = {
      nome,
      descricao: descricao || null,
      ativa,
    };

    try {
      if (categoria) {
        await api.put(`/categorias/${categoria.id}`, payload);
      } else {
        await api.post("/categorias", payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        background: "#ffffff",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* TÍTULO */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 4,
          }}
        >
          {categoria ? "Editar Categoria" : "Nova Categoria"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* CAMPOS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Nome da Categoria"
              placeholder="Ex: Alimentação"
              fullWidth
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={cleanInput}
            />

            <TextField
              label="Descrição"
              placeholder="Descrição da categoria"
              fullWidth
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              sx={cleanInput}
            />
          </Box>

          {/* STATUS */}
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              p: 2,
              mb: 4,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={ativa}
                  onChange={(e) => setAtiva(e.target.checked)}
                />
              }
              label="Categoria activa"
            />
          </Box>

          {/* BOTÕES */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 3,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button
              onClick={onCancel}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                height: 44,
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background: "#111827",
                boxShadow: "none",

                "&:hover": {
                  background: "#000000",
                  boxShadow: "none",
                },
              }}
            >
              {loading
                ? "Salvando..."
                : categoria
                ? "Actualizar Categoria"
                : "Cadastrar Categoria"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

const cleanInput = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    background: "#ffffff",

    "& fieldset": {
      borderColor: "#d1d5db",
    },

    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#111827",
      borderWidth: "1px",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#374151",
    fontWeight: 500,
  },
};

