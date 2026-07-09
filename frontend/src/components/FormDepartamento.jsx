import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { updateDepartamento, createDepartamento } from "../services/configService";
import Button from "./ui/Button";

export default function FormDepartamento({ departamento, onSuccess, onCancel }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (departamento) {
      setNome(departamento.nome || "");
      setDescricao(departamento.descricao || "");
      setLocal(departamento.local || "");
    }
  }, [departamento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nome,
        descricao,
        local,
      };

      if (departamento && departamento.id) {
        await updateDepartamento(departamento.id, payload);
      } else {
        await createDepartamento(payload);
      }

      onSuccess(); 
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      alert("Erro ao salvar departamento. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Nome do Departamento <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Departamento de Música, Jovens, Casais..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Descrição (Opcional)
        </label>
        <textarea
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva a finalidade, objetivos ou missão do departamento..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1.5">
          Local / Sala
        </label>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex: Bloco A, Sala 3, Anexo..."
          className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
          ) : departamento ? (
            'Salvar'
          ) : (
            'Cadastrar'
          )}
        </Button>
      </div>
    </form>
  );
}
