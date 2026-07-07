// src/components/FormCultos.jsx
import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, Users, Trash, PlusCircle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import Resumo from "./Resumo";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function FormCultos({ culto, onSuccess, onCancel }) {
  const [isMobile, setIsMobile] = useState(false);

  const [tiposCulto, setTiposCulto] = useState([]);
  const [tiposContribuicao, setTiposContribuicao] = useState([]);
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dataHora: "",
    tipoCultoId: "",
    contribuicoes: {},
    membrosContribuicoes: {},
    homens: "",
    mulheres: "",
    criancas: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalTipoId, setModalTipoId] = useState(null);
  const [selectedMembro, setSelectedMembro] = useState(null);
  const [valorMembro, setValorMembro] = useState("");

  const isEdit = Boolean(culto?.id);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 640;
    const handleResize = () => setIsMobile(checkMobile());
    setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [tiposRes, contribRes, membrosRes] = await Promise.all([
          api.get("/lista/tipos-culto"),
          api.get("/lista/tipos-contribuicao"),
          api.get("/membros"),
        ]);

        const dadosTiposCulto = Array.isArray(tiposRes.data) ? tiposRes.data : (tiposRes.data?.dados || tiposRes.data?.tipos || []);
        const dadosTiposContrib = Array.isArray(contribRes.data) ? contribRes.data : (contribRes.data?.dados || contribRes.data?.tipos || []);
        const dadosMembros = Array.isArray(membrosRes.data) ? membrosRes.data : (membrosRes.data?.membros || []);

        setTiposCulto(dadosTiposCulto);
        setTiposContribuicao(dadosTiposContrib);
        setMembros(dadosMembros);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados iniciais do servidor.");
      }
    })();
  }, []);

  useEffect(() => {
    if (culto) {
      const contribGeral = {};
      const contribPorMembro = {};

      (culto.contribuicoes || []).forEach((c) => {
        const tipoId = c.tipoId;
        const valor = Number(c.valor);

        if (c.membroId) {
          if (!contribPorMembro[tipoId]) contribPorMembro[tipoId] = {};
          contribPorMembro[tipoId][c.membroId] = valor;
        } else {
          contribGeral[tipoId] = (contribGeral[tipoId] || 0) + valor;
        }
      });

      setFormData({
        dataHora: culto.dataHora ? culto.dataHora.slice(0, 16) : "",
        tipoCultoId: culto.tipoCultoId || "",
        homens: culto.homens || "",
        mulheres: culto.mulheres || "",
        criancas: culto.criancas || "",
        contribuicoes: contribGeral,
        membrosContribuicoes: contribPorMembro,
      });
    }
  }, [culto]);

  const handleRemoveMembroContribuicao = async (tipoId, membroId) => {
    setFormData((prev) => {
      const copia = { ...prev.membrosContribuicoes };
      if (copia[tipoId]) {
        delete copia[tipoId][membroId];
        return { ...prev, membrosContribuicoes: copia };
      }
      return prev;
    });

    if (isEdit) {
      try {
        await api.delete(`/detalhes-cultos/${culto.id}/contribuicao`, {
          data: { tipoId, membroId },
        });
        toast.success("Contribuição de membro removida com sucesso!");
      } catch (error) {
        console.error("Erro ao remover contribuição:", error);
        toast.error("Não foi possível remover a contribuição no servidor.");
      }
    } else {
      toast.info("Membro removido da lista local.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContribuicaoChange = (id, valor) => {
    setFormData((prev) => ({
      ...prev,
      contribuicoes: { ...prev.contribuicoes, [id]: valor },
    }));
  };

  const handleAddMembroContribuicao = () => {
    if (!modalTipoId || !selectedMembro || !valorMembro) {
      toast.warning("Preencha todos os campos do membro.");
      return;
    }

    const valorNum = Number(valorMembro);

    setFormData((prev) => {
      const novosMembros = {
        ...(prev.membrosContribuicoes[modalTipoId] || {}),
        [selectedMembro.id]: valorNum,
      };

      return {
        ...prev,
        membrosContribuicoes: {
          ...prev.membrosContribuicoes,
          [modalTipoId]: novosMembros,
        },
      };
    });

    toast.success(`Adicionado: ${selectedMembro.nome}`);
    setSelectedMembro(null);
    setValorMembro("");
    setModalTipoId(null);
    setOpenModal(false);
  };

  const getVisualTotal = (tipoId) => {
    const valorGeral = Number(formData.contribuicoes[tipoId]) || 0;
    const membrosObj = formData.membrosContribuicoes[tipoId] || {};
    const totalMembros = Object.values(membrosObj).reduce((a, b) => a + Number(b), 0);
    return valorGeral + totalMembros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataHora || !formData.tipoCultoId) {
      toast.error("Por favor, preencha a Data/Hora e o Tipo de Culto.");
      return;
    }

    setLoading(true);

    try {
      const contribArray = [];

      Object.entries(formData.contribuicoes).forEach(([tipoId, valor]) => {
        const valNum = parseFloat(valor);
        if (valNum && valNum > 0) {
          contribArray.push({
            tipoId: parseInt(tipoId),
            valor: valNum,
            membroId: null,
          });
        }
      });

      Object.entries(formData.membrosContribuicoes).forEach(([tipoId, membrosObj]) => {
        Object.entries(membrosObj).forEach(([membroId, valor]) => {
          const valNum = parseFloat(valor);
          if (valNum && valNum > 0) {
            contribArray.push({
              tipoId: parseInt(tipoId),
              membroId: parseInt(membroId),
              valor: valNum,
            });
          }
        });
      });

      const payload = {
        dataHora: formData.dataHora,
        tipoCultoId: formData.tipoCultoId,
        homens: formData.homens || 0,
        mulheres: formData.mulheres || 0,
        criancas: formData.criancas || 0,
        contribuicoes: contribArray,
      };

      if (isEdit) {
        await api.put(`/detalhes-cultos/${culto.id}`, payload);
        toast.success("Culto atualizado com sucesso! 🎉");
      } else {
        await api.post("/detalhes-cultos", payload);
        toast.success("Culto registrado com sucesso! 🎉");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar culto:", error);
      toast.error("Erro ao salvar os dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Secção 1: Dados Gerais */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dados Gerais Básicos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Data e Hora</label>
              <input
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => handleChange("dataHora", e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Tipo de Culto</label>
              <select
                value={formData.tipoCultoId}
                onChange={(e) => handleChange("tipoCultoId", e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                {(tiposCulto || []).map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Secção 2: Frequência */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Frequência & Presença</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Homens</label>
              <input
                type="number"
                placeholder="0"
                value={formData.homens}
                onChange={(e) => handleChange("homens", e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Mulheres</label>
              <input
                type="number"
                placeholder="0"
                value={formData.mulheres}
                onChange={(e) => handleChange("mulheres", e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Crianças</label>
              <input
                type="number"
                placeholder="0"
                value={formData.criancas}
                onChange={(e) => handleChange("criancas", e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </Card>

        

        {/* Secção 4: Resumo Acoplado (Abaixo dos cards para não espremer) */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl bg-slate-50/30">
          <Resumo
            formData={formData}
            tiposCulto={tiposCulto}
            tiposContribuicao={tiposContribuicao}
            membros={membros}
          />
        </Card>

        {/* Ações Finais do Formulário */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
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
                <Loader2 size={14} className="animate-spin shrink-0" />
                Processando...
              </>
            ) : isEdit ? "Atualizar Registro" : "Finalizar e Lançar"}
          </Button>
        </div>
      </form>

      {/* Modal Interno de Contribuição de Membro */}
      {openModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpenModal(false)} />
          <div className="relative bg-white rounded-xl border border-slate-200 w-full max-w-sm shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
              <h3 className="text-sm font-semibold text-slate-800">Vincular Membro</h3>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Procurar membro pelo nome</label>
                <select
                  value={selectedMembro?.id || ""}
                  onChange={(e) => {
                    const membro = (membros || []).find(m => m.id === parseInt(e.target.value));
                    setSelectedMembro(membro || null);
                  }}
                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Selecione um membro...</option>
                  {(membros || []).map((membro) => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Quantia do Contributo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">Kz</span>
                  <input
                    type="number"
                    value={valorMembro}
                    onChange={(e) => setValorMembro(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50/50">
              <Button variant="ghost" size="sm" onClick={() => setOpenModal(false)}>
                Voltar
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddMembroContribuicao}>
                Confirmar Vínculo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}