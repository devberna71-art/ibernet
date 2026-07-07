// src/components/FormSubsidios.jsx
import React, { useEffect, useState } from "react";
import { Loader2, Coins, Percent, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../api/axiosConfig";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function FormSubsidios({ editData, onFinish, onCancelEdit }) {
  const [nome, setNome] = useState("");
  const [percentagem, setPercentagem] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const isEditMode = !!editData;

  // Preencher campos automaticamente em modo de edição
  useEffect(() => {
    if (editData) {
      setNome(editData.nome || "");
      setPercentagem(editData.percentagem || "");
      setAtivo(editData.ativo);
    }
  }, [editData]);

  const resetForm = () => {
    setNome("");
    setPercentagem("");
    setAtivo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSalvando(true);
      setMensagem({ tipo: "", texto: "" });

      const token = localStorage.getItem("token");
      const payload = { 
        nome, 
        percentagem: Number(percentagem), 
        ativo 
      };

      if (isEditMode) {
        await api.put(`/subsidios/${editData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem({
          tipo: "success",
          texto: "Subsídio atualizado com sucesso!",
        });
      } else {
        await api.post("/subsidios", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem({
          tipo: "success",
          texto: "Subsídio cadastrado com sucesso!",
        });
      }

      resetForm();
      onFinish?.();

    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: error?.response?.data?.message || "Erro operacional ao salvar subsídio.",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full text-left max-w-xl mx-auto">
      <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl bg-white">
        
        {/* Cabeçalho da Estrutura */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <Coins size={14} />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isEditMode ? "Modificar Subsídio" : "Gestão de Subsídios e Abonos"}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Financeiro
          </span>
        </div>

        {/* Retornos de Feedback Operacional */}
        {mensagem.texto && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-xs border ${
              mensagem.tipo === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}
          >
            {mensagem.tipo === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo 1: Identificação do Subsídio */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Nome do Subsídio *</label>
            <input
              type="text"
              placeholder="Ex: Subsídio de Alimentação, Transporte..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Campo 2: Dimensionamento de Percentagem */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Percentagem de Aplicação (%) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                <Percent size={14} />
              </span>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                step="any"
                value={percentagem}
                onChange={(e) => setPercentagem(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Campo 3: Situação de Atividade */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Estado de Vigência</label>
            <select
              value={ativo ? "1" : "0"}
              onChange={(e) => setAtivo(e.target.value === "1")}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="1">Subsídio Ativo e Disponível</option>
              <option value="0">Subsídio Suspenso / Inativo</option>
            </select>
          </div>

          {/* Bloco Unificado de Ações Operacionais */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isEditMode ? onCancelEdit : resetForm}
              disabled={salvando}
            >
              {isEditMode ? "Cancelar Edição" : "Limpar Ficha"}
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={salvando}
            >
              {salvando ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin shrink-0" />
                  Salvando dados...
                </span>
              ) : isEditMode ? (
                "Atualizar Subsídio"
              ) : (
                "Cadastrar Subsídio"
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}