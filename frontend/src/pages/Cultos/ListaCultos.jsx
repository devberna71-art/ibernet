import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axiosConfig";
import FormCultos from "../../components/FormCultos";
import FormTipoCulto from "../../components/FormTipoCulto";
import AppPage from "../../components/ui/AppPage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

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

/** Accordion customizado */
function Accordion({ title, children, defaultOpen = false, stats = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-bgSection/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-text">{title}</h3>
            {stats && (
              <Badge variant="success">{stats}</Badge>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-textMuted" /> : <ChevronDown size={18} className="text-textMuted" />}
      </button>
      {isOpen && <div className="px-5 py-4 border-t border-border bg-bgSection/10">{children}</div>}
    </div>
  );
}

export default function ListaCultos() {
  const [cultos, setCultos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCultos, setFilteredCultos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaCultos, setPaginaCultos] = useState({});
  const cultosPorPagina = 4;

  const [openFormModal, setOpenFormModal] = useState(false);
  const [openFormTipoModal, setOpenFormTipoModal] = useState(false);
  const [cultoEditando, setCultoEditando] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cultoParaDeletar, setCultoParaDeletar] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchCultos();
  }, []);

  const fetchCultos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cultos");
      setCultos(res.data || []);
      setFilteredCultos(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar cultos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) setFilteredCultos(cultos);
    else {
      const q = search.toLowerCase();
      setFilteredCultos(cultos.filter((c) => (c.tipoCulto || "").toLowerCase().includes(q)));
    }
  }, [search, cultos]);

  const abrirModalNovoCulto = () => {
    setCultoEditando(null);
    setOpenFormModal(true);
  };

  const abrirModalEditarCulto = async (culto) => {
    try {
      const res = await api.get(`/detalhes-cultos/${culto.id}`);
      setCultoEditando(res.data);
      setOpenFormModal(true);
    } catch (err) {
      console.error("Erro ao buscar detalhes do culto:", err);
      showToast("Erro ao carregar detalhes do culto.", "error");
    }
  };

  const abrirModalNovoTipoCulto = () => setOpenFormTipoModal(true);

  const deletarCulto = async (id) => {
    try {
      await api.delete(`/detalhes-cultos/${id}`);
      await fetchCultos();
      showToast("Culto excluído com sucesso.");
      setDeleteModalOpen(false);
      setCultoParaDeletar(null);
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir culto.", "error");
    }
  };

  const mudarPaginaCultos = (idGrupo, novaPagina, totalCultos) => {
    const maxPaginas = Math.ceil(totalCultos / cultosPorPagina);
    if (novaPagina < 1 || novaPagina > maxPaginas) return;
    setPaginaCultos((prev) => ({ ...prev, [idGrupo]: novaPagina }));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const formatKz = (valor) => {
    return `${Number(valor || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
  };

  return (
    <AppPage subtitle="Painel premium — controle tipos, horários, presenças e histórico de cultos.">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
            toast.type === "error"
              ? "bg-danger/5 border-danger/20 text-danger"
              : "bg-successSoft border-success/20 text-success"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-text">Gestão de Cultos</h2>
          <p className="text-muted text-textMuted mt-0.5">
            Controle tipos, horários, presenças e histórico de cultos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={abrirModalNovoTipoCulto}
          >
            <Plus size={15} className="w-4 h-4 shrink-0" />
            Novo Tipo
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={abrirModalNovoCulto}
          >
            <Plus size={15} className="w-4 h-4 shrink-0" />
            Novo Culto
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card padding="p-4" className="mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por tipo de culto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando cultos...</span>
        </div>
      ) : filteredCultos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhum culto encontrado.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCultos.map((grupo, index) => {
            const isExpanded = expandedGroups[grupo.id] !== false;
            const pagina = paginaCultos[grupo.id] || 1;
            const inicio = (pagina - 1) * cultosPorPagina;
            const fim = inicio + cultosPorPagina;
            const cultosPagina = grupo.cultos.slice(inicio, fim);

            return (
              <Accordion
                key={grupo.id || index}
                title={grupo.tipoCulto || "Culto sem tipo"}
                stats={`Total: ${formatKz(grupo.totalContribuicoes)}`}
                defaultOpen={isExpanded}
              >
                {/* Estatísticas */}
                <div className="mb-4">
                  <p className="text-xs text-textMuted mb-2">
                    Presença Máxima: <span className="font-bold text-success">{grupo.presencaMax || "N/D"}</span> | 
                    Presença Mínima: <span className="font-bold text-danger">{grupo.presencaMin || "N/D"}</span>
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] text-textMuted mb-1">
                        <span>Homens</span>
                        <span>{grupo.percentuaisPresencas?.homens || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${grupo.percentuaisPresencas?.homens || 0}%` }}
                          className="bg-primary h-full rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-textMuted mb-1">
                        <span>Mulheres</span>
                        <span>{grupo.percentuaisPresencas?.mulheres || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${grupo.percentuaisPresencas?.mulheres || 0}%` }}
                          className="bg-secondary h-full rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-textMuted mb-1">
                        <span>Crianças</span>
                        <span>{grupo.percentuaisPresencas?.criancas || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${grupo.percentuaisPresencas?.criancas || 0}%` }}
                          className="bg-success h-full rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wide mb-3">Cultos Realizados</h4>
                  
                  <div className="space-y-3">
                    {cultosPagina.map((c, i) => (
                      <Card
                        key={c.id || i}
                        padding="p-3"
                        className="hover:border-primary/20 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primarySoft flex items-center justify-center text-primary">
                                <Calendar size={14} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-text">
                                  {new Date(c.dataHora).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-xs text-textMuted">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span>{c.local || "Não informado"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                <span>{c.responsavel || "N/D"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => abrirModalEditarCulto(c)}
                              className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                              title="Editar"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setCultoParaDeletar(c.id);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Paginação */}
                  {grupo.cultos.length > cultosPorPagina && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => mudarPaginaCultos(grupo.id, pagina - 1, grupo.cultos.length)}
                        disabled={pagina === 1}
                      >
                        <ChevronLeft size={14} />
                        Anterior
                      </Button>
                      <span className="text-xs text-textMuted">
                        Página {pagina} de {Math.ceil(grupo.cultos.length / cultosPorPagina)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => mudarPaginaCultos(grupo.id, pagina + 1, grupo.cultos.length)}
                        disabled={pagina === Math.ceil(grupo.cultos.length / cultosPorPagina)}
                      >
                        Próximo
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </Accordion>
            );
          })}
        </div>
      )}

      {/* Modal Form Culto */}
      <Modal
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        title={cultoEditando ? "Editar Culto" : "Cadastrar Culto"}
        maxWidth="max-w-lg"
      >
        <FormCultos
          culto={cultoEditando}
          onSuccess={() => {
            setOpenFormModal(false);
            fetchCultos();
            showToast(`Culto ${cultoEditando ? "editado" : "criado"} com sucesso!`);
          }}
          onCancel={() => setOpenFormModal(false)}
        />
      </Modal>

      {/* Modal Form Tipo Culto */}
      <Modal
        open={openFormTipoModal}
        onClose={() => setOpenFormTipoModal(false)}
        title="Cadastrar Novo Tipo de Culto"
        maxWidth="max-w-md"
      >
        <FormTipoCulto
          onSuccess={() => {
            setOpenFormTipoModal(false);
            fetchCultos();
            showToast("Tipo de culto cadastrado com sucesso!");
          }}
          onCancel={() => setOpenFormTipoModal(false)}
        />
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCultoParaDeletar(null);
        }}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Tem certeza que deseja excluir este culto? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDeleteModalOpen(false);
              setCultoParaDeletar(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deletarCulto(cultoParaDeletar)}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </AppPage>
  );
}
