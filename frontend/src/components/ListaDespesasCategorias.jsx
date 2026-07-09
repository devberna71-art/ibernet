import React, { useEffect, useState } from "react";
import { Edit, Trash2, CalendarDays, Receipt, X, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { getDespesasPorCategoria, excluirDespesa } from "../services/despesasService";
import FormDespesa from "./FormDespesas";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

/** Modal genérico leve */
function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4"
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

export default function ListaDespesasCategoria({ categoria, onClose, onRefresh }) {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    despesaId: null,
  });

  const fetchDespesas = async () => {
    if (!categoria?.id) return;
    setLoading(true);
    try {
      const data = await getDespesasPorCategoria(categoria.id);
      setDespesas(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, [categoria]);

  const handleDelete = async () => {
    try {
      await excluirDespesa(deleteConfirm.despesaId);
      setDeleteConfirm({ open: false, despesaId: null });
      fetchDespesas();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Categoria info */}
      <div className="p-4 bg-bgSection border border-border rounded-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Categoria Selecionada</span>
          <h3 className="text-sm font-semibold text-text">{categoria?.nome}</h3>
        </div>
        <Badge variant="primary">{despesas.length} Despesas</Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando despesas...</span>
        </div>
      ) : despesas.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-sm">
          <p className="text-body text-textMuted">Nenhuma despesa registrada nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {despesas.map((despesa) => (
            <div
              key={despesa.id}
              className="p-4 bg-surface border border-border rounded-sm hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text">{despesa.descricao}</h4>
                  {despesa.observacao && (
                    <p className="text-xs text-textMuted mt-1">{despesa.observacao}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primarySoft text-primary font-bold text-[10px]">
                      Kz {Number(despesa.valor).toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-textMuted">
                      <CalendarDays size={12} />
                      {dayjs(despesa.data).format("DD/MM/YYYY")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-bgSection border border-border text-[10px] font-semibold text-textSecondary">
                      {despesa.tipo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setDespesaSelecionada(despesa);
                      setOpenEditModal(true);
                    }}
                    className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        open: true,
                        despesaId: despesa.id,
                      })
                    }
                    className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar Despesa */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Editar Despesa"
      >
        <FormDespesa
          despesa={despesaSelecionada}
          categoriaId={categoria?.id}
          onSuccess={() => {
            setOpenEditModal(false);
            fetchDespesas();
            if (onRefresh) onRefresh();
          }}
          onCancel={() => setOpenEditModal(false)}
        />
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, despesaId: null })}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm({ open: false, despesaId: null })}
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
    </div>
  );
}