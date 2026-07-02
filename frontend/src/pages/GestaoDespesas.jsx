import React, { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash2, Filter, Loader2, X } from "lucide-react";
import api from "../api/axiosConfig";
import FormCategorias from "../components/FormCategorias";
import FormDespesa from "../components/FormDespesas";
import ListaDespesasCategorias from "../components/ListaDespesasCategorias";
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

export default function GestaoDespesas() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [openModalDespesa, setOpenModalDespesa] = useState(false);
  const [categoriaParaDespesa, setCategoriaParaDespesa] = useState(null);

  const [openModalLista, setOpenModalLista] = useState(false);
  const [categoriaParaLista, setCategoriaParaLista] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    categoriaId: null,
  });

  const formatKz = (valor) => {
    const numero = Number(valor || 0);
    return `${numero.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Kz`;
  };

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categorias/despesas");
      setCategorias(res.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const totalGeral = useMemo(() => {
    return categorias.reduce(
      (acc, cat) => acc + Number(cat.totalDespesas || 0),
      0
    );
  }, [categorias]);

  const categoriasFiltradas = useMemo(() => {
    if (!categoriaFiltro) return categorias;
    return categorias.filter(
      (cat) => String(cat.id) === String(categoriaFiltro)
    );
  }, [categorias, categoriaFiltro]);

  const handleDelete = async () => {
    try {
      await api.delete(`/categorias/${deleteConfirm.categoriaId}`);
      setDeleteConfirm({ open: false, categoriaId: null });
      fetchCategorias();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  return (
    <AppPage subtitle="Painel de controlo de despesas!">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-text">Gestão de Despesas</h2>
          <p className="text-muted text-textMuted mt-0.5">
            Gerencie e organize as categorias de saídas financeiras.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setSelectedCategoria(null);
            setOpenModalCategoria(true);
          }}
        >
          <Plus size={15} className="w-4 h-4 shrink-0" />
          Nova Categoria
        </Button>
      </div>

      {/* KPI Cards & Filtro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Total Geral</span>
          <p className="text-xl font-bold text-text mt-1">{formatKz(totalGeral)}</p>
        </Card>

        <Card>
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Categorias</span>
          <p className="text-xl font-bold text-text mt-1">{categorias.length}</p>
        </Card>

        <Card padding="p-3" className="flex flex-col justify-center">
          <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1">
            <Filter size={12} className="text-textMuted" />
            Filtrar Categoria
          </label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </Card>
      </div>

      {/* Lista de Categorias */}
      <h3 className="text-[14px] font-semibold text-text mb-4">Listagem das Categorias</h3>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando categorias...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {categoriasFiltradas.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-body text-textMuted">Nenhuma categoria encontrada.</p>
            </Card>
          ) : (
            categoriasFiltradas.map((categoria) => {
              const totalCategoria = Number(categoria.totalDespesas || 0);
              const percent = totalGeral ? (totalCategoria / totalGeral) * 100 : 0;

              return (
                <Card
                  key={categoria.id}
                  padding="p-4"
                  className="hover:border-primary/20 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-text">{categoria.nome}</h4>
                        <Badge variant="primary">{formatKz(totalCategoria)}</Badge>
                      </div>
                      <p className="text-xs text-textMuted mt-1">
                        {categoria.descricao || "Sem descrição"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setCategoriaParaDespesa(categoria);
                          setOpenModalDespesa(true);
                        }}
                      >
                        <Plus size={13} className="shrink-0" />
                        Despesa
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCategoriaParaLista(categoria);
                          setOpenModalLista(true);
                        }}
                      >
                        <Eye size={13} className="shrink-0" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCategoria(categoria);
                          setOpenModalCategoria(true);
                        }}
                      >
                        <Pencil size={13} className="shrink-0" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger hover:bg-danger/5 hover:text-danger"
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            categoriaId: categoria.id,
                          })
                        }
                      >
                        <Trash2 size={13} className="shrink-0" />
                        Excluir
                      </Button>
                    </div>
                  </div>

                  {/* Progresso de Distribuição */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-[10px] text-textMuted font-semibold mb-1">
                      <span>Proporção de Gastos</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-primary h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* MODAIS */}
      {/* Modal Categoria (Nova / Editar) */}
      <Modal
        open={openModalCategoria}
        onClose={() => setOpenModalCategoria(false)}
        title={selectedCategoria ? "Editar Categoria" : "Nova Categoria"}
      >
        <FormCategorias
          categoria={selectedCategoria}
          onSuccess={() => {
            setOpenModalCategoria(false);
            fetchCategorias();
          }}
          onCancel={() => setOpenModalCategoria(false)}
        />
      </Modal>

      {/* Modal Nova Despesa */}
      <Modal
        open={openModalDespesa}
        onClose={() => setOpenModalDespesa(false)}
        title="Nova Despesa"
      >
        <FormDespesa
          categoriaId={categoriaParaDespesa?.id}
          onSuccess={() => {
            setOpenModalDespesa(false);
            fetchCategorias();
          }}
          onCancel={() => setOpenModalDespesa(false)}
        />
      </Modal>

      {/* Modal Lista de Despesas */}
      <Modal
        open={openModalLista}
        onClose={() => setOpenModalLista(false)}
        title="Lista de Despesas"
        maxWidth="max-w-2xl"
      >
        <ListaDespesasCategorias
          categoria={categoriaParaLista}
          onClose={() => setOpenModalLista(false)}
        />
      </Modal>

      {/* Dialog Excluir Categoria */}
      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, categoriaId: null })}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Deseja realmente excluir esta categoria? Esta ação não poderá ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm({ open: false, categoriaId: null })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </AppPage>
  );
}