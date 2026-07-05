import React, { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import Button from "../components/ui/Button";
import logoBernet from "../assets/Logo-Bernet.png";

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
      const role = res.data.usuario?.funcao;
      if (role === "usuario") {
        window.location.href = "/perfil";
      } else if (role === "moderador") {
        window.location.href = "/lista-cultos";
      } else {
        // admin, superadmin
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Painel esquerdo — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-bgSection border-r border-border p-10">
        <div>
          <img src={logoBernet} alt="Logo Bernet" className="h-9 object-contain mb-8" />
          <h2 className="text-[28px] font-bold text-text leading-tight mb-3">
            Gestão eclesiástica<br />inteligente e confiável.
          </h2>
          <p className="text-body text-textMuted leading-relaxed">
            Gerencie membros, finanças, cultos e comunicações em um único sistema
            pensado para igrejas modernas.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-4">
          {[
            "Controle de membros e cartões",
            "Gestão financeira completa",
            "Ata e agenda de cultos",
            "Comunicação interna segura",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-sm bg-primarySoft flex items-center justify-center shrink-0">
                <ArrowRight size={12} strokeWidth={2} className="text-primary" />
              </span>
              <span className="text-body text-textMuted">{feat}</span>
            </div>
          ))}
        </div>

        <p className="text-muted text-textMuted">
          © {new Date().getFullYear()} Bernet@-Eclesia
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logoBernet} alt="Logo Bernet" className="h-10 object-contain" />
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-primarySoft mb-4">
              <Lock size={20} strokeWidth={1.75} className="text-primary" />
            </div>
            <h1 className="text-[22px] font-semibold text-text mb-1">Entrar no sistema</h1>
            <p className="text-body text-textMuted">Acesse sua conta para continuar</p>
          </div>

          {/* Alertas */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-sm bg-danger/5 border border-danger/20 text-danger text-body">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-sm bg-successSoft border border-success/20 text-success text-body">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo nome */}
            <div>
              <label htmlFor="login-nome" className="block text-muted font-medium text-textMuted mb-1.5">
                Nome de usuário
              </label>
              <input
                id="login-nome"
                name="nome"
                type="text"
                autoComplete="username"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome de usuário"
                className="w-full px-3 py-2.5 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Campo senha */}
            <div>
              <label htmlFor="login-senha" className="block text-muted font-medium text-textMuted mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-2 justify-center"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={1.75} />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-body text-textMuted mb-3">Ainda não tem conta?</p>
            <Link
              to="/criar-usuarios"
              className="inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-[#3B4AE8] transition-colors"
              id="login-create-account-link"
            >
              Criar conta
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
