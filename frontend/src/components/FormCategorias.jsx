import React, { useState } from "react";
import { cadastrarCategoria, atualizarCategoria } from "../services/despesasService";
import Button from "./ui/Button";

export default function FormCategoria({
  categoria = null,
  onSuccess,
  onCancel,
}) {
  const [nome, setNome] = useState(categoria?.nome || "");
  const [descricao, setDescricao] = useState(categoria?.descricao || "");
  const [ativa, setAtiva] = useState(
    categoria?.ativa !== undefined ? categoria.ativa : true
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      return alert("O nome da categoria é obrigatório.");
    }

    setLoading(true);

    const payload = {
      nome,
      descricao: descricao || null,
      ativa,
    };

    try {
      if (categoria) {
        await atualizarCategoria(categoria.id, payload);
      } else {
        await cadastrarCategoria(payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Nome da Categoria <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Alimentação"
            className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Descrição
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição curta"
            className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 border border-border rounded-sm bg-bgSection">
        <button
          type="button"
          onClick={() => setAtiva(!ativa)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            ativa ? 'bg-primary' : 'bg-border'
          }`}
          role="switch"
          aria-checked={ativa}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              ativa ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm font-semibold text-textSecondary select-none">
          Categoria ativa
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
          {loading ? 'Salvando...' : categoria ? 'Atualizar Categoria' : 'Cadastrar Categoria'}
        </Button>
      </div>
    </form>
  );
}
