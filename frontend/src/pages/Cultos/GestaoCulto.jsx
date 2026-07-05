import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Church,
  Diamond,
} from "lucide-react";
import api from "../../api/axiosConfig";
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

export default function GestaoCulto() {
  const [tiposCultos, setTiposCultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTipoCulto, setSelectedTipoCulto] = useState(null);
  const [error, setError] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchTiposCultos = async () => {
      try {
        const response = await api.get("/tabela-cultos1");
        setTiposCultos(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar tipos de cultos:", error);
        showToast("Erro ao carregar tipos de cultos.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchTiposCultos();
  }, []);

  const handleEdit = (tipo) => {
    setSelectedTipoCulto(tipo);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!tipoToDelete) return;
    try {
      await api.delete(`/tipocultos/${tipoToDelete.id}`);
      setTiposCultos((prev) => prev.filter((t) => t.id !== tipoToDelete.id));
      setError(null);
      setOpenConfirmDelete(false);
      showToast("Tipo de culto excluído com sucesso.");
    } catch (error) {
      setError("Erro ao excluir o tipo de culto.");
      showToast("Erro ao excluir o tipo de culto.", "error");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTipoCulto(null);
  };

  const handleConfirmDelete = (tipo) => {
    setTipoToDelete(tipo);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setTipoToDelete(null);
  };

  const handleNewTipoCultoAdded = (newTipoCulto) => {
    setTiposCultos((prev) => {
      const exists = prev.find((t) => t.id === newTipoCulto.id);
      return exists
        ? prev.map((t) => (t.id === newTipoCulto.id ? newTipoCulto : t))
        : [newTipoCulto, ...prev];
    });
    setOpenModal(false);
    setSelectedTipoCulto(null);
    showToast("Tipo de culto salvo com sucesso!");
  };

  return (
    <AppPage subtitle="Gestão elegante dos tipos de cultos da igreja.">
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
            <Diamond size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Tipos de Cultos</h2>
            <p className="text-muted text-textMuted mt-0.5">
              Gestão elegante dos tipos de cultos da igreja
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="bg-primarySoft text-primary">
            <Church size={12} className="mr-1" />
            {tiposCultos.length} Tipos cadastrados
          </Badge>
          <Button
            variant="primary"
            size="md"
            onClick={() => setOpenModal(true)}
          >
            <Plus size={15} className="w-4 h-4 shrink-0" />
            Novo Tipo
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando tipos de culto...</span>
        </div>
      ) : tiposCultos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhum tipo de culto disponível</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tiposCultos.map((tipo, index) => (
            <Card
              key={tipo.id}
              padding="p-4"
              className="hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-text mb-2">{tipo.nome}</h3>
                  <div className="w-12 h-0.5 bg-primary rounded mb-2" />
                  <p className="text-xs text-textMuted">
                    {tipo.descricao || "Sem descrição disponível para este tipo de culto."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(tipo)}
                    className="p-2 rounded-sm bg-primarySoft text-primary hover:bg-primary/20 transition-colors"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(tipo)}
                    className="p-2 rounded-sm bg-danger/5 text-danger hover:bg-danger/10 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-sm bg-danger/5 border border-danger/20 text-danger text-body">
          {error}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={selectedTipoCulto ? "Editar Tipo de Culto" : "Novo Tipo de Culto"}
        maxWidth="max-w-lg"
      >
        <FormTipoCulto
          tipoCulto={selectedTipoCulto}
          onSuccess={handleNewTipoCultoAdded}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Tem certeza que deseja excluir este tipo de culto? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseConfirmDelete}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </AppPage>
  );
}
