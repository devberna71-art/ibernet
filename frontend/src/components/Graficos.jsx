import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

// Importações do Recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// Importações do Lucide icons
import { TrendingUp, CircleDollarSign, Users, BarChart3 } from "lucide-react";

const CoresDonut = ["#D97A4D", "#5C8A5C", "#8B8378", "#B5332C", "#C4A882", "#A66B47"];

export default function Graficos() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("6m");

  async function carregarGraficos(periodoSelecionado = periodo) {
    try {
      setLoading(true);
      const response = await api.get(`/graficos?periodo=${periodoSelecionado}`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados dos gráficos:", error);
      setDados(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarGraficos();
  }, []);

  const handlePeriodo = async (e) => {
    const novoPeriodo = e.target.value;
    setPeriodo(novoPeriodo);
    carregarGraficos(novoPeriodo);
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#D97A4D] border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const ultimosMeses = dados?.financeiro?.ultimosMeses || [];
  const tiposContribuicao = dados?.financeiro?.tiposContribuicao || [];
  const faixasEtarias = dados?.faixasEtarias || {};

  const totalContribuicoes = tiposContribuicao.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const temDadosLinha = ultimosMeses.length > 0;
  const temDadosDonut = tiposContribuicao.length > 0 && totalContribuicoes > 0;
  const temDadosBarra = Object.keys(faixasEtarias).length > 0;

  // Formatação dos dados de faixas etárias de Objeto para Array (exigido pelo Recharts)
  const dadosBarraFormatados = Object.keys(faixasEtarias).map((chave) => ({
    faixa: chave,
    Membros: faixasEtarias[chave],
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      
      {/* CARD 1: GRÁFICO DE ÁREA (RESUMO FINANCEIRO) */}
      <div className="col-span-1 xl:col-span-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] p-5 sm:p-6 md:p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.04),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D97A4D] to-[#A66B47] shadow-[0_8px_16px_-4px_rgba(79,70,229,0.4)]">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[1.15rem] font-extrabold text-[#211D19] font-['Inter']">
                  Resumo Financeiro
                </h3>
                <p className="text-[#8B8378] text-[0.82rem] font-medium">
                  Evolução das contribuições ao longo do tempo
                </p>
              </div>
            </div>

            <select
              value={periodo}
              onChange={handlePeriodo}
              className="w-full sm:w-40 h-10 rounded-xl bg-[#f8fafc] font-semibold text-[0.85rem] text-[#334155] border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#D97A4D] focus:border-transparent cursor-pointer"
            >
              <option value="30d">Últimos 30 dias</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="1a">Último 1 ano</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            {temDadosLinha ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ultimosMeses} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97A4D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D97A4D" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="mes" stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} style={{ fontWeight: 600 }} />
                  <YAxis stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip 
                    formatter={(val) => [`${Number(val).toLocaleString()} Kz`, "Contribuições"]}
                    contentStyle={{ fontFamily: '"Inter", sans-serif', borderRadius: '8px', borderColor: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#D97A4D" strokeWidth={4} fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-[#94a3b8] gap-6 font-['Inter']">
                <TrendingUp className="w-10 h-10 opacity-40" />
                <p className="text-[0.85rem] font-medium">Nenhum fluxo financeiro registrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2: GRÁFICO DONUT (CATEGORIAS) */}
      <div className="col-span-1 xl:col-span-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] p-5 sm:p-6 md:p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.04),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
          <div className="flex flex-row gap-2 items-center mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#5C8A5C] to-[#D97A4D] shadow-[0_8px_16px_-4px_rgba(6,182,212,0.4)]">
              <CircleDollarSign className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[1.15rem] font-extrabold text-[#211D19] font-['Inter']">
                Contribuições
              </h3>
              <p className="text-[#8B8378] text-[0.82rem] font-medium">
                Divisão proporcional por categoria
              </p>
            </div>
          </div>

          <div className="h-[350px] w-full flex items-center justify-center">
            {temDadosDonut ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tiposContribuicao}
                    dataKey="valor"
                    nameKey="nome"
                    cx="50%"
                    cy="45%"
                    innerRadius="68%"
                    outerRadius="85%"
                    paddingAngle={4}
                  >
                    {tiposContribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CoresDonut[index % CoresDonut.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(val) => `${Number(val).toLocaleString()} Kz`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: '"Inter", sans-serif' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-[#94a3b8] gap-6 font-['Inter']">
                <CircleDollarSign className="w-10 h-10 opacity-40" />
                <p className="text-[0.85rem] font-medium">Sem dados disponíveis.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3: GRÁFICO DE BARRAS (FAIXA ETÁRIA) */}
      <div className="col-span-1 xl:col-span-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] p-5 sm:p-6 md:p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.04),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
          <div className="flex flex-row gap-2 items-center mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#C4A882] to-[#D97A4D] shadow-[0_8px_16px_-4px_rgba(139,92,246,0.4)]">
              <Users className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[1.15rem] font-extrabold text-[#211D19] font-['Inter']">
                Demografia de Membros
              </h3>
              <p className="text-[#8B8378] text-[0.82rem] font-medium">
                Distribuição volumétrica por faixas etárias
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {temDadosBarra ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarraFormatados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="faixa" stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} style={{ fontWeight: 600 }} />
                  <YAxis stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip contentStyle={{ fontFamily: '"Inter", sans-serif', borderRadius: '8px', borderColor: '#e2e8f0' }} />
                  <Bar dataKey="Membros" fill="#D97A4D" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-[#94a3b8] gap-6 font-['Inter']">
                <BarChart3 className="w-10 h-10 opacity-40" />
                <p className="text-[0.85rem] font-medium">Nenhum dado demográfico indexado.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}