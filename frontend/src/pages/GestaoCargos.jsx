import React, { useEffect, useState, useMemo } from "react";
import { Briefcase, Plus, Pencil, Trash2, Search, Loader2, Users as UsersIcon, CalendarDays, Percent, BarChart3, Star, X } from "lucide-react";
import api from "../api/axiosConfig";
import FormCargos from "../components/FormCargos";
import AtribuirCargoMembro from "../components/AtribuirCargoMembro";
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

export default function GestaoCargos() {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openCargoModal, setOpenCargoModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [deletingCargo, setDeletingCargo] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lista/cargos");
      setCargos(res.data || []);
      setFilteredCargos(res.data || []);
    } catch {
      showToast("Erro ao carregar cargos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);
  
  useEffect(() => {
    setFilteredCargos(
      !search 
        ? cargos 
        : cargos.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, cargos]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const totalCargos = cargos.length;
    const totalMembros = cargos.reduce((acc, curr) => acc + (curr.totalMembros || 0), 0);
    const mediaMembros = totalCargos > 0 ? (totalMembros / totalCargos).toFixed(1) : 0;
    
    let cargoMaisOcupado = { nome: "Nenhum", totalMembros: 0 };
    if (totalCargos > 0) {
      const topCargo = [...cargos].sort((a, b) => b.totalMembros - a.totalMembros)[0];
      if (topCargo && topCargo.totalMembros > 0) {
        cargoMaisOcupado = topCargo;
      }
    }

    return { totalCargos, totalMembros, mediaMembros, cargoMaisOcupado };
  }, [cargos]);

  const handleOpenNewCargo = () => {
    setEditingCargo(null);
    setOpenCargoModal(true);
  };

  const handleEditCargo = (cargo) => {
    setEditingCargo(cargo);
    setOpenCargoModal(true);
  };

  const handleDeleteClick = (cargo) => {
    setDeletingCargo(cargo);
  };
  
  const confirmDelete = async () => {
    try {
      await api.delete(`/cargos/${deletingCargo.id}`);
      showToast("Cargo excluído com sucesso.");
      setDeletingCargo(null);
      fetchCargos();
    } catch {
      showToast("Erro ao excluir cargo.", "error");
    }
  };

  const cancelDelete = () => setDeletingCargo(null);
  const handleCloseModal = () => {
    setOpenCargoModal(false);
    setEditingCargo(null);
  };

  return (
    <AppPage subtitle="Acompanhe métricas, gerencie funções corporativas e distribua sua equipe de forma inteligente.">
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
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Gestão de Cargos</h2>
            <p className="text-muted text-textMuted mt-0.5">Definição de funções e atribuições organizacionais.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenNewCargo}
          >
            <Plus size={15} className="w-4 h-4 shrink-0" />
            Novo Cargo
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Total de Cargos</span>
            <p className="text-xl font-bold text-text mt-1">{stats.totalCargos}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-primarySoft text-primary flex items-center justify-center">
            <Briefcase size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Membros Alocados</span>
            <p className="text-xl font-bold text-text mt-1">{stats.totalMembros}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-successSoft text-success flex items-center justify-center">
            <UsersIcon size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Média por Cargo</span>
            <p className="text-xl font-bold text-text mt-1">{stats.mediaMembros}</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-warning/10 text-warning flex items-center justify-center">
            <Percent size={18} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Mais Ocupado</span>
            <p className="text-sm font-bold text-text mt-2 truncate w-32" title={stats.cargoMaisOcupado.nome}>
              {stats.cargoMaisOcupado.nome}
            </p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Star size={18} />
          </div>
        </Card>
      </div>

      {/* Barra de Busca */}
      <Card padding="p-4" className="mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome do cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </Card>

      {/* Grid de Cargos */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando cargos...</span>
        </div>
      ) : filteredCargos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhum cargo encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCargos.map((cargo) => {
            const percentagemMembros = stats.totalMembros > 0 ? (cargo.totalMembros / stats.totalMembros) * 100 : 0;
            return (
              <Card
                key={cargo.id}
                padding="p-5"
                className="hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-sm bg-primarySoft text-primary flex items-center justify-center shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text">{cargo.nome}</h4>
                      <p className="text-xs text-textMuted mt-0.5">
                        {cargo.totalMembros || 0} membro(s) alocado(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCargo(cargo)}
                      className="p-1.5 rounded-sm text-textMuted hover:text-primary hover:bg-primarySoft transition-colors"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cargo)}
                      className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-textMuted mb-4 line-clamp-2 min-h-[32px] leading-relaxed">
                  {cargo.descricao || "Nenhuma descrição fornecida para este cargo corporativo."}
                </p>

                {/* Proporção na Equipe */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between items-center text-[10px] text-textMuted font-semibold">
                    <span>Representação na Equipe</span>
                    <span>{percentagemMembros.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentagemMembros}%` }}
                      className="bg-primary h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-textMuted">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={10} />
                    Última Alteração: {cargo.ultimoAtribuido ? new Date(cargo.ultimoAtribuido).toLocaleDateString("pt-BR") : "Sem histórico"}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Componente Atribuir Cargo */}
      <AtribuirCargoMembro cargos={cargos} />

      {/* Modal Cadastro/Edição */}
      <Modal
        open={openCargoModal}
        onClose={handleCloseModal}
        title={editingCargo ? "Editar Cargo" : "Cadastrar Novo Cargo"}
      >
        <FormCargos
          cargo={editingCargo}
          onSuccess={() => {
            handleCloseModal();
            fetchCargos();
          }}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        open={Boolean(deletingCargo)}
        onClose={cancelDelete}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Deseja realmente excluir o cargo <strong>{deletingCargo?.nome}</strong>? Essa operação é irreversível.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelDelete}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </AppPage>
  );
}