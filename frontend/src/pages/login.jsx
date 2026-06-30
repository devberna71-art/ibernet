import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#F6F1E9",
  },
  "& .MuiInputLabel-root": { color: "#8B8378" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#D97A4D",
  },
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ nome: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", formData);
      setSuccess(res.data.message || "Login realizado com sucesso!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-bg relative overflow-hidden"
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primarySoft/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-surfaceMuted/60 blur-3xl pointer-events-none" />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-surface rounded-lg shadow-soft border border-surfaceMuted p-8 md:p-10"
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-primarySoft text-primary mb-4">
            <Lock size={26} strokeWidth={1.75} />
          </div>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "#211D19", fontSize: "28px", mb: 1 }}
          >
            Entrar no Sistema
          </Typography>
          <Typography sx={{ color: "#8B8378", fontSize: "14px" }}>
            Acesse sua conta para continuar
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Nome de Usuário"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            margin="normal"
            sx={inputSx}
          />

          <TextField
            fullWidth
            label="Senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            value={formData.senha}
            onChange={handleChange}
            required
            margin="normal"
            sx={{ ...inputSx, mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <LogIn size={18} />
            }
            sx={{
              py: 1.5,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
              backgroundColor: "#D97A4D",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#C56A3F", boxShadow: "none" },
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 1.5, color: "#8B8378", fontSize: "14px" }}>
            Ainda não tem conta?
          </Typography>
          <Button
            component={Link}
            to="/criar-usuarios"
            variant="outlined"
            sx={{
              borderColor: "#D97A4D",
              color: "#D97A4D",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "#FBE3CF", borderColor: "#D97A4D" },
            }}
          >
            Criar Conta
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
