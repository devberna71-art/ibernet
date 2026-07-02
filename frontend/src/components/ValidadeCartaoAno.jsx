import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../api/axiosConfig";
import Button from "./ui/Button";

export default function ValidadeCartaoAno({
  open,
  onClose,
  sedeId,
  filhalId,
  onSuccess
}) {
  const [ano, setAno] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ano) return;

    try {
      await api.post("/admin/config-validade-cartao", {
        SedeId: sedeId || null,
        FilhalId: filhalId || null,
        validade_cartao_ano: Number(ano),
      });

      setAno("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("Erro ao definir validade:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-surface rounded-lg border border-border w-full max-w-sm p-6 shadow-float">
        
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h3 className="text-sm font-bold text-text">Validade do Cartão (anos)</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Número de anos de validade
            </label>
            <input
              type="number"
              required
              min="1"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="Ex: 2"
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
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
  );
}