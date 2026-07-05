import React, { useEffect, useState } from "react";
import {
  Building2,
  Filter,
  Download,
  Loader2,
  X,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import api from "../../api/axiosConfig";
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

export default function RelatorioSede() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  const fetchSedes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      setSedes(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar dados das sedes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatKz = (valor) => {
    return `${Number(valor || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
  };

  return (
    <AppPage subtitle="Relatório consolidado por sede e filiais.">
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
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Relatório por Sede</h2>
            <p className="text-muted text-textMuted mt-0.5">Visão consolidada de congregações</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => showToast("Funcionalidade de exportação em desenvolvimento", "info")}
        >
          <Download size={15} className="w-4 h-4 shrink-0 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando relatório...</span>
        </div>
      ) : sedes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma sede encontrada.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sedes.map((sede) => (
            <Card key={sede.id} padding="p-4" className="hover:border-primary/20 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">{sede.nome}</h3>
                    <p className="text-xs text-textMuted">{sede.endereco || "Sem endereço"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sede.status === "ativo" ? "success" : "warning"}>
                    {sede.status || "Pendente"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSede(sede);
                      setOpenModal(true);
                    }}
                  >
                    <Filter size={13} className="mr-1" />
                    Detalhes
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-textMuted" />
                    <span className="text-[10px] font-semibold text-textMuted uppercase">Membros</span>
                  </div>
                  <p className="text-lg font-bold text-text">{sede.quantidadeMembros || 0}</p>
                </div>
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 size={14} className="text-textMuted" />
                    <span className="text-[10px] font-semibold text-textMuted uppercase">Filiais</span>
                  </div>
                  <p className="text-lg font-bold text-text">{sede.Filhals?.length || 0}</p>
                </div>
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={14} className="text-textMuted" />
                    <span className="text-[10px] font-semibold text-textMuted uppercase">Receita</span>
                  </div>
                  <p className="text-lg font-bold text-success">{formatKz(sede.totalReceita || 0)}</p>
                </div>
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-textMuted" />
                    <span className="text-[10px] font-semibold text-textMuted uppercase">Despesas</span>
                  </div>
                  <p className="text-lg font-bold text-danger">{formatKz(sede.totalDespesas || 0)}</p>
                </div>
              </div>

              {/* Filiais */}
              {sede.Filhals && sede.Filhals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wide mb-3">Filiais</h4>
                  <div className="space-y-2">
                    {sede.Filhals.map((filial) => (
                      <div key={filial.id} className="p-3 bg-bgSection/30 rounded-sm border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-text">{filial.nome}</p>
                            <p className="text-[10px] text-textMuted">{filial.endereco || "Sem endereço"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-textMuted">{filial.quantidadeMembros || 0} membros</span>
                            <Badge variant={filial.status === "ativo" ? "success" : "warning"} className="text-[10px]">
                              {filial.status || "Pendente"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detalhes */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedSede(null);
        }}
        title={`Detalhes: ${selectedSede?.nome || ""}`}
        maxWidth="max-w-lg"
      >
        {selectedSede && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-text mb-2">Informações Gerais</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-textSecondary">Nome:</span> {selectedSede.nome}</p>
                <p><span className="font-semibold text-textSecondary">Endereço:</span> {selectedSede.endereco || "Não informado"}</p>
                <p><span className="font-semibold text-textSecondary">Telefone:</span> {selectedSede.telefone || "Não informado"}</p>
                <p><span className="font-semibold text-textSecondary">Email:</span> {selectedSede.email || "Não informado"}</p>
                <p><span className="font-semibold text-textSecondary">Status:</span> {selectedSede.status || "Pendente"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-text mb-2">Estatísticas</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <p className="text-[10px] text-textMuted uppercase">Membros</p>
                  <p className="text-lg font-bold text-text">{selectedSede.quantidadeMembros || 0}</p>
                </div>
                <div className="p-3 bg-bgSection/50 rounded-sm">
                  <p className="text-[10px] text-textMuted uppercase">Filiais</p>
                  <p className="text-lg font-bold text-text">{selectedSede.Filhals?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AppPage>
  );
}
