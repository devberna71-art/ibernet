import React, { useEffect, useState, useMemo } from "react";
import { Building, Plus, Pencil, Trash2, Search, Loader2, Users as UsersIcon, MapPin, Building2, BarChart3, TrendingUp, TrendingDown, Layers, X } from "lucide-react";
import api from "../api/axiosConfig";
import FormDepartamento from "../components/FormDepartamento";
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

export default function GestaoDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDepartamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/departamentos-membros");
      setDepartamentos(res.data || []);
      setFilteredDepartamentos(res.data || []);
    } catch (error) {
      showToast("Erro ao carregar departamentos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (!search) setFilteredDepartamentos(departamentos);
    else
      setFilteredDepartamentos(
        departamentos.filter((d) =>
          d.nome.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, departamentos]);

  // Cálculos automáticos para o Dashboard
  const estatisticas = useMemo(() => {
    const totalDeps = departamentos.length;
    const totalMembros = departamentos.reduce(
      (acc, curr) => acc + (Number(curr.totalMembros) || 0), 
      0
    );
    const mediaMembros = totalDeps > 0 ? (totalMembros / totalDeps).toFixed(1) : 0;

    let maiorDep = "Nenhum";
    let maxMembros = -1;
    let menorDep = "Nenhum";
    let minMembros = Infinity;

    departamentos.forEach((dep) => {
      const membros = Number(dep.totalMembros) || 0;
      if (membros > maxMembros) {
        maxMembros = membros;
        maiorDep = dep.nome;
      }
      if (membros < minMembros) {
        minMembros = membros;
        menorDep = dep.nome;
      }
    });

    if (totalDeps === 0) menorDep = "Nenhum";

    const locaisUnicos = new Set(
      departamentos
        .map((dep) => dep.local?.trim())
        .filter((local) => local && local.toLowerCase() !== "não informado")
    );
    const totalLocais = locaisUnicos.size;

    return { totalDeps, totalMembros, mediaMembros, maiorDep, menorDep, totalLocais };
  }, [departamentos]);

  const abrirModalNovo = () => {
    setDepartamentoEditando(null);
    setOpenModal(true);
  };

  const abrirModalEditar = (dep) => {
    setDepartamentoEditando(dep);
    setOpenModal(true);
  };

  const deletarDepartamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este departamento?")) return;
    try {
      await api.delete(`/departamentos/${id}`);
      fetchDepartamentos();
      showToast("Departamento excluído com sucesso.");
    } catch (error) {
      showToast("Erro ao excluir departamento.", "error");
    }
  };

  return (
    <AppPage subtitle="Acompanhe estatísticas, gerencie departamentos estruturais e aloque recursos de forma inteligente.">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error"
            ? "bg-danger/5 border-danger/20 text-danger"
            : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Gestão de Departamentos</h2>
            <p className="text-muted text-textMuted mt-0.5">Organização de ministérios e divisões da comunidade.</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={abrirModalNovo}
        >
          <Plus size={15} className="w-4 h-4 shrink-0" />
          Novo Departamento
        </Button>
      </div>

      {/* Grid de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Total Departamentos</span>
            <p className="text-xl font-bold text-text mt-1">{estatisticas.totalDeps}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-primarySoft text-primary flex items-center justify-center">
            <Building size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Total de Membros</span>
            <p className="text-xl font-bold text-text mt-1">{estatisticas.totalMembros}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-successSoft text-success flex items-center justify-center">
            <UsersIcon size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Maior Depto.</span>
            <p className="text-sm font-bold text-text mt-2 truncate w-32" title={estatisticas.maiorDep}>
              {estatisticas.maiorDep}
            </p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-danger/5 text-danger flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Locais Diferentes</span>
            <p className="text-xl font-bold text-text mt-1">{estatisticas.totalLocais}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-warning/10 text-warning flex items-center justify-center">
            <MapPin size={18} />
          </div>
        </Card>
      </div>

      {/* Mini Dashboard Extra */}
      <Card padding="p-5" className="mb-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
          <BarChart3 size={16} className="text-primary" />
          <h3 className="text-xs font-bold text-text uppercase tracking-wide">Dashboard Geral</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-[10px] text-textMuted font-semibold uppercase">Departamentos Ativos</span>
            <p className="text-sm font-bold text-text mt-0.5">{estatisticas.totalDeps} ativos</p>
          </div>
          <div>
            <span className="block text-[10px] text-textMuted font-semibold uppercase">Média de Membros</span>
            <p className="text-sm font-bold text-text mt-0.5">{estatisticas.mediaMembros} / dep</p>
          </div>
          <div>
            <span className="block text-[10px] text-textMuted font-semibold uppercase">Maior Departamento</span>
            <p className="text-sm font-bold text-text mt-0.5 truncate" title={estatisticas.maiorDep}>{estatisticas.maiorDep}</p>
          </div>
          <div>
            <span className="block text-[10px] text-textMuted font-semibold uppercase">Menor Departamento</span>
            <p className="text-sm font-bold text-text mt-0.5 truncate" title={estatisticas.menorDep}>{estatisticas.menorDep}</p>
          </div>
        </div>
      </Card>

      {/* Busca */}
      <Card padding="p-4" className="mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por departamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </Card>

      {/* Lista de Departamentos */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando departamentos...</span>
        </div>
      ) : filteredDepartamentos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhum departamento cadastrado no momento.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredDepartamentos.map((dep) => {
            const maxMembros = 100;
            const membrosPercent = Math.min(
              100,
              Math.round(((dep.totalMembros || 0) / maxMembros) * 100)
            );

            return (
              <Card
                key={dep.id}
                padding="p-5"
                className="hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-sm bg-primarySoft text-primary flex items-center justify-center shrink-0">
                      <Building size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text">{dep.nome}</h4>
                      <p className="text-xs text-textMuted mt-0.5">
                        {dep.totalMembros || 0} membro(s) alocado(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => abrirModalEditar(dep)}
                      className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deletarDepartamento(dep.id)}
                      className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-textMuted mb-4 line-clamp-2 min-h-[32px] leading-relaxed">
                  {dep.descricao || "Nenhuma descrição fornecida para este departamento."}
                </p>

                {/* Local e Cap */}
                <div className="space-y-1.5 text-xs text-textSecondary mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-textMuted" />
                    <span>{dep.local || "Não informado"}</span>
                  </div>
                </div>

                {/* Progresso de preenchimento */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-textMuted font-semibold">
                    <span>Ocupação de Membros</span>
                    <span>{membrosPercent}%</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${membrosPercent}%` }}
                      className="bg-primary h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Formulário */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={departamentoEditando ? "Editar Departamento" : "Novo Departamento"}
      >
        <FormDepartamento
          departamento={departamentoEditando}
          onSuccess={() => {
            setOpenModal(false);
            fetchDepartamentos();
          }}
          onCancel={() => setOpenModal(false)}
        />
      </Modal>
    </AppPage>
  );
}