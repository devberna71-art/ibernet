import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  Search,
  Activity,
  FileText,
  UserX,
  UserCheck,
  Calendar,
  Lock,
  Globe,
  Terminal,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function LogsSistema() {
  const [activeTab, setActiveTab] = useState("usuarios"); // 'usuarios' | 'audit'
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [toast, setToast] = useState(null);

  // Audit Logs Filter
  const [auditSearch, setAuditSearch] = useState("");
  const [auditCategory, setAuditCategory] = useState("todos");

  // Mocked Security Logs (Audit Trail)
  const [auditLogs, setAuditLogs] = useState([
    { id: "LOG-3921", user: "Super Admin", action: "Modo Suporte", details: "Entrou como administrador na Sede Central", category: "Acesso", ip: "197.94.120.3", date: "07/07/2026 11:02" },
    { id: "LOG-3920", user: "Pastor Manuel", action: "Login Realizado", details: "Autenticação bem-sucedida", category: "Autenticação", ip: "197.94.15.42", date: "07/07/2026 10:45" },
    { id: "LOG-3919", user: "Super Admin", action: "Criar Igreja", details: "Sede 'Assembleia de Deus' criada", category: "Configuração", ip: "197.94.120.3", date: "07/07/2026 10:12" },
    { id: "LOG-3918", user: "System Scheduler", action: "Backup Automático", details: "Backup do banco de dados concluído com sucesso", category: "Sistema", ip: "127.0.0.1", date: "07/07/2026 04:00" },
    { id: "LOG-3917", user: "Ana Paula (Admin)", action: "Criar Membro", details: "Membro 'João Costa' cadastrado", category: "Dados", ip: "102.244.18.5", date: "06/07/2026 18:30" },
    { id: "LOG-3916", user: "Carlos Neto (Moderador)", action: "Criar Culto", details: "Culto de Domingo cadastrado", category: "Dados", ip: "102.244.12.98", date: "06/07/2026 16:15" },
    { id: "LOG-3915", user: "Super Admin", action: "Suspensão", details: "Filial 'Belém' suspensa por falta de pagamento", category: "Configuração", ip: "197.94.120.3", date: "05/07/2026 14:05" },
  ]);

  useEffect(() => {
    if (activeTab === "usuarios") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios");
      const usersData = res.data?.usuarios || [];
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      showToast("Erro ao buscar utilizadores.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserAccess = (user) => {
    // Simulated access block
    showToast(`Estado de acesso para ${user.nome} atualizado.`);
  };

  // User Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || u.funcao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "todos" || u.funcao === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Audit Log Filter Logic
  const filteredAudits = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesCategory =
      auditCategory === "todos" || log.category.toLowerCase() === auditCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[3000] px-4 py-3 rounded-md border shadow-float text-xs font-semibold animate-fade-in ${
          toast.type === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-emerald-50 border-emerald-200 text-emerald-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">Gestão de Acessos & Auditoria (IAM)</h2>
        <p className="text-slate-500 text-xs mt-0.5">Gerencie os utilizadores globais e verifique a integridade dos logs de segurança.</p>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => {
            setActiveTab("usuarios");
            setLoading(true);
          }}
          className={`pb-3 text-xs font-semibold border-b-2 px-1 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === "usuarios"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users size={14} />
          Utilizadores Globais
        </button>
        <button
          onClick={() => {
            setActiveTab("audit");
            setLoading(true);
          }}
          className={`pb-3 text-xs font-semibold border-b-2 px-1 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === "audit"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity size={14} />
          Logs de Auditoria
        </button>
      </div>

      {/* Tab Contents: Global Users */}
      {activeTab === "usuarios" && (
        <>
          {/* User Filters */}
          <Card className="shadow-xs" padding="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Pesquisar utilizador por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Função:</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value="todos">Todos</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Administrador</option>
                  <option value="moderador">Moderador</option>
                  <option value="usuario">Membro</option>
                </select>
              </div>
            </div>
          </Card>

          {/* User List Table */}
          <Card className="shadow-xs overflow-hidden" padding="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-6 h-6 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
                <span className="text-xs">Carregando utilizadores...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                Nenhum utilizador encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-5">Utilizador</th>
                      <th className="py-3 px-4">Função / Cargo</th>
                      <th className="py-3 px-4">Registo</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredUsers.map((u) => {
                      const isSuper = u.funcao === "super_admin" || u.funcao === "superadmin";
                      const isAdmin = u.funcao === "admin";
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSuper ? "bg-violet-100 text-violet-700" : isAdmin ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {u.nome.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-semibold text-slate-900">{u.nome}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                              isSuper
                                ? "bg-violet-100 text-violet-700"
                                : isAdmin
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {u.funcao}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-slate-400" />
                              {new Date(u.createdAt).toLocaleDateString("pt-PT")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                              Activo
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right font-medium">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => toggleUserAccess(u)}
                              disabled={isSuper}
                              className="text-red-500 hover:bg-red-50 disabled:opacity-30"
                            >
                              <UserX size={12} className="mr-1" />
                              Bloquear
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Tab Contents: Audit Logs */}
      {activeTab === "audit" && (
        <>
          {/* Audit Filters */}
          <Card className="shadow-xs" padding="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Pesquisar por autor, ação ou detalhes do log..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Categoria:</label>
                <select
                  value={auditCategory}
                  onChange={(e) => setAuditCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value="todos">Todas</option>
                  <option value="acesso">Acesso</option>
                  <option value="autenticação">Autenticação</option>
                  <option value="configuração">Configuração</option>
                  <option value="sistema">Sistema</option>
                  <option value="dados">Dados</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Audit List Table */}
          <Card className="shadow-xs overflow-hidden font-mono" padding="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold font-sans">
                    <th className="py-3 px-5">ID Log</th>
                    <th className="py-3 px-4">Autor</th>
                    <th className="py-3 px-4">Ação</th>
                    <th className="py-3 px-4">Detalhes</th>
                    <th className="py-3 px-4 flex items-center gap-1"><Globe size={11} /> IP de Acesso</th>
                    <th className="py-3 px-5 text-right font-sans">Data/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAudits.map((log) => {
                    const isSystem = log.user === "System Scheduler" || log.user === "Sistema";
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-5 text-slate-400 font-semibold">{log.id}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${isSystem ? "text-slate-400" : "text-slate-800"}`}>
                            {log.user}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.category === "Autenticação"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : log.category === "Acesso"
                              ? "bg-violet-50 text-violet-700 border border-violet-100"
                              : log.category === "Configuração"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-slate-50 text-slate-700 border border-slate-100"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-sans max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                        <td className="py-3 px-5 text-right text-slate-400 font-sans">{log.date}</td>
                      </tr>
                    );
                  })}
                  {filteredAudits.length === 0 && (
                    <tr className="font-sans">
                      <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                        Nenhum registo de auditoria encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
