// src/components/FormDescontos.jsx
import React, { useEffect, useState } from "react";
import { Loader2, Percent, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../api/axiosConfig";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function FormDescontos({ editData, onFinish, onCancelEdit }) {
  const [nome, setNome] = useState("");
  const [percentagem, setPercentagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const isEditMode = !!editData;

  // Preencher campos em modo de edição
  useEffect(() => {
    if (editData) {
      setNome(editData.nome || "");
      setPercentagem(editData.percentagem || "");
      setDescricao(editData.descricao || "");
      setAtivo(editData.ativo);
    }
  }, [editData]);

  const resetForm = () => {
    setNome("");
    setPercentagem("");
    setDescricao("");
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
        descricao, 
        ativo 
      };

      if (isEditMode) {
        await api.put(`/descontos/${editData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem({
          tipo: "success",
          texto: "Desconto atualizado com sucesso!",
        });
      } else {
        await api.post("/descontos", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensagem({
          tipo: "success",
          texto: "Desconto cadastrado com sucesso!",
        });
      }

      resetForm();
      onFinish?.();

    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: error?.response?.data?.message || "Erro operacional ao salvar desconto.",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full text-left max-w-xl mx-auto">
      <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl bg-white">
        
        {/* Cabeçalho da Secção */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <Percent size={14} className="stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isEditMode ? "Modificar Dedução" : "Gestão de Descontos e Retenções"}
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
          
          {/* Campo 1: Identificação do Desconto */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Nome do Desconto *</label>
            <input
              type="text"
              placeholder="Ex: IRT, INSS, Faltas..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Campo 2: Taxa de Percentagem */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Taxa de Desconto (%) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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

          {/* Campo 3: Detalhes / Descrição */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Descrição / Motivo Justificativo</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <FileText size={14} />
              </span>
              <textarea
                placeholder="Indique a fundamentação legal ou normativa deste desconto..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Campo 4: Estado de Atividade */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Estado de Vigência</label>
            <select
              value={ativo ? "1" : "0"}
              onChange={(e) => setAtivo(e.target.value === "1")}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="1">Desconto Ativo e Aplicável</option>
              <option value="0">Desconto Inativo / Suspenso</option>
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
                  Aplicando retenção...
                </span>
              ) : isEditMode ? (
                "Atualizar Desconto"
              ) : (
                "Cadastrar Desconto"
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}