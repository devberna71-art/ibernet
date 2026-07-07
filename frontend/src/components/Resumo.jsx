// src/components/Resumo.jsx
import React from "react";
import { ClipboardCheck, Users, DollarSign, Calendar, Landmark } from "lucide-react";
import Card from "./ui/Card";

export default function Resumo({ formData, tiposCulto, tiposContribuicao, membros }) {
  // Encontrar o nome do tipo de culto selecionado
  const cultoSelecionado = (tiposCulto || []).find(
    (t) => t.id === parseInt(formData.tipoCultoId)
  );

  // Calcular totais de pessoas
  const totalPessoas =
    (Number(formData.homens) || 0) +
    (Number(formData.mulheres) || 0) +
    (Number(formData.criancas) || 0);

  // Calcular o total geral financeiro de todas as contribuições combinadas
  let totalFinanceiroGeral = 0;

  // Processar as contribuições para acumular o total geral antes do render
  (tiposContribuicao || []).forEach((tipo) => {
    const valorGeral = Number(formData.contribuicoes[tipo.id]) || 0;
    const membrosObj = formData.membrosContribuicoes[tipo.id] || {};
    const totalMembros = Object.values(membrosObj).reduce((a, b) => a + Number(b), 0);
    totalFinanceiroGeral += (valorGeral + totalMembros);
  });

  return (
    <div className="w-full text-left space-y-4">

      {/* Cabeçalho do Resumo */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 rounded-md flex items-center justify-center text-white">
            <ClipboardCheck size={14} />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Resumo do Lançamento
          </h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full uppercase tracking-wider">
          Sincronizado
        </span>
      </div>

      {/* Bloco 1: Metadados da Sessão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-2.5">
          <Landmark size={16} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Identificação do Culto
            </span>
            <span className="text-sm font-bold text-slate-800 capitalize">
              {cultoSelecionado ? cultoSelecionado.nome : "Pendente..."}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cronologia
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {formData.dataHora
                ? new Date(formData.dataHora).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })
                : "Aguardando horário"}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-slate-200 my-2" />

      {/* Bloco 2: Frequência Inteligente */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Users size={12} />
          Auditoria de Presença
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <span className="text-xs font-bold text-slate-700">Quorum Total Presente</span>
          <span className="text-lg font-black text-slate-900 font-mono">{totalPessoas}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Homens", value: formData.homens },
            { label: "Mulheres", value: formData.mulheres },
            { label: "Crianças", value: formData.criancas }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-2 text-center bg-white border border-slate-100 rounded-lg shadow-sm"
            >
              <span className="block text-[10px] font-medium text-slate-400">{item.label}</span>
              <span className="text-sm font-bold text-slate-800">{item.value || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-200 my-2" />

      {/* Bloco 3: Finanças de Alta Performance */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <DollarSign size={12} />
          Lançamentos de Receita
        </div>

        <div className="space-y-2">
          {(tiposContribuicao || []).map((tipo) => {
            const valorGeral = Number(formData.contribuicoes[tipo.id]) || 0;
            const membrosObj = formData.membrosContribuicoes[tipo.id] || {};
            const totalMembros = Object.values(membrosObj).reduce((a, b) => a + Number(b), 0);
            const totalCategoria = valorGeral + totalMembros;

            if (totalCategoria === 0) return null;

            return (
              <div
                key={tipo.id}
                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700">{tipo.nome}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {valorGeral > 0 ? `Depósito Geral: ${valorGeral.toLocaleString("pt-AO")} Kz` : "Membros identificados"}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {totalCategoria.toLocaleString("pt-AO")} Kz
                </span>
              </div>
            );
          })}
        </div>

        {/* Card Matriz de Fechamento Monetário */}
        <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Balanço Consolidado
            </span>
            <span className="text-xs font-medium text-slate-300">
              Total geral arrecadado
            </span>
          </div>
          <span className="text-lg font-black text-white font-mono tracking-tight">
            {totalFinanceiroGeral.toLocaleString("pt-AO")} Kz
          </span>
        </div>
      </div>

    </div>
  );
}