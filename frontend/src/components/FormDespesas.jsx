import React, { useState } from "react";
import { cadastrarDespesa, atualizarDespesa } from "../services/despesasService";
import Button from "./ui/Button";

export default function FormDespesa({
  despesa = null,
  categoriaId = null,
  onSuccess,
  onCancel,
}) {
  const [descricao, setDescricao] = useState(despesa?.descricao || "");
  const [valor, setValor] = useState(despesa?.valor || "");
  const [data, setData] = useState(despesa?.data || "");
  const [tipo, setTipo] = useState(despesa?.tipo || "");
  const [observacao, setObservacao] = useState(despesa?.observacao || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      descricao,
      valor,
      data,
      tipo,
      observacao: observacao || null,
      categoriaId,
    };

    try {
      if (despesa) {
        await atualizarDespesa(despesa.id, payload);
      } else {
        await cadastrarDespesa(payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      alert("Erro ao salvar despesa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Descrição */}
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Descrição da Despesa <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Conta de internet, materiais de escritório..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Valor */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Valor <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-textMuted select-none pointer-events-none">
              Kz
            </span>
            <input
              type="number"
              required
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              className="w-full pl-9 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Data da Despesa <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            required
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Tipo de Despesa */}
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Tipo de Despesa <span className="text-danger">*</span>
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        >
          <option value="">Selecione o tipo de despesa</option>
          <option value="Fixa">Despesa Fixa</option>
          <option value="Variável">Despesa Variável</option>
        </select>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Observações (Opcional)
        </label>
        <textarea
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Detalhes ou observações sobre o pagamento..."
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
          {loading ? 'Salvando...' : despesa ? 'Atualizar Despesa' : 'Cadastrar Despesa'}
        </Button>
      </div>
    </form>
  );
}