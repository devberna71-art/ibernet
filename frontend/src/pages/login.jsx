import React, { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Button from "../components/ui/Button";
import logoEclesia from "../assets/logo-ofi.png";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ nome: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.senha.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", formData);
      setSuccess(res.data.message || "Login realizado com sucesso!");
      
      await login(res.data.token, res.data.usuario);
      
      const role = res.data.usuario?.funcao;
      if (role === "usuario") {
        navigate("/perfil");
      } else if (role === "moderador") {
        navigate("/lista-cultos");
      } else if (role === "super_admin" || role === "superadmin") {
        navigate("/super-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg relative font-sans selection:bg-primarySoft selection:text-primary">
      {/* Painel esquerdo — branding */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-bgSection border-r border-border p-10">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-textMuted hover:text-text transition-colors mb-8 focus:outline-none focus:underline"
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
          <img src={logoEclesia} alt="Eclesia Logo" className="h-28 object-contain mb-8" />
          <h2 className="text-[28px] font-bold text-text leading-tight mb-3 tracking-tight">
            Gestão eclesiástica<br />inteligente e confiável.
          </h2>
          <p className="text-body text-textMuted leading-relaxed">
            Gerencie membros, finanças, cultos e comunicações em um único sistema
            pensado para igrejas modernas.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-4" role="list">
          {[
            "Controle de membros e cartões",
            "Gestão financeira completa",
            "Ata e agenda de cultos",
            "Comunicação interna segura",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3" role="listitem">
              <span className="w-5 h-5 rounded-sm bg-primarySoft flex items-center justify-center shrink-0">
                <ArrowRight size={12} strokeWidth={2.5} className="text-primary" />
              </span>
              <span className="text-body text-textMuted">{feat}</span>
            </div>
          ))}
        </div>

        <footer className="text-muted text-textMuted/80">
          © {new Date().getFullYear()} Bernet@-Eclesia
        </footer>
      </aside>

      {/* Painel direito — formulário */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo e navegação */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Link to="/" className="self-start text-textMuted hover:text-text transition-colors mb-4" aria-label="Voltar à página inicial">
              <ArrowLeft size={20} />
            </Link>
            <img src={logoEclesia} alt="Eclesia Logo" className="h-28 object-contain" />
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-primarySoft mb-4">
              <Lock size={20} strokeWidth={1.75} className="text-primary" />
            </div>
            <h1 className="text-[22px] font-semibold text-text mb-1 tracking-tight">Entrar no sistema</h1>
            <p className="text-body text-textMuted">Acesse sua conta para continuar</p>
          </div>

          {/* Feedbacks de Alerta */}
          {error && (
            <div role="alert" className="mb-4 px-4 py-3 rounded-sm bg-danger/5 border border-danger/20 text-danger text-body animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div role="alert" className="mb-4 px-4 py-3 rounded-sm bg-successSoft border border-success/20 text-success text-body animate-fade-in">
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
                disabled={loading}
                className="w-full px-3 py-2.5 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 transition-colors"
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
                  disabled={loading}
                  className="w-full px-3 py-2.5 pr-10 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text disabled:opacity-50 transition-colors focus:outline-none"
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
              className="w-full mt-2 justify-center gap-2"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={1.75} />
                  <span>Entrar</span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-body text-textMuted mb-3">Ainda não tem conta?</p>
            <Link
              to="/criar-usuarios"
              className="inline-flex items-center gap-1.5 text-body font-semibold text-primary hover:text-primaryHover transition-colors focus:outline-none focus:underline"
              id="login-create-account-link"
            >
              Criar conta
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}