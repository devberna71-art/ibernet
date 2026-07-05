import React, { useEffect, useState } from 'react';
import {
  Plus,
  Building2,
  Check,
  X,
  Pause,
  Loader2,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../api/axiosConfig';
import CadastrarIgrejaDono from '../components/CadastrarIgrejaDono';
import AppPage from '../components/ui/AppPage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

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

export default function Ministerios() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [modalFilhalOpen, setModalFilhalOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);
  const [modalSedeOpen, setModalSedeOpen] = useState(false);
  const [novaSede, setNovaSede] = useState({ nome: '', endereco: '', telefone: '', email: '' });
  const [expandedSedes, setExpandedSedes] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  const fetchSedes = async () => {
    try {
      const res = await api.get('/sedes-com-filhais');
      setSedes(res.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar sedes e filhais.');
      showToast('Erro ao carregar sedes e filhais.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilhalModal = (sede) => {
    setSelectedSede(sede);
    setModalFilhalOpen(true);
  };

  const handleCloseFilhalModal = () => {
    setSelectedSede(null);
    setModalFilhalOpen(false);
  };

  const handleOpenSedeModal = () => setModalSedeOpen(true);
  const handleCloseSedeModal = () => setModalSedeOpen(false);

  const toggleSedeExpansion = (sedeId) => {
    setExpandedSedes(prev => ({ ...prev, [sedeId]: !prev[sedeId] }));
  };

  const atualizarStatus = async ({ tipo, id }, novoStatus) => {
    try {
      await api.patch(`/${tipo}/${id}/status`, { status: novoStatus });

      setSedes(prev =>
        prev.map(sede => {
          if (tipo === 'sedes' && sede.id === id) return { ...sede, status: novoStatus };

          if (sede.Filhals) {
            return {
              ...sede,
              Filhals: sede.Filhals.map(f =>
                tipo === 'filhais' && f.id === id ? { ...f, status: novoStatus } : f
              )
            };
          }

          return sede;
        })
      );
      showToast('Status atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      showToast('Erro ao atualizar status.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return <Badge variant="success"><Check size={12} className="mr-1" />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="warning"><Pause size={12} className="mr-1" />Pendente</Badge>;
      case 'bloqueado':
        return <Badge variant="danger"><X size={12} className="mr-1" />Bloqueado</Badge>;
      default:
        return <Badge variant="muted">{status || 'Pendente'}</Badge>;
    }
  };

  const handleNovaSedeChange = (e) => {
    setNovaSede({ ...novaSede, [e.target.name]: e.target.value });
  };

  const handleNovaSedeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sedes', novaSede);
      setSedes([...sedes, res.data]);
      setNovaSede({ nome: '', endereco: '', telefone: '', email: '' });
      handleCloseSedeModal();
      showToast('Sede cadastrada com sucesso.');
    } catch (err) {
      console.error('Erro ao cadastrar sede:', err);
      showToast('Erro ao cadastrar sede.', 'error');
    }
  };

  return (
    <AppPage subtitle="Gestão de sedes e filiais da igreja.">
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
            <h2 className="text-[18px] font-semibold text-text">Gestão de Igrejas</h2>
            <p className="text-muted text-textMuted mt-0.5">Controle de sedes e filiais</p>
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

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando igrejas...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/5 border border-danger/20 text-danger rounded-sm text-center">
          {error}
        </div>
      ) : sedes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma sede cadastrada.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sedes.map((sede) => {
            const isExpanded = expandedSedes[sede.id] !== false;
            return (
              <Card key={sede.id} padding="p-4">
                {/* Sede Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-text">{sede.nome}</h3>
                      {getStatusBadge(sede.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-textMuted">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {sede.endereco || '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {sede.telefone || '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {sede.email || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Actions */}
                    {sede.status !== 'ativo' && (
                      <button
                        onClick={() => atualizarStatus({ tipo: 'sedes', id: sede.id }, 'ativo')}
                        className="p-1.5 rounded-sm text-textMuted hover:text-success hover:bg-successSoft transition-colors"
                        title="Ativar"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    {sede.status !== 'pendente' && (
                      <button
                        onClick={() => atualizarStatus({ tipo: 'sedes', id: sede.id }, 'pendente')}
                        className="p-1.5 rounded-sm text-textMuted hover:text-warning hover:bg-warning/10 transition-colors"
                        title="Pendente"
                      >
                        <Pause size={14} />
                      </button>
                    )}
                    {sede.status !== 'bloqueado' && (
                      <button
                        onClick={() => atualizarStatus({ tipo: 'sedes', id: sede.id }, 'bloqueado')}
                        className="p-1.5 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                        title="Bloquear"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Toggle Filiais */}
                <button
                  onClick={() => toggleSedeExpansion(sede.id)}
                  className="w-full flex items-center justify-between py-2 border-t border-border text-xs text-textSecondary font-semibold hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    Filiais ({sede.Filhals?.length || 0})
                  </div>
                </button>

                {/* Filiais List */}
                {isExpanded && sede.Filhals && sede.Filhals.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sede.Filhals.map((filhal) => (
                      <div key={filhal.id} className="p-3 bg-bgSection/40 border border-border rounded-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xs font-bold text-text">{filhal.nome}</h4>
                              {getStatusBadge(filhal.status)}
                            </div>
                            <div className="flex flex-wrap gap-3 text-[11px] text-textMuted">
                              <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {filhal.endereco || '-'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={10} />
                                {filhal.telefone || '-'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail size={10} />
                                {filhal.email || '-'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {filhal.status !== 'ativo' && (
                              <button
                                onClick={() => atualizarStatus({ tipo: 'filhais', id: filhal.id }, 'ativo')}
                                className="p-1 rounded-sm text-textMuted hover:text-success hover:bg-successSoft transition-colors"
                                title="Ativar"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            {filhal.status !== 'pendente' && (
                              <button
                                onClick={() => atualizarStatus({ tipo: 'filhais', id: filhal.id }, 'pendente')}
                                className="p-1 rounded-sm text-textMuted hover:text-warning hover:bg-warning/10 transition-colors"
                                title="Pendente"
                              >
                                <Pause size={12} />
                              </button>
                            )}
                            {filhal.status !== 'bloqueado' && (
                              <button
                                onClick={() => atualizarStatus({ tipo: 'filhais', id: filhal.id }, 'bloqueado')}
                                className="p-1 rounded-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-colors"
                                title="Bloquear"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Filial Button */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenFilhalModal(sede)}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" />
                    Adicionar Filial + Usuário
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Filial */}
      <Modal
        open={modalFilhalOpen}
        onClose={handleCloseFilhalModal}
        title={`Cadastrar Filial e Usuário para ${selectedSede?.nome || ''}`}
        maxWidth="max-w-lg"
      >
        <CadastrarIgrejaDono sedeId={selectedSede?.id} />
      </Modal>

      {/* Modal Sede */}
      <Modal
        open={modalSedeOpen}
        onClose={handleCloseSedeModal}
        title="Cadastrar Nova Sede"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleNovaSedeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Nome da Sede *
            </label>
            <input
              type="text"
              name="nome"
              value={novaSede.nome}
              onChange={handleNovaSedeChange}
              required
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={novaSede.endereco}
              onChange={handleNovaSedeChange}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              value={novaSede.telefone}
              onChange={handleNovaSedeChange}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={novaSede.email}
              onChange={handleNovaSedeChange}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>
    </AppPage>
  );
}
