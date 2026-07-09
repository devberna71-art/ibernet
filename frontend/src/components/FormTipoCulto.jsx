import React, { useState, useEffect } from "react";
import { Church, Edit, Loader2 } from "lucide-react";
import { criarTipoCulto, atualizarTipoCulto } from "../services/cultosService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function FormTipoCulto({ tipoCulto, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (tipoCulto) {
      setFormData({
        nome: tipoCulto.nome || "",
        descricao: tipoCulto.descricao || "",
        ativo: tipoCulto.ativo ?? true,
      });
    }
  }, [tipoCulto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMensagem({ tipo: "", texto: "" });
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, ativo: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      let res;
      if (tipoCulto && tipoCulto.id) {
        res = await atualizarTipoCulto(tipoCulto.id, formData);
      } else {
        res = await criarTipoCulto(formData);
      }

      setMensagem({
        tipo: "success",
        texto: tipoCulto
          ? "Tipo de culto atualizado com sucesso!"
          : "Tipo de culto cadastrado com sucesso!",
      });

      if (onSuccess) onSuccess(res);
      if (!tipoCulto)
        setFormData({ nome: "", descricao: "", ativo: true });
    } catch (err) {
      console.error(err);
      setMensagem({
        tipo: "error",
        texto: err.response?.data?.message || "Erro ao salvar tipo de culto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Interno ou Mensagem de Alerta */}
      {mensagem.texto && (
        <div
          className={`mb-4 px-4 py-3 rounded-md border text-xs font-medium transition-all ${
            mensagem.tipo === "error"
              ? "bg-danger/5 border-danger/20 text-danger"
              : "bg-successSoft border-success/20 text-success"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Nome */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">
            Nome do Tipo de Culto <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="nome"
            required
            placeholder="Ex: Culto de Celebração, Ensino..."
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Input Descrição */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">Descrição</label>
          <textarea
            name="descricao"
            rows={3}
            placeholder="Descreva brevemente o propósito deste tipo de culto..."
            value={formData.descricao}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Toggle/Switch Customizado SaaS */}
        <div className="flex items-center justify-between p-3 rounded-sm border border-border bg-bgSection/10">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text">Status do Tipo</span>
            <span className="text-[11px] text-textMuted">Define se este tipo estará disponível para novos cultos</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={handleSwitchChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin shrink-0" />
                Salvando...
              </>
            ) : (
              <>
                <Edit size={14} className="shrink-0" />
                {tipoCulto ? "Salvar Alterações" : "Cadastrar Tipo"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}