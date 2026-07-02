import React, { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Users as UsersIcon,
  CheckCircle2,
  X,
  Loader2,
  UserPlus,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import api from "../api/axiosConfig";
import CadastrarIgrejaDono from "../components/CadastrarIgrejaDono";
import ValidadeCartaoAno from "../components/ValidadeCartaoAno";
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

export default function GestaoIgrejas() {
  const [validadeOpen, setValidadeOpen] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState(null);
  const [selectedSedeValidade, setSelectedSedeValidade] = useState(null);

  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalFilhalOpen, setModalFilhalOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedFilialParaUsuario, setSelectedFilialParaUsuario] = useState(null); 

  const [modalSedeOpen, setModalSedeOpen] = useState(false);
  const [novaSede, setNovaSede] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
  });

  const [confirmDelete, setConfirmDelete] = useState({ open: false, sede: null, filhal: null });
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" }
  const [expandedSede, setExpandedSede] = useState({});

  useEffect(() => {
    fetchSedes();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSedes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      setSedes(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar sedes e filiais.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilhalModal = (sede, filhal = null) => {
    setSelectedSede(sede);
    setSelectedFilialParaUsuario(filhal); 
    setModalFilhalOpen(true);
  };

  const handleCloseFilhalModal = () => {
    setSelectedSede(null);
    setSelectedFilialParaUsuario(null);
    setModalFilhalOpen(false);
  };

  const handleOpenSedeModal = () => setModalSedeOpen(true);
  const handleCloseSedeModal = () => setModalSedeOpen(false);

  const toggleSedeExpansion = (sedeId) => {
    setExpandedSede(prev => ({
      ...prev,
      [sedeId]: !prev[sedeId]
    }));
  };

  const atualizarStatus = async ({ tipo, id }, novoStatus) => {
    try {
      await api.patch(`/${tipo}/${id}/status`, { status: novoStatus });
      
      setSedes((prev) =>
        prev.map((sede) => {
          if (tipo === "sedes" && sede.id === id) return { ...sede, status: novoStatus };
          if (sede.Filhals) {
            return {
              ...sede,
              Filhals: sede.Filhals.map((f) =>
                tipo === "filhais" && f.id === id ? { ...f, status: novoStatus } : f
              ),
            };
          }
          return sede;
        })
      );
      showToast("Status atualizado com sucesso.");
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar status.", "error");
    }
  };

  const handleDeleteSede = async () => {
    const sede = confirmDelete.sede;
    if (!sede) return;
    try {
      await api.delete(`/sedes/${sede.id}/com-filhais`);
      setSedes((prev) => prev.filter((s) => s.id !== sede.id));
      showToast("Sede removida com sucesso.");
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover sede.", "error");
    } finally {
      setConfirmDelete({ open: false, sede: null, filhal: null });
    }
  };

  const handleDeleteFilhal = async () => {
    const filhal = confirmDelete.filhal;
    if (!filhal) return;
    try {
      await api.delete(`/filhal/${filhal.id}`);
      setSedes((prev) =>
        prev.map((sede) => ({
          ...sede,
          Filhals: sede.Filhals ? sede.Filhals.filter((f) => f.id !== filhal.id) : [],
        }))
      );
      showToast("Filial removida com sucesso.");
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover filial.", "error");
    } finally {
      setConfirmDelete({ open: false, sede: null, filhal: null });
    }
  };

  const handleNovaSedeChange = (e) => {
    setNovaSede({ ...novaSede, [e.target.name]: e.target.value });
  };

  const handleNovaSedeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/sedes", novaSede);
      setSedes((prev) => [...prev, res.data]);
      setNovaSede({ nome: "", endereco: "", telefone: "", email: "" });
      handleCloseSedeModal();
      showToast("Sede cadastrada com sucesso.");
    } catch (err) {
      console.error(err);
      showToast("Erro ao cadastrar sede.", "error");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "ativo":
        return "success";
      case "bloqueado":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <AppPage subtitle="Painel de controle — gerencie sedes, filiais, credenciais e validades de cartões.">
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

      {/* Header com busca e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Gestão de Igrejas</h2>
            <p className="text-muted text-textMuted mt-0.5">Controle central de Congregações Sede e Filiais.</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleOpenSedeModal}
        >
          <Plus size={15} className="w-4 h-4 shrink-0" />
          Nova Sede
        </Button>
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando igrejas...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/5 border border-danger/20 text-danger rounded-sm flex items-center gap-2">
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {sedes.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-body text-textMuted">Nenhuma congregação Sede cadastrada no sistema.</p>
            </Card>
          ) : (
            sedes.map((sede) => {
              const statusClean = (sede.status || "pendente").toLowerCase();
              const isExpanded = expandedSede[sede.id] !== false; // Padrão aberto
              
              return (
                <div key={sede.id} className="border border-border rounded-sm bg-surface overflow-hidden shadow-sm">
                  {/* Cabeçalho da Sede */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-bgSection/30 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-sm bg-primarySoft text-primary flex items-center justify-center font-bold text-lg shrink-0">
                        {sede.nome ? sede.nome.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-text">{sede.nome}</h3>
                          <Badge variant={getStatusBadgeVariant(statusClean)}>{statusClean}</Badge>
                        </div>
                        <p className="text-xs text-textMuted mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {sede.endereco || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Ações da Sede */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Botões de Alteração de Status */}
                      {statusClean !== "ativo" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => atualizarStatus({ tipo: "sedes", id: sede.id }, "ativo")}
                        >
                          Ativar
                        </Button>
                      )}
                      {statusClean !== "bloqueado" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/5 hover:text-danger"
                          onClick={() => atualizarStatus({ tipo: "sedes", id: sede.id }, "bloqueado")}
                        >
                          Bloquear
                        </Button>
                      )}
                      {statusClean !== "pendente" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => atualizarStatus({ tipo: "sedes", id: sede.id }, "pendente")}
                        >
                          Pendente
                        </Button>
                      )}

                      <span className="w-px h-5 bg-border mx-1" />

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger hover:bg-danger/5 hover:text-danger"
                        onClick={() => setConfirmDelete({ open: true, sede, filhal: null })}
                      >
                        <Trash2 size={13} />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenFilhalModal(sede, null)}
                      >
                        <Plus size={13} className="shrink-0" />
                        Adicionar Filial
                      </Button>
                    </div>
                  </div>

                  {/* Toggle para filiais */}
                  <div className="px-5 py-2.5 border-b border-border bg-bgSection/10 flex items-center justify-between text-xs text-textSecondary font-semibold">
                    <button
                      onClick={() => toggleSedeExpansion(sede.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Filiais ({sede.Filhals ? sede.Filhals.length : 0})
                    </button>
                    <span className="text-textMuted font-normal">{sede.quantidadeMembros || 0} Membros Totais</span>
                  </div>

                  {/* Lista de Filiais */}
                  {isExpanded && (
                    <div className="p-4 bg-surface space-y-2.5">
                      {sede.Filhals && sede.Filhals.length > 0 ? (
                        sede.Filhals.map((filhal) => {
                          const filhalStatusClean = (filhal.status || "pendente").toLowerCase();
                          return (
                            <div
                              key={filhal.id}
                              className="p-4 bg-bgSection/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-primary/20 transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-text">{filhal.nome}</h4>
                                  <Badge variant={getStatusBadgeVariant(filhalStatusClean)}>{filhalStatusClean}</Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-textMuted mt-1.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={10} />
                                    {filhal.endereco || "-"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone size={10} />
                                    {filhal.telefone || "-"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <UsersIcon size={10} />
                                    {filhal.quantidadeMembros || 0} Membros
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {/* Botões rápidos de status para a filial */}
                                {filhalStatusClean !== "ativo" && (
                                  <button
                                    onClick={() => atualizarStatus({ tipo: "filhais", id: filhal.id }, "ativo")}
                                    className="p-1 text-textMuted hover:text-success hover:bg-successSoft rounded transition-colors"
                                    title="Marcar como Ativa"
                                  >
                                    Ativar
                                  </button>
                                )}
                                {filhalStatusClean !== "bloqueado" && (
                                  <button
                                    onClick={() => atualizarStatus({ tipo: "filhais", id: filhal.id }, "bloqueado")}
                                    className="p-1 text-textMuted hover:text-danger hover:bg-danger/5 rounded transition-colors"
                                    title="Bloquear Filial"
                                  >
                                    Bloquear
                                  </button>
                                )}
                                {filhalStatusClean !== "pendente" && (
                                  <button
                                    onClick={() => atualizarStatus({ tipo: "filhais", id: filhal.id }, "pendente")}
                                    className="p-1 text-textMuted hover:text-warning hover:bg-warning/10 rounded transition-colors"
                                    title="Colocar Pendente"
                                  >
                                    Pendente
                                  </button>
                                )}

                                <span className="w-px h-4 bg-border mx-1" />

                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleOpenFilhalModal(sede, filhal)}
                                >
                                  <UserPlus size={12} className="shrink-0" />
                                  + Usuário
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedFilial(filhal);
                                    setSelectedSedeValidade(sede);
                                    setValidadeOpen(true);
                                  }}
                                >
                                  Validade
                                </Button>

                                <button
                                  onClick={() => setConfirmDelete({ open: true, sede: null, filhal })}
                                  className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                                  title="Remover Filial"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 border border-dashed border-border rounded-sm bg-bgSection/10">
                          <p className="text-xs text-textMuted">Nenhuma filial cadastrada sob esta sede.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Filial (Nova ou Usuário Extra) */}
      <Modal
        open={modalFilhalOpen}
        onClose={handleCloseFilhalModal}
        title={
          selectedFilialParaUsuario 
            ? `Adicionar Usuário Admin em: ${selectedFilialParaUsuario.nome}` 
            : selectedSede ? `Cadastrar Filial — Sede ${selectedSede.nome}` : "Cadastrar Filial"
        }
        maxWidth="max-w-lg"
      >
        {selectedSede && (
          <CadastrarIgrejaDono 
            sedeId={selectedSede.id} 
            filhalExistenteId={selectedFilialParaUsuario?.id} 
            onSuccess={() => {
              fetchSedes();
              handleCloseFilhalModal();
            }} 
          />
        )}
      </Modal>

      {/* Modal Nova Sede */}
      <Modal
        open={modalSedeOpen}
        onClose={handleCloseSedeModal}
        title="Nova Congregação Sede"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleNovaSedeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Nome da Sede *</label>
            <input
              type="text"
              name="nome"
              required
              value={novaSede.nome}
              onChange={handleNovaSedeChange}
              placeholder="Ex: Igreja Central"
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Endereço *</label>
            <input
              type="text"
              name="endereco"
              required
              value={novaSede.endereco}
              onChange={handleNovaSedeChange}
              placeholder="Rua, Cidade, Província"
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={novaSede.telefone}
                onChange={handleNovaSedeChange}
                placeholder="Ex: 923 000 000"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={novaSede.email}
                onChange={handleNovaSedeChange}
                placeholder="email@igreja.com"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCloseSedeModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Cadastrar Sede
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmar Exclusão */}
      <Modal
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, sede: null, filhal: null })}
        title="Confirmar exclusão"
        maxWidth="max-w-sm"
      >
        <p className="text-body text-textMuted mb-5">
          {confirmDelete.sede
            ? `Tem certeza de que deseja remover a Sede "${confirmDelete.sede.nome}" e todas as suas filiais vinculadas? Esta ação não pode ser desfeita.`
            : `Tem certeza de que deseja remover a filial "${confirmDelete.filhal?.nome}"? Esta ação não pode ser desfeita.`}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete({ open: false, sede: null, filhal: null })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete.sede ? handleDeleteSede : handleDeleteFilhal}
          >
            Excluir
          </Button>
        </div>
      </Modal>

      {/* Componente ValidadeCartaoAno */}
      <ValidadeCartaoAno
        open={validadeOpen}
        onClose={() => setValidadeOpen(false)}
        sedeId={selectedSedeValidade?.id}
        filhalId={selectedFilial?.id}
        onSuccess={fetchSedes}
      />
    </AppPage>
  );
}