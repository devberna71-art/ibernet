// pages/GestaoMembros.jsx
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  FileText,
  User,
  Clock,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from "lucide-react";
import api from "../api/axiosConfig";
import AppPage from "../components/ui/AppPage";
import Card, { CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormMembros from "../components/FormMembros";
import CartaoMembros from "../components/CartaoMembros";
import PerfilMembros from "../components/PerfilMembro";
import HistoricoMembro from "../components/HistoricoMembro";
import MembroCriadoCard from "../components/MembroCriadoCard";

/** Ação inline que aparece no hover do item */
function ActionBtn({ onClick, icon: Icon, label, variant = "ghost" }) {
  const colors = {
    ghost: "text-textMuted hover:text-text hover:bg-bgSection",
    danger: "text-textMuted hover:text-danger hover:bg-danger/5",
    primary: "text-textMuted hover:text-primary hover:bg-primarySoft",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-sm transition-colors duration-150 ${colors[variant]}`}
    >
      <Icon size={15} strokeWidth={1.75} />
    </button>
  );
}

/** Modal genérico leve */
function Modal({ open, onClose, title, children, maxWidth = "max-w-2xl" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`relative bg-surface rounded-lg border border-border shadow-float w-full ${maxWidth} max-h-[90vh] overflow-auto`}
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-cardTitle text-text text-base sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
            aria-label="Fechar modal"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 8;

export default function GestaoMembros() {
  const [membros, setMembros] = useState([]);
  const [filteredMembros, setFilteredMembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [deletingMembro, setDeletingMembro] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" }

  const [openMembroModal, setOpenMembroModal] = useState(false);
  const [openCartaoModal, setOpenCartaoModal] = useState(false);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [openHistoricoModal, setOpenHistoricoModal] = useState(false);

  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [perfilMembro, setPerfilMembro] = useState(null);
  const [historicoMembro, setHistoricoMembro] = useState(null);
  const [membroEditar, setMembroEditar] = useState(null);
  const [membroCriado, setMembroCriado] = useState(null);
  const [openMembroCriadoCard, setOpenMembroCriadoCard] = useState(false);

  const [page, setPage] = useState(1);

  // ---- Helpers ----
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMembros = async () => {
    setLoading(true);
    try {
      const res = await api.get("/membros");
      setMembros(res.data || []);
      setFilteredMembros(res.data || []);
    } catch {
      showToast("Erro ao carregar membros.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredMembros(
      search ? membros.filter((m) => (m.nome || "").toLowerCase().includes(q)) : membros
    );
    setPage(1);
  }, [search, membros]);

  // ---- Paginação ----
  const totalPages = Math.ceil(filteredMembros.length / ITEMS_PER_PAGE);
  const paginatedMembros = filteredMembros.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ---- Ações ----
  const handleDeleteClick = (membro) => setDeletingMembro(membro);
  const cancelDelete = () => setDeletingMembro(null);

  const confirmDelete = async () => {
    try {
      await api.delete(`/membros/${deletingMembro.id}`);
      showToast("Membro excluído com sucesso.");
      setDeletingMembro(null);
      await fetchMembros();
    } catch {
      showToast("Erro ao excluir membro.", "error");
    }
  };

  const handleEditarMembro = async (membro) => {
    try {
      setLoading(true);
      const res = await api.get(`/completos-membros/${membro.id}`);
      setMembroEditar(res.data);
      setOpenMembroModal(true);
    } catch {
      showToast("Erro ao carregar dados do membro.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerHistorico = async (membro) => {
    try {
      const res = await api.get(`/membros/${membro.id}/historico`);
      setHistoricoMembro(res.data);
      setOpenHistoricoModal(true);
    } catch {
      showToast("Erro ao carregar histórico.", "error");
    }
  };

  const handleVerPerfil = async (membro) => {
    try {
      const res = await api.get(`/perfil-membros/${membro.id}`);
      setPerfilMembro(res.data);
      setOpenPerfilModal(true);
    } catch {
      showToast("Erro ao carregar perfil.", "error");
    }
  };

  const handleExtrairCartao = (membro) => {
    setMembroSelecionado(membro);
    setOpenCartaoModal(true);
  };

  const getInitials = (nome) =>
    nome
      ? nome
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "M";

  return (
    <AppPage subtitle="Gerencie membros, cartões e históricos.">
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

      {/* Header com busca e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-5">
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-semibold text-text">Membros</h2>
          <p className="text-muted text-textMuted mt-0.5 text-xs sm:text-sm">
            {filteredMembros.length} membro{filteredMembros.length !== 1 ? "s" : ""} encontrado{filteredMembros.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Busca */}
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              id="membros-search"
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors w-full sm:w-52"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            id="membros-novo-btn"
            onClick={() => { setMembroEditar(null); setOpenMembroModal(true); }}
            className="shrink-0"
          >
            <Plus size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Novo membro</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Lista */}
      <Card padding="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16 gap-2 text-textMuted">
            <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
            <span className="text-body">Carregando...</span>
          </div>
        ) : filteredMembros.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-body text-textMuted">Nenhum membro encontrado.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {paginatedMembros.map((membro) => (
              <li
                key={membro.id}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 group hover:bg-bgSection transition-colors duration-100"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primarySoft flex items-center justify-center shrink-0 overflow-hidden">
                  {membro.foto ? (
                    <img
                      src={membro.foto}
                      alt={membro.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[12px] font-semibold text-primary">
                      {getInitials(membro.nome)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-text truncate">{membro.nome}</p>
                  <p className="text-muted text-textMuted truncate text-xs sm:text-sm">
                    {[membro.profissao, membro.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>

                {/* Ações — visíveis em touch, hover em desktop */}
                <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                  <ActionBtn onClick={() => handleExtrairCartao(membro)} icon={FileText} label="Extrair cartão" variant="primary" />
                  <ActionBtn onClick={() => handleVerPerfil(membro)} icon={User} label="Ver perfil" />
                  <ActionBtn onClick={() => handleVerHistorico(membro)} icon={Clock} label="Histórico" />
                  <ActionBtn onClick={() => handleEditarMembro(membro)} icon={Pencil} label="Editar" />
                  <ActionBtn onClick={() => handleDeleteClick(membro)} icon={Trash2} label="Excluir" variant="danger" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <p className="text-muted text-textMuted text-xs sm:text-sm">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              id="membros-prev-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={14} strokeWidth={2} />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              id="membros-next-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight size={14} strokeWidth={2} />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Cadastro / Edição */}
      <Modal
        open={openMembroModal}
        onClose={() => { setOpenMembroModal(false); setMembroEditar(null); }}
        title={membroEditar ? "Editar Membro" : "Cadastrar Novo Membro"}
      >
        <FormMembros
          membroData={membroEditar}
          onSuccess={async (dadosMembro) => {
            setOpenMembroModal(false);
            setMembroEditar(null);
            await fetchMembros();
            if (!membroEditar && dadosMembro) {
              setMembroCriado({ nome: dadosMembro.nome, senhaInicial: dadosMembro.senhaInicial });
              setOpenMembroCriadoCard(true);
            }
            showToast(membroEditar ? "Membro atualizado com sucesso." : "Membro cadastrado com sucesso.");
          }}
        />
        <div className="flex justify-end mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => { setOpenMembroModal(false); setMembroEditar(null); }}>
            Fechar
          </Button>
        </div>
      </Modal>

      {/* Modal Cartão */}
      <Modal
        open={openCartaoModal}
        onClose={() => { setOpenCartaoModal(false); setMembroSelecionado(null); }}
        title="Cartão de Membro"
        maxWidth="max-w-sm"
      >
        {membroSelecionado && (
          <CartaoMembros membro={membroSelecionado} onClose={() => { setOpenCartaoModal(false); setMembroSelecionado(null); }} />
        )}
      </Modal>

      {/* Modal Perfil */}
      <Modal
        open={openPerfilModal}
        onClose={() => { setOpenPerfilModal(false); setPerfilMembro(null); }}
        title="Perfil do Membro"
      >
        {perfilMembro && <PerfilMembros membro={perfilMembro} onClose={() => { setOpenPerfilModal(false); setPerfilMembro(null); }} />}
      </Modal>

      {/* Modal Histórico */}
      <Modal
        open={openHistoricoModal}
        onClose={() => { setOpenHistoricoModal(false); setHistoricoMembro(null); }}
        title="Histórico do Membro"
      >
        {historicoMembro && <HistoricoMembro historico={historicoMembro} onClose={() => { setOpenHistoricoModal(false); setHistoricoMembro(null); }} />}
      </Modal>

      {/* Confirmar Exclusão */}
      <Modal
        open={!!deletingMembro}
        onClose={cancelDelete}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          Tem certeza que deseja excluir o membro{" "}
          <span className="font-semibold text-text">"{deletingMembro?.nome}"</span>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={cancelDelete}>Cancelar</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>

      {/* Card de membro criado */}
      {openMembroCriadoCard && membroCriado && (
        <MembroCriadoCard
          data={membroCriado}
          onClose={() => { setOpenMembroCriadoCard(false); setMembroCriado(null); }}
        />
      )}
    </AppPage>
  );
}
