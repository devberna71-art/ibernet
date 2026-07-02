import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Filter,
  UserPlus,
  Pencil,
  Trash2,
  Users as UsersIcon,
  TrendingUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import api from "../api/axiosConfig";
import CadastrarIgrejaDono from "../components/CadastrarIgrejaDono";
import AppPage from "../components/ui/AppPage";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

/** Modal genérico leve */
function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`relative bg-surface rounded-lg border border-border w-full ${maxWidth} max-h-[90vh] overflow-auto shadow-float`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function Configuracoes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalUsuarios: 0,
    usuariosNovosSemana: 0,
    usuariosNovosMes: 0,
    usuariosPorFuncao: {}
  });

  // Estados de Filtros e Paginação
  const [busca, setBusca] = useState("");
  const [filtroFuncao, setFiltroFuncao] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalFiltrados, setTotalFiltrados] = useState(0);

  // Estados dos Modais
  const [openModal, setOpenModal] = useState(false);
  const [openCadastroModal, setOpenCadastroModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ role: "usuario" });

  const currentSedeId = 1; 

  const API_URL = "/gestao-usuarios";
  const API_USUARIOS_URL = "/usuarios";

  // Buscar usuários com paginação e filtros
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(API_URL, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          busca: busca,
          funcao: filtroFuncao
        }
      });

      const listaUsuarios = response.data.usuarios || [];
      setTotalFiltrados(response.data.totalFiltrados || 0);

      setMetrics({
        totalUsuarios: response.data.totalUsuarios || 0,
        usuariosNovosSemana: response.data.usuariosNovosSemana || 0,
        usuariosNovosMes: response.data.usuariosNovosMes || 0,
        usuariosPorFuncao: response.data.usuariosPorFuncao || {}
      });

      const mappedUsers = listaUsuarios.map(u => ({
        id: u.id,
        name: u.nome,
        role: u.funcao, 
        SedeId: u.SedeId,
        FilhalId: u.FilhalId,
        foto: u.Membro?.foto || null,
        cargos: u.Membro?.cargos || []
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Erro de conexão com a API:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, busca, filtroFuncao]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setPage(0);
  };

  const handleFiltroFuncaoChange = (e) => {
    setFiltroFuncao(e.target.value);
    setPage(0);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setFormData({ role: user.role === "super_admin" ? "admin" : user.role });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await api.put(`${API_USUARIOS_URL}/${selectedUser.id}`, {
          funcao: formData.role 
        });
        fetchUsuarios(); 
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao atualizar função.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await api.delete(`${API_USUARIOS_URL}/${id}`);
        fetchUsuarios();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert(error.response?.data?.message || "Erro ao deletar usuário.");
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "super_admin":
        return <Badge variant="danger">Super Admin</Badge>;
      case "admin":
        return <Badge variant="primary">Admin</Badge>;
      case "moderador":
        return <Badge variant="secondary">Moderador</Badge>;
      default:
        return <Badge variant="muted">Usuário</Badge>;
    }
  };

  const roleColors = {
    super_admin: "bg-danger",
    admin: "bg-primary",
    moderador: "bg-purple-500",
    usuario: "bg-success",
  };

  return (
    <AppPage subtitle="Gerencie permissões de acesso, audite perfis e monitore o crescimento geral dos usuários.">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Controle & Auditoria</h2>
            <p className="text-muted text-textMuted mt-0.5">Gerencie os níveis de acesso dos usuários.</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setOpenCadastroModal(true)}
        >
          <UserPlus size={15} className="w-4 h-4 shrink-0" />
          Novo Usuário
        </Button>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Total de Usuários</span>
            <p className="text-xl font-bold text-text mt-1">{metrics.totalUsuarios}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-primarySoft text-primary flex items-center justify-center">
            <UsersIcon size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Novos (7 dias)</span>
            <p className="text-xl font-bold text-success mt-1">+{metrics.usuariosNovosSemana}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-successSoft text-success flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Novos (30 dias)</span>
            <p className="text-xl font-bold text-warning mt-1">+{metrics.usuariosNovosMes}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-warning/10 text-warning flex items-center justify-center">
            <CalendarDays size={18} />
          </div>
        </Card>

        {/* Distribuição de Funções com barras visuais (Substitui o PieChart do MUI) */}
        <Card className="flex flex-col justify-center">
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide mb-2.5">Distribuição de Funções</span>
          <div className="space-y-1.5">
            {Object.entries(metrics.usuariosPorFuncao).map(([funcao, qtd]) => {
              const percentage = metrics.totalUsuarios ? (qtd / metrics.totalUsuarios) * 100 : 0;
              const colorClass = roleColors[funcao] || "bg-textMuted";
              return (
                <div key={funcao} className="flex items-center gap-2 text-xs">
                  <span className="w-16 truncate font-medium text-textSecondary capitalize">{funcao.replace("_", " ")}</span>
                  <div className="flex-1 bg-border h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${colorClass}`} />
                  </div>
                  <span className="w-5 text-right font-bold text-text">{qtd}</span>
                </div>
              );
            })}
            {Object.keys(metrics.usuariosPorFuncao).length === 0 && (
              <span className="text-xs text-textMuted italic">Sem dados</span>
            )}
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6" padding="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome de usuário..."
              value={busca}
              onChange={handleBuscaChange}
              className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <select
              value={filtroFuncao}
              onChange={handleFiltroFuncaoChange}
              className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Todos os Níveis</option>
              <option value="admin">Administrador</option>
              <option value="moderador">Moderador</option>
              <option value="usuario">Usuário Comum</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabela de Usuários */}
      <Card padding="p-0" className="overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-bgSection text-[10px] font-bold text-textMuted uppercase tracking-wide">
                <th className="px-5 py-3">Usuário / Membro</th>
                <th className="px-5 py-3">Nível de Acesso</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-textMuted">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-primary" />
                      <span>Buscando usuários...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-textMuted">
                    Nenhum usuário atende aos critérios de filtro aplicados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-bgSection/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EEF0FE&color=4F5EF7`}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="font-semibold text-text">{user.name}</p>
                          {user.cargos && user.cargos.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.cargos.map((cargo) => (
                                <span
                                  key={cargo.id}
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-bgSection border border-border text-textSecondary"
                                >
                                  {cargo.nome}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                          title="Alterar nível"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-textMuted bg-bgSection/20">
          <div className="flex items-center gap-2">
            <span>Linhas por página:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="bg-bg border border-border rounded-sm py-0.5 px-1.5 focus:outline-none"
            >
              {[5, 10, 25].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, totalFiltrados)} de {totalFiltrados}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-1 rounded-sm border border-border bg-bg hover:bg-bgSection disabled:opacity-40 disabled:hover:bg-bg transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={(page + 1) * rowsPerPage >= totalFiltrados}
                onClick={() => setPage(page + 1)}
                className="p-1 rounded-sm border border-border bg-bg hover:bg-bgSection disabled:opacity-40 disabled:hover:bg-bg transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal: Alterar Nível de Acesso */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title="Alterar Nível de Acesso"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Selecione o nível de permissão
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="admin">Administrador</option>
              <option value="moderador">Moderador</option>
              <option value="usuario">Usuário Comum</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Confirmar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Novo Usuário */}
      <Modal
        open={openCadastroModal}
        onClose={() => setOpenCadastroModal(false)}
        title="Cadastrar Novo Usuário"
        maxWidth="max-w-xl"
      >
        <div className="py-2">
          <CadastrarIgrejaDono 
            sedeId={currentSedeId} 
            filhalExistenteId={null} 
            onSuccess={() => {
              setOpenCadastroModal(false);
              fetchUsuarios();
            }}
          />
        </div>
      </Modal>
    </AppPage>
  );
}