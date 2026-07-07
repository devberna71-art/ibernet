// src/components/FormSalario.jsx
import React, { useEffect, useState, useMemo } from "react";
import { 
  Loader2, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  User, 
  Calendar,
  CheckCircle2, 
  X,
  AlertCircle
} from "lucide-react";
import api from "../api/axiosConfig";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function FormSalario({ salarioEditando = null, onSalvo = () => {} }) {
  const modoEdicao = !!salarioEditando;

  const [funcionarios, setFuncionarios] = useState([]);
  const [subsidios, setSubsidios] = useState([]);
  const [descontos, setDescontos] = useState([]);

  const [FuncionarioId, setFuncionarioId] = useState("");
  const [mesAno, setMesAno] = useState("");

  const [subsidiosSelecionados, setSubsidiosSelecionados] = useState([]);
  const [descontosSelecionados, setDescontosSelecionados] = useState([]);

  const [salarioBase, setSalarioBase] = useState(0);

  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [erroOperacional, setErroOperacional] = useState("");

  // Carregamento inicial de tabelas base
  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      try {
        setCarregando(true);
        const [f, s, d] = await Promise.all([
          api.get("/funcionarios", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/subsidios", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/descontos", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setFuncionarios(f.data || []);
        setSubsidios(s.data || []);
        setDescontos(d.data || []);
      } catch (err) {
        console.error(err);
        setErroOperacional("Falha ao sincronizar tabelas de remuneração.");
      } finally {
        setCarregando(false);
      }
    };

    load();
  }, []);

  // Mapas de percentagem otimizados com useMemo
  const subsidioMap = useMemo(() => {
    const map = {};
    subsidios.forEach((s) => (map[s.id] = Number(s.percentagem || 0)));
    return map;
  }, [subsidios]);

  const descontoMap = useMemo(() => {
    const map = {};
    descontos.forEach((d) => (map[d.id] = Number(d.percentagem || 0)));
    return map;
  }, [descontos]);

  const handleFuncionarioChange = (e) => {
    const id = e.target.value;
    const f = funcionarios.find((x) => String(x.id) === String(id));
    setFuncionarioId(id);
    setSalarioBase(Number(f?.salario_base || 0));
  };

  // Cálculos dinâmicos em tempo real
  const totalSubs = useMemo(() => {
    return subsidiosSelecionados.reduce((acc, id) => {
      const percent = subsidioMap[id] || 0;
      return acc + (salarioBase * percent) / 100;
    }, 0);
  }, [subsidiosSelecionados, salarioBase, subsidioMap]);

  const totalDesc = useMemo(() => {
    return descontosSelecionados.reduce((acc, id) => {
      const percent = descontoMap[id] || 0;
      return acc + (salarioBase * percent) / 100;
    }, 0);
  }, [descontosSelecionados, salarioBase, descontoMap]);

  const liquido = salarioBase + totalSubs - totalDesc;

  // Lógica multiselect customizada nativa
  const handleToggleSubsidio = (id) => {
    const numId = Number(id);
    setSubsidiosSelecionados((prev) =>
      prev.includes(numId) ? prev.filter((x) => x !== numId) : [...prev, numId]
    );
  };

  const handleToggleDesconto = (id) => {
    const numId = Number(id);
    setDescontosSelecionados((prev) =>
      prev.includes(numId) ? prev.filter((x) => x !== numId) : [...prev, numId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FuncionarioId || !mesAno) {
      setErroOperacional("Preencha o funcionário e competência mensal.");
      return;
    }

    setSalvando(true);
    setErroOperacional("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        FuncionarioId: Number(FuncionarioId),
        mes_ano: mesAno,
        subsidiosAplicados: subsidiosSelecionados,
        descontosAplicados: descontosSelecionados,
      };

      if (modoEdicao) {
        await api.put(`/salarios/${salarioEditando.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/salarios`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowSucesso(true);
      onSalvo();
    } catch (err) {
      console.error(err);
      setErroOperacional(err.response?.data?.message || "Erro operacional no cálculo salarial.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-full text-left max-w-4xl mx-auto space-y-5">
      
      {/* Mensagem Instantânea de Erro */}
      {erroOperacional && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-xs border bg-rose-50 border-rose-100 text-rose-700">
          <AlertCircle size={14} />
          {erroOperacional}
        </div>
      )}

      {/* Alerta de Sucesso Embutido */}
      {showSucesso && (
        <div className="flex items-center justify-between gap-2 rounded-lg px-4 py-3 font-semibold text-xs border bg-emerald-50 border-emerald-100 text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Processamento executado com sucesso e lançado em folha.</span>
          </div>
          <button onClick={() => setShowSucesso(false)} className="hover:opacity-75 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl bg-white">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <DollarSign size={14} />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Processamento de Folha Salarial
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Competência Contábil
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Grid Geral de Inputs Físicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Campo 1: Período/Mês */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Mês / Ano de Referência *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar size={14} />
                </span>
                <input
                  type="month"
                  value={mesAno}
                  onChange={(e) => setMesAno(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Campo 2: Colaborador */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Colaborador Destinatário *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={14} />
                </span>
                <select
                  value={FuncionarioId}
                  onChange={handleFuncionarioChange}
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                >
                  <option value="">Selecione o funcionário...</option>
                  {funcionarios.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.Membro?.nome || `Matrícula #${f.id}`} — (Base: {Number(f.salario_base).toFixed(2)} Kz)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Secção de Seleção Múltipla Avançada NATIVA (Abas Verticais de Checkboxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Bloco de Subsídios */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Bonificações & Subsídios
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {subsidios.map((s) => {
                  const percent = subsidioMap[s.id] || 0;
                  const valor = (salarioBase * percent) / 100;
                  return (
                    <label key={s.id} className="flex items-start p-2 border border-slate-200/60 rounded-lg bg-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={subsidiosSelecionados.includes(s.id)}
                        onChange={() => handleToggleSubsidio(s.id)}
                        className="h-4 w-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <div className="ml-2">
                        <p className="text-xs font-semibold text-slate-700">{s.nome}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">+{percent}% (+{valor.toFixed(2)} Kz)</p>
                      </div>
                    </label>
                  );
                })}
                {subsidios.length === 0 && (
                  <p className="text-xs text-slate-400 font-medium py-2">Nenhum subsídio catalogado.</p>
                )}
              </div>
            </div>

            {/* Bloco de Descontos */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Retenções & Descontos
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {descontos.map((d) => {
                  const percent = descontoMap[d.id] || 0;
                  const valor = (salarioBase * percent) / 100;
                  return (
                    <label key={d.id} className="flex items-start p-2 border border-slate-200/60 rounded-lg bg-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={descontosSelecionados.includes(d.id)}
                        onChange={() => handleToggleDesconto(d.id)}
                        className="h-4 w-4 mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500/20"
                      />
                      <div className="ml-2">
                        <p className="text-xs font-semibold text-slate-700">{d.nome}</p>
                        <p className="text-[10px] text-rose-600 font-medium">-{percent}% (-{valor.toFixed(2)} Kz)</p>
                      </div>
                    </label>
                  );
                })}
                {descontos.length === 0 && (
                  <p className="text-xs text-slate-400 font-medium py-2">Nenhum desconto catalogado.</p>
                )}
              </div>
            </div>
          </div>

          {/* Painel de Resumos e Métricas de Fechamento */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Demonstrativo Sintético
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard title="Salário Base" value={salarioBase} icon={<Wallet size={14} />} />
              <SummaryCard title="Total Subsídios" value={totalSubs} icon={<TrendingUp size={14} />} status="success" />
              <SummaryCard title="Total Descontos" value={totalDesc} icon={<TrendingDown size={14} />} status="danger" />
              <SummaryCard title="Líquido a Receber" value={liquido} icon={<DollarSign size={14} />} status="highlight" />
            </div>
          </div>

          {/* Ações Finais */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-200">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={salvando}
              className="w-full md:w-auto md:px-6"
            >
              {salvando ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin shrink-0" />
                  Calculando Folha...
                </span>
              ) : (
                "Homologar Salário"
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}

// Subcomponente de Cartões Analíticos Internos
function SummaryCard({ title, value, icon, status }) {
  let cardStyles = "bg-white border-slate-200 text-slate-800";
  let titleStyles = "text-slate-400";
  let iconStyles = "text-slate-400";

  if (status === "highlight") {
    cardStyles = "bg-slate-900 border-slate-900 text-white";
    titleStyles = "text-slate-400";
    iconStyles = "text-white";
  } else if (status === "success") {
    cardStyles = "bg-emerald-50/40 border-emerald-100 text-emerald-900";
    titleStyles = "text-emerald-600/80";
    iconStyles = "text-emerald-500";
  } else if (status === "danger") {
    cardStyles = "bg-rose-50/40 border-rose-100 text-rose-900";
    titleStyles = "text-rose-600/80";
    iconStyles = "text-rose-500";
  }

  return (
    <div className={`p-3.5 border rounded-xl flex flex-col justify-between gap-3 shadow-sm ${cardStyles}`}>
      <div className="flex items-center justify-between w-full">
        <span className={`text-[10px] font-bold tracking-wider uppercase ${titleStyles}`}>
          {title}
        </span>
        <div className={iconStyles}>{icon}</div>
      </div>
      <p className="text-sm font-black tracking-tight whitespace-nowrap">
        {Number(value).toFixed(2)} Kz
      </p>
    </div>
  );
}