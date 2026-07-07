import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Building, User, Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import axios from "../api/axiosConfig";
import Button from "../components/ui/Button";
import logoEclesia from "../assets/logo-ofi.png";

const CadastroMembroUser = () => {
  const [sedes, setSedes] = useState([]);
  const [filhals, setFilhals] = useState([]);
  const [form, setForm] = useState({
    SedeId: "",
    FilhalId: "",
    nome: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/sedes-com-filhais")
      .then(res => setSedes(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const sedeSelecionada = sedes.find(s => s.id === form.SedeId);
    setFilhals(sedeSelecionada ? sedeSelecionada.Filhals : []);
    setForm(prev => ({ ...prev, FilhalId: "" }));
  }, [form.SedeId, sedes]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/membros/cadastrar-pendente", form);
      setMessage(res.data.message);
      setForm({ SedeId: "", FilhalId: "", nome: "", senha: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Erro ao cadastrar membro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgSection py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-surface rounded-lg border border-border p-6 sm:p-10 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/">
            <img src={logoEclesia} alt="Eclesia Logo" className="h-12 object-contain mb-4" />
          </Link>
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-primarySoft mb-3">
            <UserPlus size={20} strokeWidth={1.75} className="text-primary" />
          </div>
          <h1 className="text-[22px] font-semibold text-text">Criar Conta de Membro</h1>
          <p className="text-body text-textMuted mt-1">
            Preencha seus dados para solicitar acesso à sua congregação
          </p>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-sm text-body flex items-start gap-2.5 ${
            message.includes("sucesso") || message.includes("Realizado")
              ? "bg-successSoft border border-success/20 text-success"
              : "bg-danger/5 border border-danger/20 text-danger"
          }`}>
            {message.includes("sucesso") || message.includes("Realizado") ? (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            ) : null}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sede */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1.5">
              <Building size={13} className="text-textMuted" />
              Sede <span className="text-danger">*</span>
            </label>
            <select
              name="SedeId"
              value={form.SedeId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Selecione a sua congregação sede</option>
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>
                  {sede.nome} ({sede.quantidadeMembros} membros)
                </option>
              ))}
            </select>
          </div>

          {/* Filial */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1.5">
              <Building size={13} className="text-textMuted" />
              Filial
            </label>
            <select
              name="FilhalId"
              value={form.FilhalId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Nenhuma (Filiar-se diretamente à Sede)</option>
              {filhals.map(filhal => (
                <option key={filhal.id} value={filhal.id}>
                  {filhal.nome} ({filhal.quantidadeMembros} membros)
                </option>
              ))}
            </select>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-textMuted" />
              Nome Completo <span className="text-danger">*</span>
            </label>
            <input
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-textMuted" />
              Senha <span className="text-danger">*</span>
            </label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
              placeholder="Escolha uma senha segura"
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta de Membro"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-textMuted hover:text-text transition-colors"
          >
            <ArrowLeft size={12} />
            Voltar para o Login
          </Link>
          <Link
            to="/"
            className="text-primary hover:text-primaryHover font-semibold transition-colors"
          >
            Voltar ao início
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CadastroMembroUser;
