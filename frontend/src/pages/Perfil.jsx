import React, { useEffect, useState } from 'react';
import { Pencil, Shield, Building2, Phone, Mail, X, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formUsuario, setFormUsuario] = useState({ nome: '' });

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/meu-perfil');
      setUsuario(res.data.usuario);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleOpen = () => {
    setFormUsuario({ nome: usuario.nome });
    setOpenModal(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/meu-perfil', { nome: formUsuario.nome });
      showToast('Perfil atualizado! ✨');
      setOpenModal(false);
      fetchPerfil();
    } catch (error) {
      showToast('Erro ao atualizar', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-2 text-textMuted">
        <Loader2 size={20} className="animate-spin text-primary" />
        <span>Carregando perfil...</span>
      </div>
    );
  }

  if (!usuario) return null;
  const membro = usuario.membro;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === 'error'
            ? 'bg-danger/5 border-danger/20 text-danger'
            : 'bg-successSoft border-success/20 text-success'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Card Compacto Superior */}
      <Card padding="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={membro?.foto || usuario.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
              alt={usuario.nome}
              className="w-20 h-20 rounded-full border-2 border-border object-cover"
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-text">{usuario.nome}</h2>
            <p className="text-xs text-textMuted mt-0.5">{membro?.email || 'Sem e-mail associado'}</p>
            
            {/* Cargos e Departamentos */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3">
              {(membro?.cargos || []).map((c) => (
                <Badge key={c.id} variant="primary">
                  {c.nome}
                </Badge>
              ))}
              {(membro?.departamentos || []).map((d) => (
                <Badge key={d.id} variant="secondary">
                  {d.nome}
                </Badge>
              ))}
              {(!membro?.cargos?.length && !membro?.departamentos?.length) && (
                <span className="text-xs text-textMuted italic">Nenhum cargo ou departamento</span>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpen}
            className="w-full sm:w-auto shrink-0"
          >
            <Pencil size={13} className="shrink-0" />
            Editar Perfil
          </Button>
        </div>
      </Card>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contatos */}
        <Card padding="p-5">
          <div className="flex items-center gap-2 text-primary mb-4 border-b border-border pb-2">
            <Phone size={14} />
            <h3 className="text-xs font-bold text-text uppercase tracking-wide">Contatos</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="block text-[10px] text-textMuted font-semibold uppercase">Telefone</span>
              <p className="text-xs font-bold text-text mt-0.5">{membro?.telefone || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] text-textMuted font-semibold uppercase">E-mail</span>
              <p className="text-xs font-bold text-text mt-0.5">{membro?.email || '—'}</p>
            </div>
          </div>
        </Card>

        {/* Organização */}
        <Card padding="p-5">
          <div className="flex items-center gap-2 text-primary mb-4 border-b border-border pb-2">
            <Building2 size={14} />
            <h3 className="text-xs font-bold text-text uppercase tracking-wide">Organização</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="block text-[10px] text-textMuted font-semibold uppercase">Sede</span>
              <p className="text-xs font-bold text-text mt-0.5">{usuario.Sede?.nome || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] text-textMuted font-semibold uppercase">Filial</span>
              <p className="text-xs font-bold text-text mt-0.5">{usuario.Filhal?.nome || '—'}</p>
            </div>
          </div>
        </Card>

        {/* Segurança */}
        <Card padding="p-5">
          <div className="flex items-center gap-2 text-primary mb-4 border-b border-border pb-2">
            <Shield size={14} />
            <h3 className="text-xs font-bold text-text uppercase tracking-wide">Segurança</h3>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-textMuted leading-relaxed">
              Os dados de login e informações cadastrais estão protegidos de ponta a ponta.
            </p>
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:text-primaryHover transition-colors block mt-2 text-left"
            >
              Alterar senha →
            </button>
          </div>
        </Card>
      </div>

      {/* Modal de Edição */}
      {openModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpenModal(false)} />
          <div className="relative bg-surface rounded-lg border border-border w-full max-w-sm p-6 shadow-float">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Editar Perfil</h3>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="p-1 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formUsuario.nome}
                  onChange={(e) => setFormUsuario({ nome: e.target.value })}
                  placeholder="Seu nome completo"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}