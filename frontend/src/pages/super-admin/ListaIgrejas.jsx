import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  LogOut,
  UserCheck,
  Plus,
  Trash2,
  MoreVertical,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import CadastrarIgrejaDono from "../../components/CadastrarIgrejaDono";

export default function ListaIgrejas() {
  const [loading, setLoading] = useState(true);
  const [churches, setChurches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [toast, setToast] = useState(null);
  
  // Modais
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [supportLoginMode, setSupportLoginMode] = useState(null); // { name, type }

  useEffect(() => {
    fetchChurches();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchChurches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      const sedes = res.data || [];
      
      // Flatten Sedes and Filiais into a unified master list
      const flatList = [];
      sedes.forEach((s) => {
        flatList.push({
          id: s.id,
          nome: s.nome,
          tipo: "Sede",
          status: s.status || "pendente",
          membros: s.quantidadeMembros || 0,
          telefone: s.telefone || "-",
          email: s.email || "-",
          endereco: s.endereco || "-",
          sedeId: null,
          sedeNome: null,
        });

        if (s.Filhals && s.Filhals.length > 0) {
          s.Filhals.forEach((f) => {
            flatList.push({
              id: f.id,
              nome: f.nome,
              tipo: "Filial",
              status: f.status || "pendente",
              membros: f.quantidadeMembros || 0,
              telefone: f.telefone || "-",
              email: f.email || "-",
              endereco: f.endereco || "-",
              sedeId: s.id,
              sedeNome: s.nome,
            });
          });
        }
      });

      setChurches(flatList);
    } catch (err) {
      console.error("Erro ao buscar igrejas:", err);
      showToast("Erro ao carregar lista de igrejas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (church) => {
    const nextStatus = church.status === "ativo" ? "bloqueado" : "ativo";
    const endpointType = church.tipo === "Sede" ? "sedes" : "filhais";

    try {
      await api.patch(`/${endpointType}/${church.id}/status`, { status: nextStatus });
      setChurches((prev) =>
        prev.map((c) =>
          c.id === church.id && c.tipo === church.tipo ? { ...c, status: nextStatus } : c
        )
      );
      showToast(
        `Igreja "${church.nome}" foi ${nextStatus === "ativo" ? "ativada" : "suspensa"} com sucesso.`
      );
    } catch (err) {
      console.error(err);
      showToast("Erro ao alterar status da instituição.", "error");
    }
  };

  const handleSupportLogin = (church) => {
    setSupportLoginMode(church);
    showToast(`Sessão de suporte iniciada. A navegar como administrador de: ${church.nome}`);
  };

  const handleExitSupport = () => {
    setSupportLoginMode(null);
    showToast("Sessão de suporte encerrada. Retornou ao Super Admin.");
  };

  // Filter & Search Logic
  const filteredChurches = churches.filter((c) => {
    const matchesSearch =
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "todos" || c.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "todos" || c.tipo.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[3000] px-4 py-3 rounded-md border shadow-float text-xs font-semibold animate-fade-in ${
          toast.type === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-emerald-50 border-emerald-200 text-emerald-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Support Mode Overlay Banner */}
      {supportLoginMode && (
        <div className="bg-violet-600 text-white px-6 py-3.5 rounded-lg flex items-center justify-between shadow-lg shadow-violet-600/10 border border-violet-500/30 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs font-semibold">
              Modo Suporte Activo: A visualizar o painel como <span className="underline font-bold">{supportLoginMode.nome}</span> ({supportLoginMode.tipo})
            </p>
          </div>
          <Button variant="secondary" size="xs" onClick={handleExitSupport} className="bg-white/10 hover:bg-white/20 border-white/10 text-white">
            <LogOut size={12} className="mr-1.5" />
            Sair do Modo Suporte
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestão de Igrejas & Congregações</h2>
          <p className="text-slate-500 text-xs mt-0.5">Ative, suspenda ou aceda como suporte às instituições cadastradas.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOnboardingOpen(true)}>
          <Plus size={15} className="mr-1.5" />
          Onboarding Igreja
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="shadow-xs" padding="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar igreja por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tipo:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            >
              <option value="todos">Todos</option>
              <option value="sede">Sede</option>
              <option value="filial">Filial</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="bloqueado">Suspenso</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Master Table */}
      <Card className="shadow-xs overflow-hidden" padding="p-0">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2.5 text-slate-400">
            <div className="w-8 h-8 border-3 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
            <span className="text-xs">Carregando instituições...</span>
          </div>
        ) : filteredChurches.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            Nenhuma instituição encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5">Instituição</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Recursos</th>
                  <th className="py-3 px-4">Acesso instantâneo</th>
                  <th className="py-3 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredChurches.map((church) => {
                  const isActive = church.status === "ativo";
                  const isBlocked = church.status === "bloqueado";
                  const isPending = church.status === "pendente";

                  return (
                    <tr key={`${church.tipo}-${church.id}`} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name / Sede hierarchy */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            church.tipo === "Sede" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {church.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs">{church.nome}</div>
                            {church.tipo === "Filial" && (
                              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                                Subordinada a: <span className="font-medium text-slate-500">{church.sedeNome}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          church.tipo === "Sede" ? "bg-violet-100 text-violet-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {church.tipo}
                        </span>
                      </td>

                      {/* Contacts */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-800">{church.telefone}</div>
                          <div className="text-[10px] text-slate-400">{church.email}</div>
                        </div>
                      </td>

                      {/* Resource consumption */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                            <span className="font-bold text-slate-800">{church.membros}</span> membros
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Plano: Pro (Mock)
                          </div>
                        </div>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => toggleStatus(church)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isActive ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>

                          {/* Visual Indicator text */}
                          {isActive && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <CheckCircle size={10} />
                              Ativo
                            </span>
                          )}
                          {isBlocked && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              <XCircle size={10} />
                              Suspenso
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              <AlertCircle size={10} />
                              Pendente
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleSupportLogin(church)}
                            title="Entrar como suporte"
                            className="text-violet-600 border-violet-200 hover:bg-violet-50"
                          >
                            <UserCheck size={12} className="mr-1" />
                            Aceder
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            as={Link}
                            to={`/super-admin/igrejas/${church.id}?type=${church.tipo}`}
                            title="Ver detalhes de consumo"
                          >
                            <Eye size={12} className="mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Onboarding Modal Overlay */}
      {onboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setOnboardingOpen(false)} />
          <div className="relative bg-white rounded-lg border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-base font-bold text-slate-900">Novo Onboarding de Igreja</h3>
              <button
                onClick={() => setOnboardingOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                ✕
              </button>
            </div>
            
            <CadastrarIgrejaDono
              onSuccess={() => {
                setOnboardingOpen(false);
                fetchChurches();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
