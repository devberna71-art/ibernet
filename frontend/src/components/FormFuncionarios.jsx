// src/pages/GestaoFuncionarios.jsx
import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck, UserCheck, AlertCircle, CheckCircle2, X } from "lucide-react";
import api from "../api/axiosConfig";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function GestaoFuncionarios({
  funcionarioSelecionado = null,
  onSucesso = () => {},
  onCancelar = () => {},
}) {
  const [membros, setMembros] = useState([]);
  const [membroId, setMembroId] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const [searchMembro, setSearchMembro] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const modoEdicao = !!funcionarioSelecionado;

  // Carregar lista de membros cadastrados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const resMembros = await api.get("/membros", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dadosMembros = Array.isArray(resMembros.data) 
          ? resMembros.data 
          : (resMembros.data?.membros || resMembros.data?.dados || []);

        setMembros(dadosMembros);
      } catch (error) {
        setMensagem({ tipo: "error", texto: "Erro ao carregar lista de membros do servidor." });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Preencher dados ao entrar em Modo de Edição
  useEffect(() => {
    if (funcionarioSelecionado) {
      setMembroId(funcionarioSelecionado.MembroId || "");
      setSalarioBase(funcionarioSelecionado.salario_base || "");
      setAtivo(funcionarioSelecionado.ativo);
      
      const membroCorrespondente = membros.find(m => m.id === funcionarioSelecionado.MembroId);
      if (membroCorrespondente) {
        setSearchMembro(membroCorrespondente.nome);
      }
    }
  }, [funcionarioSelecionado, membros]);

  const resetForm = () => {
    setSalarioBase("");
    setMembroId("");
    setSearchMembro("");
    setAtivo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membroId) {
      setMensagem({ tipo: "error", texto: "Por favor, selecione um membro válido da lista." });
      return;
    }

    try {
      setSalvando(true);
      setMensagem({ tipo: "", texto: "" });

      const token = localStorage.getItem("token");
      const payload = {
        salario_base: Number(salarioBase),
        ativo,
        MembroId: Number(membroId),
      };

      if (modoEdicao) {
        await api.put(`/funcionarios/${funcionarioSelecionado.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem({ tipo: "success", texto: "Colaborador atualizado com sucesso!" });
      } else {
        await api.post("/funcionarios", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem({ tipo: "success", texto: "Colaborador cadastrado com sucesso!" });
        resetForm();
      }

      onSucesso();
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: error?.response?.data?.message || "Erro operacional ao salvar funcionário.",
      });
    } finally {
      setSalvando(false);
    }
  };

  // Filtragem local para o Autocomplete customizado
  const membrosFiltrados = membros.filter((m) =>
    (m.nome || "").toLowerCase().includes(searchMembro.toLowerCase())
  );

  return (
    <div className="w-full text-left max-w-xl mx-auto">
      <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl bg-white">
        
        {/* Cabeçalho da Secção */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-md flex items-center justify-center text-white">
              {modoEdicao ? <UserCheck size={14} /> : <ShieldCheck size={14} />}
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {modoEdicao ? "Atualização de Colaborador" : "Ficha Corporativa de Funcionário"}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Painel RH
          </span>
        </div>

        {/* Alertas Operacionais */}
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

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo 1: Selecionar Membro (Autocomplete Customizado) */}
            <div className="space-y-1 relative">
              <label className="text-xs font-medium text-slate-400">Vincular Membro Cadastrado *</label>
              <input
                type="text"
                placeholder="Pesquise o nome do membro..."
                value={searchMembro}
                onChange={(e) => {
                  setSearchMembro(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                disabled={modoEdicao}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                required
              />
              {dropdownOpen && !modoEdicao && searchMembro && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {membrosFiltrados.length > 0 ? (
                    membrosFiltrados.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMembroId(m.id);
                          setSearchMembro(m.nome);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 font-medium text-slate-700 capitalize transition-colors"
                      >
                        {m.nome}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 font-medium">Nenhum membro localizado</div>
                  )}
                </div>
              )}
            </div>

            {/* Campo 2: Salário Base */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Salário Base Mensal *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">Kz</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Campo 3: Situação / Status Administrativo */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Estado Administrativo</label>
              <select
                value={ativo ? "1" : "0"}
                onChange={(e) => setAtivo(e.target.value === "1")}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="1">Colaborador Ativo no Quadro</option>
                <option value="0">Colaborador Inativo / Afastado</option>
              </select>
            </div>

            {/* Ações do Formulário Corporativo */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={modoEdicao ? onCancelar : resetForm}
                disabled={salvando}
              >
                {modoEdicao ? "Cancelar" : "Limpar Ficha"}
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
                    Processando...
                  </span>
                ) : modoEdicao ? (
                  "Atualizar Registro"
                ) : (
                  "Admitir Funcionário"
                )}
              </Button>
            </div>

          </form>
        )}
      </Card>
      
      {/* Fechamento automático de dropdown ao clicar fora */}
      {dropdownOpen && <div className="fixed inset-0 z-40 transparent" onClick={() => setDropdownOpen(false)} />}
    </div>
  );
}