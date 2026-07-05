import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Lock,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
} from "lucide-react";
import api from "../api/axiosConfig";
import Button from "../components/ui/Button";
import logoEclesia from "../assets/Logo-Eclesia.svg";

export default function CriarUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    senha: "",
    funcao: "nenhuma",
    sedeNome: "",
    sedeEndereco: "",
    sedeTelefone: "",
    sedeEmail: "",
    filhalNome: "",
    filhalEndereco: "",
    filhalTelefone: "",
    filhalEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [superAdminExiste, setSuperAdminExiste] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const todasFuncoes = ["super_admin", "admin", "moderador", "usuario"];

  useEffect(() => {
    const verificarSuperAdmin = async () => {
      try {
        const res = await api.get("/verificar-super-admin");
        setSuperAdminExiste(res.data.existe);
      } catch {
        setError("Erro ao verificar super_admin.");
        setSuperAdminExiste(false);
      } finally {
        setChecking(false);
      }
    };
    verificarSuperAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.senha || !formData.funcao) {
      setError("Por favor, preencha os campos obrigatórios: Nome, Senha e Função.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/usuarios", formData);
      setFormData({
        nome: "",
        senha: "",
        funcao: "nenhuma",
        sedeNome: "",
        sedeEndereco: "",
        sedeTelefone: "",
        sedeEmail: "",
        filhalNome: "",
        filhalEndereco: "",
        filhalTelefone: "",
        filhalEmail: "",
      });
      setModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} strokeWidth={1.75} className="text-primary animate-spin" />
        <p className="text-body text-textMuted font-medium">Verificando status do sistema...</p>
      </div>
    );
  }

  const funcoesDisponiveis = superAdminExiste
    ? ["nenhuma", ...todasFuncoes.filter((f) => f !== "super_admin")]
    : ["nenhuma", "super_admin"];

  return (
    <div className="min-h-screen bg-bgSection py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-surface rounded-lg border border-border p-6 sm:p-10 shadow-sm relative">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/">
            <img src={logoEclesia} alt="Eclesia Logo" className="h-9 object-contain mb-4" />
          </Link>
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-primarySoft mb-3">
            <UserPlus size={20} strokeWidth={1.75} className="text-primary" />
          </div>
          <h1 className="text-[22px] font-semibold text-text">Inscreva a sua Igreja</h1>
          <p className="text-body text-textMuted mt-1">
            Preencha os dados abaixo para configurar o seu ambiente de gestão
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-sm bg-danger/5 border border-danger/20 text-danger text-body flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Seção 1: Dados do Usuário */}
          <div>
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4 border-b border-border pb-1.5">
              <User size={15} />
              Dados do Usuário
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Nome do Usuário <span className="text-danger">*</span>
                </label>
                <input
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome de login"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Senha <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    className="w-full px-3 py-2 pr-10 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Função <span className="text-danger">*</span>
                </label>
                <select
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  {funcoesDisponiveis.map((f) => (
                    <option key={f} value={f}>
                      {f === "nenhuma"
                        ? "Selecione uma função"
                        : f.charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2: Dados da Sede */}
          <div>
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4 border-b border-border pb-1.5">
              <Building size={15} />
              Dados da Sede
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Nome da Sede</label>
                <input
                  name="sedeNome"
                  type="text"
                  value={formData.sedeNome}
                  onChange={handleChange}
                  placeholder="Ex: Sede Central"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Endereço</label>
                <input
                  name="sedeEndereco"
                  type="text"
                  value={formData.sedeEndereco}
                  onChange={handleChange}
                  placeholder="Rua, Bairro, Cidade"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Telefone</label>
                <input
                  name="sedeTelefone"
                  type="text"
                  value={formData.sedeTelefone}
                  onChange={handleChange}
                  placeholder="Contacto telefónico"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Email</label>
                <input
                  name="sedeEmail"
                  type="email"
                  value={formData.sedeEmail}
                  onChange={handleChange}
                  placeholder="email@sede.com"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Dados da Filial */}
          <div>
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4 border-b border-border pb-1.5">
              <Building size={15} />
              Dados da Filial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Nome da Filial</label>
                <input
                  name="filhalNome"
                  type="text"
                  value={formData.filhalNome}
                  onChange={handleChange}
                  placeholder="Ex: Filial 1"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Endereço</label>
                <input
                  name="filhalEndereco"
                  type="text"
                  value={formData.filhalEndereco}
                  onChange={handleChange}
                  placeholder="Rua, Bairro, Cidade"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Telefone</label>
                <input
                  name="filhalTelefone"
                  type="text"
                  value={formData.filhalTelefone}
                  onChange={handleChange}
                  placeholder="Contacto telefónico"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Email</label>
                <input
                  name="filhalEmail"
                  type="email"
                  value={formData.filhalEmail}
                  onChange={handleChange}
                  placeholder="email@filial.com"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
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
                "Cadastrar Usuário"
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-body text-textMuted">
              Já possui uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primaryHover transition-colors"
              >
                Faça o Login
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal de Sucesso */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-surface rounded-lg border border-border shadow-lg max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-successSoft flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Cadastro Realizado!</h3>
            <p className="text-sm text-textMuted mb-6 leading-relaxed">
              Obrigado por se cadastrar! Aguarde a aprovação ou entre em contato com a equipe da <strong>Bernet@</strong>.
            </p>
            <Button
              onClick={() => {
                setModalOpen(false);
                navigate("/login");
              }}
              variant="primary"
              className="w-full justify-center"
            >
              Ir para o Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
