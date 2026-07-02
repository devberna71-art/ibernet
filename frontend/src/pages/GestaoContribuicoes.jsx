import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  History,
  Pencil,
  Trash2,
  TrendingUp,
  Users as UsersIcon,
  Star,
  Wallet,
  Search,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axiosConfig";
import FormTipoContribuicao from "../components/FormTipoContribuicao";
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

export default function GestaoContribuicoes() {
  const [tipos, setTipos] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openTipoModal, setOpenTipoModal] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [deletingTipo, setDeletingTipo] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" }

  useEffect(() => {
    fetchTipos();
  }, []);

  const filteredTipos = useMemo(() => {
    if (!search) return tipos;
    return tipos.filter((t) =>
      (t.nome || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tipos]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/tipos-contribuicao");
      if (res.data && res.data.tipos) {
        setTipos(res.data.tipos || []);
        setDashboardData(res.data.dashboard);
      } else {
        setTipos(res.data || []);
      }
    } catch (err) {
      showToast("Erro ao carregar dados do painel.", "error");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovoTipo = () => {
    setTipoEditando(null);
    setOpenTipoModal(true);
  };

  const abrirModalEditarTipo = (tipo) => {
    setTipoEditando(tipo);
    setOpenTipoModal(true);
  };

  const deletarTipo = async (id) => {
    try {
      await api.delete(`/tipos-contribuicao/${id}`);
      fetchTipos();
      showToast("Tipo de contribuição excluído com sucesso.");
      setDeletingTipo(null);
    } catch (err) {
      showToast("Erro ao excluir tipo.", "error");
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor !== "number" || isNaN(valor)) return "0,00 Kz";
    return `${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} Kz`;
  };

  const maxReceitaGrafico = tipos.length > 0 ? Math.max(...tipos.map((t) => t.receitaTotal), 1) : 1;

  return (
    <AppPage subtitle="Controle financeiro avançado com métricas de alta fidelidade.">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${toast.type === "error"
            ? "bg-danger/5 border-danger/20 text-danger"
            : "bg-successSoft border-success/20 text-success"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header com busca e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-text">Gestão de Contribuições</h2>
          <p className="text-muted text-textMuted mt-0.5">
            Gerencie categorias de dízimos, ofertas e doações.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Busca */}
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.75}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors w-52"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={abrirModalNovoTipo}
          >
            <Plus size={15} className="w-4 h-4 shrink-0" />
            Novo Tipo
          </Button>
        </div>
      </div>

      {/* Métricas do Painel */}
      {dashboardData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Stat 1 */}
          <Card>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wide">Receita Total</span>
              <TrendingUp size={16} className="text-success" />
            </div>
            <p className="text-xl font-bold text-text">{formatarValor(dashboardData.receitaTotal)}</p>
            <p className="text-[11px] text-success font-medium mt-1">
              +{dashboardData.crescimentoMensal}% este mês
            </p>
          </Card>

          {/* Stat 2 */}
          <Card>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-textMuted uppercase tracking-wide">Categorias</span>
            </div>
            <p className="text-xl font-bold text-text">{dashboardData.totalTipos} Tipos</p>
            <p className="text-[11px] text-textMuted mt-1">Cadastrados no sistema</p>
          </Card>

          {/* Stat 3 */}
          <Card>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-textMuted uppercase tracking-wide">Status dos Tipos</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-lg font-bold text-success leading-none">{dashboardData.tiposAtivos}</p>
                <span className="text-[10px] text-textMuted">Ativos</span>
              </div>
              <div>
                <p className="text-lg font-bold text-danger leading-none">{dashboardData.tiposInativos}</p>
                <span className="text-[10px] text-textMuted">Inativos</span>
              </div>
            </div>
          </Card>

          {/* Stat 4 */}
          <Card>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-textMuted uppercase tracking-wide">Total Contribuidores</span>
              <UsersIcon size={16} className="text-primary" />
            </div>
            <p className="text-xl font-bold text-text">{dashboardData.numeroMembros}</p>
            <p className="text-[11px] text-textMuted mt-1">Membros ativos</p>
          </Card>

          {/* Destaque 1 */}
          <div className="sm:col-span-2">
            <Card className="flex items-center gap-3.5 bg-bgSection border border-border" padding="p-4">
              <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary shrink-0">
                <Star size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Maior Contribuição</span>
                <p className="text-[15px] font-bold text-primary mt-0.5">{formatarValor(dashboardData.maiorContribuicao)}</p>
              </div>
            </Card>
          </div>

          {/* Destaque 2 */}
          <div className="sm:col-span-2">
            <Card className="flex items-center gap-3.5 bg-bgSection border border-border" padding="p-4">
              <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Contribuição Média</span>
                <p className="text-[15px] font-bold text-primary mt-0.5">{formatarValor(dashboardData.contribuicaoMedia)}</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Gráfico de Distribuição */}
      {tipos.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide mb-4">Distribuição de Receita</h3>
          <div className="space-y-4">
            {tipos.map((tipo) => {
              const percentual = (tipo.receitaTotal / maxReceitaGrafico) * 100;
              return (
                <div key={tipo.id}>
                  <div className="flex justify-between items-center mb-1 text-[13px]">
                    <span className="font-semibold text-textSecondary">{tipo.nome}</span>
                    <span className="font-bold text-primary">{formatarValor(tipo.receitaTotal)}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${percentual}%` }}
                      className="bg-primary h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Categorias Detalhadas */}
      <h3 className="text-[14px] font-semibold text-text mb-4">Categorias Detalhadas</h3>
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando categorias...</span>
        </div>
      ) : filteredTipos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma categoria encontrada.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTipos.map((tipo) => (
            <Card key={tipo.id} padding="p-4" className="hover:border-primary/30 transition-colors duration-200">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-text">{tipo.nome}</h4>
                  <Badge variant={tipo.ativo ? "success" : "muted"}>
                    {tipo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => abrirModalEditarTipo(tipo)}
                    className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingTipo(tipo)}
                    className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border text-left">
                <div>
                  <span className="block text-[10px] text-textMuted font-semibold uppercase">Receita Total</span>
                  <p className="text-xs font-bold text-text mt-0.5">{formatarValor(tipo.receitaTotal)}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-textMuted font-semibold uppercase">Receita Média</span>
                  <p className="text-xs font-bold text-text mt-0.5">{formatarValor(tipo.receitaMedia)}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-textMuted font-semibold uppercase">Maior Contribuição</span>
                  <p className="text-xs font-bold text-text mt-0.5">{formatarValor(tipo.maiorContribuicao)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Cadastro/Edição */}
      <Modal
        open={openTipoModal}
        onClose={() => setOpenTipoModal(false)}
        title={tipoEditando ? "Editar Tipo de Contribuição" : "Cadastrar Tipo de Contribuição"}
      >
        <FormTipoContribuicao
          tipo={tipoEditando}
          onSuccess={() => {
            setOpenTipoModal(false);
            fetchTipos();
            showToast(`Tipo ${tipoEditando ? "editado" : "criado"} com sucesso!`);
          }}
          onCancel={() => setOpenTipoModal(false)}
        />
      </Modal>

      {/* Confirmar Exclusão */}
      <Modal
        open={!!deletingTipo}
        onClose={() => setDeletingTipo(null)}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Tem certeza que deseja excluir a categoria{" "}
          <span className="font-semibold text-text">"{deletingTipo?.nome}"</span>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeletingTipo(null)}>Cancelar</Button>
          <Button variant="danger" size="sm" onClick={() => deletarTipo(deletingTipo.id)}>Excluir</Button>
        </div>
      </Modal>
    </AppPage>
  );
}