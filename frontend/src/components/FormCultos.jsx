import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, Users, Trash, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/axiosConfig";

// Importação do novo componente criado
import Resumo from "./Resumo";

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

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Buscar dados iniciais
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

  // Inicializar dados do culto para edição
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
      loading && setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] max-w-[1250px] mx-auto p-5 sm:p-5">
      {/* Cabeçalho Premium */}
      <div className="mb-5 border-b border-slate-100 pb-3">
        <h2 className={`font-extrabold text-slate-900 tracking-tight mb-1 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          {isEdit ? "Editar Detalhes do Culto" : "Novo Registro de Culto"}
        </h2>
        <p className="text-slate-500 font-normal">
          Gerencie e documente a frequência corporativa e os fluxos financeiros deste culto.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LADO ESQUERDO: Formulários de Preenchimento */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4">
              
              {/* Sessão 1: Informações Gerais */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="p-1 bg-slate-100 rounded-lg flex">
                      <Calendar size={16} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">
                      Dados Gerais Básicos
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Data e Hora</label>
                      <input
                        type="datetime-local"
                        className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                        value={formData.dataHora}
                        onChange={(e) => handleChange("dataHora", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Tipo de Culto</label>
                      <select
                        className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                        value={formData.tipoCultoId}
                        onChange={(e) => handleChange("tipoCultoId", e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {(tiposCulto || []).map((tipo) => (
                          <option key={tipo.id} value={tipo.id} className="py-1.5">
                            {tipo.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sessão 2: Frequência/Participantes */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="p-1 bg-slate-100 rounded-lg flex">
                      <Users size={16} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">
                      Frequência & Presença
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Homens</label>
                      <input
                        type="number"
                        className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                        value={formData.homens}
                        onChange={(e) => handleChange("homens", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Mulheres</label>
                      <input
                        type="number"
                        className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                        value={formData.mulheres}
                        onChange={(e) => handleChange("mulheres", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Crianças</label>
                      <input
                        type="number"
                        className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                        value={formData.criancas}
                        onChange={(e) => handleChange("criancas", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sessão 3: Finanças/Contribuições */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="p-1 bg-slate-100 rounded-lg flex">
                      <DollarSign size={16} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">
                      Gestão Financeira Avançada
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {(tiposContribuicao || []).map((tipo) => (
                      <div key={tipo.id} className="p-3 bg-gradient-to-r from-gray-50 to-white border border-slate-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-bold text-slate-900">{tipo.nome}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setModalTipoId(tipo.id);
                              setOpenModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            <PlusCircle size={16} />
                            Vincular Membro
                          </button>
                        </div>

                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Kz</span>
                          <input
                            type="number"
                            placeholder="Valor Geral / Colecta Anónima"
                            className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                            value={formData.contribuicoes[tipo.id] || ""}
                            onChange={(e) => handleContribuicaoChange(tipo.id, e.target.value)}
                          />
                        </div>

                        <div className="flex justify-between mt-2 px-1">
                          <span className="text-sm text-slate-500">Total Combinado:</span>
                          <span className="text-sm font-bold text-slate-900">
                            {getVisualTotal(tipo.id).toLocaleString()} Kz
                          </span>
                        </div>

                        {formData.membrosContribuicoes[tipo.id] &&
                          Object.keys(formData.membrosContribuicoes[tipo.id]).length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200">
                              {isMobile ? (
                                Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                  const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                  return (
                                    <div 
                                      key={membroId} 
                                      className="flex justify-between items-center bg-white p-1.5 my-1 rounded-xl border border-slate-200"
                                    >
                                      <div>
                                        <p className="text-sm font-semibold text-slate-600 capitalize">
                                          {membro?.nome || "Membro"}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">{valor} Kz</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash size={16} />
                                      </button>
                                    </div>
                                  );
                                })
                              ) : (
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-slate-100">
                                      <th className="text-left pb-2 pl-1 text-xs font-bold text-slate-500">MEMBRO IDENTIFICADO</th>
                                      <th className="text-left pb-2 text-xs font-bold text-slate-500">VALOR DECLARADO</th>
                                      <th className="text-right pb-2 pr-1"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(formData.membrosContribuicoes[tipo.id]).map(([membroId, valor]) => {
                                      const membro = (membros || []).find((m) => m.id === parseInt(membroId));
                                      return (
                                        <tr key={membroId} className="border-b border-slate-100 last:border-0">
                                          <td className="py-1.5 pl-1 capitalize text-slate-600 font-medium">
                                            {membro?.nome || "Membro"}
                                          </td>
                                          <td className="py-1.5 font-bold text-slate-900">
                                            {valor?.toLocaleString()} Kz
                                          </td>
                                          <td className="py-1.5 pr-1 text-right">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveMembroContribuicao(tipo.id, parseInt(membroId))}
                                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                              <Trash size={16} />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Componente Resumo Acoplado */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <Resumo 
                formData={formData} 
                tiposCulto={tiposCulto} 
                tiposContribuicao={tiposContribuicao} 
                membros={membros} 
              />
            </div>
          </div>

          {/* Botões de Ação do Formulário */}
          <div className={`lg:col-span-12 flex gap-2 mt-3 pt-4 border-t border-slate-100 ${isMobile ? 'flex-col-reverse' : 'flex-row justify-end'}`}>
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-1.6 rounded-xl font-bold text-slate-500 text-[0.95rem] hover:bg-slate-100 hover:text-slate-600 transition-colors ${isMobile ? 'w-full' : ''}`}
            >
              Cancelar Operação
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-1.6 rounded-xl font-bold bg-slate-900 text-white text-[0.95rem] shadow-[0_4px_12px_rgba(15,23,42,0.15)] hover:bg-slate-800 hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processando...
                </>
              ) : isEdit ? "Atualizar Registro" : "Finalizar e Lançar"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de Contribuição por Membro */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-xs p-4">
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight pb-1">
              Vincular Membro Ativo
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Selecione o membro na base de dados para atribuir um valor nominal específico.
            </p>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-500 mb-1">Procurar membro pelo nome...</label>
              <select
                className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                value={selectedMembro?.id || ""}
                onChange={(e) => {
                  const membro = (membros || []).find(m => m.id === parseInt(e.target.value));
                  setSelectedMembro(membro || null);
                }}
              >
                <option value="">Selecione um membro...</option>
                {(membros || []).map((membro) => (
                  <option key={membro.id} value={membro.id}>
                    {membro.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative mb-3">
              <label className="block text-sm font-medium text-slate-500 mb-1">Quantia do Contributo</label>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Kz</span>
              <input
                type="number"
                className="w-full bg-[#f9fbfd] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-slate-900 focus:border-[1.5px] transition-all duration-200 hover:border-slate-300"
                value={valorMembro}
                onChange={(e) => setValorMembro(e.target.value)}
              />
            </div>

            <div className="flex gap-1 mt-2 p-2">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-3 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleAddMembroContribuicao}
                className="px-3 py-2 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Confirmar Vínculo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}