import React, { useState, useEffect } from 'react';
import { updateTipoContribuicao, createTipoContribuicao } from '../services/configService';
import Button from './ui/Button';

export default function FormTipoContribuicao({ tipo, onSuccess, onCancel }) {
  const [nome, setNome] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tipo) {
      setNome(tipo.nome);
      setAtivo(tipo.ativo);
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tipo) {
        await updateTipoContribuicao(tipo.id, { nome, ativo });
      } else {
        await createTipoContribuicao({ nome, ativo });
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar tipo de contribuição:', error);
      alert("Erro ao salvar tipo de contribuição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Nome do Tipo de Contribuição <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Dízimo, Oferta Especial, etc."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAtivo(!ativo)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            ativo ? 'bg-primary' : 'bg-border'
          }`}
          role="switch"
          aria-checked={ativo}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              ativo ? 'translate-x-5' : 'translate-x-0'
        }`}
          />
        </button>
        <span className="text-sm font-semibold text-textSecondary select-none">
          {ativo ? 'Ativo' : 'Inativo'}
        </span>
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
          {loading ? 'Salvando...' : tipo ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
