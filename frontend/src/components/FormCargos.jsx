import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosConfig';
import Button from './ui/Button';

export default function CadastrarCargo({ cargo, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (cargo) {
      setFormData({
        nome: cargo.nome || '',
        descricao: cargo.descricao || '',
      });
    }
  }, [cargo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome) {
      setMensagem({ tipo: 'error', texto: 'O nome do cargo é obrigatório.' });
      return;
    }

    setLoading(true);
    try {
      let res;
      if (cargo) {
        res = await api.put(`/cargos/${cargo.id}`, formData);
        setMensagem({ tipo: 'success', texto: res.data.message || 'Cargo atualizado com sucesso!' });
      } else {
        res = await api.post('/cadastrar-cargos', formData);
        setMensagem({ tipo: 'success', texto: res.data.message || 'Cargo cadastrado com sucesso!' });
        setFormData({ nome: '', descricao: '' });
      }

      if (onSuccess) onSuccess(); 
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao salvar o cargo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mensagem.texto && (
        <div className={`px-4 py-3 rounded-sm border text-body flex items-center gap-2 ${
          mensagem.tipo === 'error'
            ? 'bg-danger/5 border-danger/20 text-danger'
            : 'bg-successSoft border-success/20 text-success'
        }`}>
          {mensagem.tipo === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{mensagem.texto}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Nome do Cargo <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: Pastor, Administrador, Diácono..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Descrição (Opcional)
        </label>
        <textarea
          rows={4}
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descreva as funções, atribuições e responsabilidades deste cargo..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Salvando...
            </>
          ) : cargo ? (
            'Salvar Alterações'
          ) : (
            'Cadastrar Cargo'
          )}
        </Button>
      </div>
    </form>
  );
}
