import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import api from '../api/axiosConfig';
import Button from './ui/Button';

export default function CadastrarIgrejaDono({ sedeId, filhalExistenteId, onSuccess }) {
  const [formData, setFormData] = useState({
    filhalNome: '',
    filhalEndereco: '',
    filhalTelefone: '',
    filhalEmail: '',
    filhalStatus: 'pendente',

    usuarioNome: '',
    usuarioSenha: '',
    usuarioFuncao: 'admin'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sedeId) {
      setError('Sede não informada.');
      return;
    }

    if (!formData.usuarioNome || !formData.usuarioSenha) {
      setError('Por favor, preencha o nome e a senha do usuário.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Monta payload básico de usuário administrador vinculado à sede
      const payload = {
        usuarioNome: formData.usuarioNome,
        usuarioSenha: formData.usuarioSenha,
        usuarioFuncao: formData.usuarioFuncao,
        SedeId: sedeId
      };

      // SE A FILIAL JÁ EXISTIR: Injetamos o FilhalId direto no payload do Usuário
      if (filhalExistenteId) {
        payload.FilhalId = filhalExistenteId; 
      } 
      // SE FOR FILIAL NOVA: Segue o fluxo padrão incluindo dados da filial
      else if (formData.filhalNome.trim() !== '') {
        payload.nome = formData.filhalNome;
        payload.endereco = formData.filhalEndereco;
        payload.telefone = formData.filhalTelefone;
        payload.email = formData.filhalEmail;
        payload.status = formData.filhalStatus;
      }

      await api.post('/filhais', payload);

      setSuccess(
        filhalExistenteId
          ? 'Novo usuário cadastrado e vinculado a esta filial com sucesso!'
          : formData.filhalNome.trim() !== ''
            ? 'Filial e Usuário criados com sucesso!'
            : 'Usuário cadastrado com sucesso (vínculo com a sede)!'
      );

      // Limpa os estados
      setFormData({
        filhalNome: '',
        filhalEndereco: '',
        filhalTelefone: '',
        filhalEmail: '',
        filhalStatus: 'pendente',
        usuarioNome: '',
        usuarioSenha: '',
        usuarioFuncao: 'admin'
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-sm bg-danger/5 border border-danger/20 text-danger text-body flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-sm bg-successSoft border border-success/20 text-success text-body flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ESCONDE OS CAMPOS DA FILIAL CASO ELA JÁ EXISTA */}
      {!filhalExistenteId ? (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-2">
            Dados da Filial (opcional)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">Nome da Filial</label>
              <input
                type="text"
                name="filhalNome"
                value={formData.filhalNome}
                onChange={handleChange}
                placeholder="Ex: Filial Sul"
                className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1 font-sans">Endereço da Filial</label>
              <input
                type="text"
                name="filhalEndereco"
                value={formData.filhalEndereco}
                onChange={handleChange}
                placeholder="Rua, Bairro, Cidade"
                className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">Telefone da Filial</label>
              <input
                type="text"
                name="filhalTelefone"
                value={formData.filhalTelefone}
                onChange={handleChange}
                placeholder="Contacto"
                className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">Email da Filial</label>
              <input
                type="email"
                name="filhalEmail"
                value={formData.filhalEmail}
                onChange={handleChange}
                placeholder="email@filial.com"
                className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-textSecondary mb-1">Status da Filial</label>
              <select
                name="filhalStatus"
                value={formData.filhalStatus}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-bgSection border border-border rounded-sm flex items-start gap-2.5 text-xs text-textSecondary mb-3">
          <Info size={14} className="text-primary shrink-0 mt-0.5" />
          <span>Você está adicionando uma nova credencial de acesso para gerenciar esta filial específica.</span>
        </div>
      )}

      {/* Dados do Usuário */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-2">
          Usuário Admin
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">
              Nome do Usuário <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="usuarioNome"
              required
              value={formData.usuarioNome}
              onChange={handleChange}
              placeholder="Nome de login"
              className="w-full px-2.5 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">
              Senha do Usuário <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="usuarioSenha"
                required
                value={formData.usuarioSenha}
                onChange={handleChange}
                placeholder="Senha de acesso"
                className="w-full pl-2.5 pr-8 py-1.5 text-xs text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-textSecondary mb-1">Função</label>
            <input
              type="text"
              name="usuarioFuncao"
              value={formData.usuarioFuncao}
              disabled
              className="w-full px-2.5 py-1.5 text-xs text-textMuted bg-bgSection border border-border rounded-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Cadastrando...
            </>
          ) : filhalExistenteId ? (
            'Vincular Usuário'
          ) : (
            'Cadastrar Filial e Usuário'
          )}
        </Button>
      </div>
    </form>
  );
}