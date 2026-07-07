// src/pages/CriarUsuarios.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  ArrowLeft,
} from "lucide-react";
import api from "../api/axiosConfig";
import Button from "../components/ui/Button";
import logoEclesia from "../assets/logo-ofi.png";

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
    filialNome: "",
    filialEndereco: "",
    filialTelefone: "",
    filialEmail: "",
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
        setError("Erro ao verificar status operacional do administrador master.");
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
    if (!formData.nome || !formData.senha || !formData.funcao || formData.funcao === "nenhuma") {
      setError("Por favor, selecione as credenciais obrigatórias: Nome, Senha e Função.");
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
        filialNome: "",
        filialEndereco: "",
        filialTelefone: "",
        filialEmail: "",
      });
      setModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Ocorreu um erro ao registar a infraestrutura.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-2">
        <Loader2 size={20} className="text-primary animate-spin" />
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">A validar repositório central...</p>
      </div>
    );
  }

  const funcoesDisponiveis = superAdminExiste
    ? ["nenhuma", ...todasFuncoes.filter((f) => f !== "super_admin")]
    : ["nenhuma", "super_admin"];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-left antialiased">
      <div className="w-full max-w-2xl bg-white rounded-md border border-slate-200 p-6 sm:p-10 shadow-sm">

        {/* Cabeçalho de Auditoria */}
        <div className="flex flex-col items-start mb-8 border-b border-slate-100 pb-5">

          <div className="w-full max-w-2xl mb-4 flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Voltar ao início
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primarySoft text-primary shrink-0">
              <UserPlus size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Registo de Ambiente Administrativo</h1>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                Configure os dados estruturais e a conta master da sua igreja.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Secção 1: Credenciais do Utilizador */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-1.5 border-b border-slate-50">
              <User size={13} className="text-slate-300" />
              Credenciais de Acesso
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nome do Usuário <span className="text-red-500">*</span>
                </label>
                <input
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: admin_geral"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Senha Secreta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 pr-10 text-xs bg-white border border-slate-200 rounded-md rounded-r-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nível de Permissão (Função) <span className="text-red-500">*</span>
                </label>
                <select
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-700"
                >
                  {funcoesDisponiveis.map((f) => (
                    <option key={f} value={f}>
                      {f === "nenhuma"
                        ? "Selecione uma função operacional"
                        : f.toUpperCase().replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Secção 2: Dados da Sede */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-1.5 border-b border-slate-50">
              <Building size={13} className="text-slate-300" />
              Especificações da Sede
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nome da Sede</label>
                <input
                  name="sedeNome"
                  type="text"
                  value={formData.sedeNome}
                  onChange={handleChange}
                  placeholder="Ex: Sede Central Luanda"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Endereço de Localização</label>
                <input
                  name="sedeEndereco"
                  type="text"
                  value={formData.sedeEndereco}
                  onChange={handleChange}
                  placeholder="Rua, Bairro, Província"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contacto Telefónico</label>
                <input
                  name="sedeTelefone"
                  type="text"
                  value={formData.sedeTelefone}
                  onChange={handleChange}
                  placeholder="Ex: +244 9xx xxx xxx"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Correio Eletrónico (Email)</label>
                <input
                  name="sedeEmail"
                  type="email"
                  value={formData.sedeEmail}
                  onChange={handleChange}
                  placeholder="contato@igrejasede.org"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Secção 3: Dados da Filial */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-1.5 border-b border-slate-50">
              <Building size={13} className="text-slate-300" />
              Especificações da Filial Adjunta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nome da Filial</label>
                <input
                  name="filialNome"
                  type="text"
                  value={formData.filialNome}
                  onChange={handleChange}
                  placeholder="Ex: Filial Nova Jerusalém"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Endereço de Localização</label>
                <input
                  name="filialEndereco"
                  type="text"
                  value={formData.filialEndereco}
                  onChange={handleChange}
                  placeholder="Rua, Bairro, Província"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contacto Telefónico</label>
                <input
                  name="filialTelefone"
                  type="text"
                  value={formData.filialTelefone}
                  onChange={handleChange}
                  placeholder="Ex: +244 9xx xxx xxx"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Correio Eletrónico (Email)</label>
                <input
                  name="filialEmail"
                  type="email"
                  value={formData.filialEmail}
                  onChange={handleChange}
                  placeholder="filial@igreja.org"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5 rounded-md shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  A processar registo...
                </>
              ) : (
                "Finalizar Configuração de Ambiente"
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-500">
              Já possui uma credencial operacional?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline transition-all"
              >
                Autenticar no Sistema
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal Corporativo de Confirmação */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-md border border-slate-200 shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">Registo Efetuado</h3>
            <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">
              O ambiente foi provisionado com sucesso. Aguarde pela validação ou entre em contacto com os canais da <strong>Bernet@</strong>.
            </p>
            <Button
              onClick={() => {
                setModalOpen(false);
                navigate("/login");
              }}
              variant="primary"
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2 rounded-md"
            >
              Aceder ao Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}