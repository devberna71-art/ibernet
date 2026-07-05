import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
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
import { TrendingUp, CircleDollarSign, Users, BarChart3, Loader2 } from "lucide-react";
import Card, { CardHeader } from "./ui/Card";

const CHART_COLORS = ["#2563EB", "#16A34A", "#475569", "#D97706", "#EF4444", "#94A3B8"];
const GRID_STROKE = "#F1F5F9";
const AXIS_STROKE = "#94A3B8";
const TOOLTIP_STYLE = {
  fontFamily: '"Inter", sans-serif',
  borderRadius: "8px",
  borderColor: "#E2E8F0",
};

function ChartCard({ icon: Icon, title, subtitle, children, className = "" }) {
  return (
    <Card className={`flex flex-col ${className}`} padding="p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-primarySoft text-primary">
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-cardTitle font-semibold text-text">{title}</h3>
            {subtitle && (
              <p className="text-muted text-textMuted mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
}

function EmptyChart({ icon: Icon, message }) {
  return (
    <div className="h-[350px] flex flex-col items-center justify-center text-textMuted gap-4">
      <Icon size={40} strokeWidth={1.5} className="opacity-40" />
      <p className="text-muted font-medium">{message}</p>
    </div>
  );
}

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

  const handlePeriodo = (e) => {
    const novoPeriodo = e.target.value;
    setPeriodo(novoPeriodo);
    carregarGraficos(novoPeriodo);
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 size={28} strokeWidth={1.75} className="text-primary animate-spin" />
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

  const dadosBarraFormatados = Object.keys(faixasEtarias).map((chave) => ({
    faixa: chave,
    Membros: faixasEtarias[chave],
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="col-span-1 xl:col-span-8">
        <ChartCard
          icon={TrendingUp}
          title="Resumo Financeiro"
          subtitle="Evolução das contribuições ao longo do tempo"
        >
          <div className="flex justify-end mb-4">
            <select
              value={periodo}
              onChange={handlePeriodo}
              className="w-full sm:w-40 h-9 rounded-sm bg-bgSection font-semibold text-sm text-textSecondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer px-3"
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
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="mes" stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip
                    formatter={(val) => [`${Number(val).toLocaleString()} Kz`, "Contribuições"]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart icon={TrendingUp} message="Nenhum fluxo financeiro registrado." />
            )}
          </div>
        </ChartCard>
      </div>

      <div className="col-span-1 xl:col-span-4">
        <ChartCard
          icon={CircleDollarSign}
          title="Contribuições"
          subtitle="Divisão proporcional por categoria"
        >
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
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(val) => `${Number(val).toLocaleString()} Kz`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", fontFamily: '"Inter", sans-serif' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart icon={CircleDollarSign} message="Sem dados disponíveis." />
            )}
          </div>
        </ChartCard>
      </div>

      <div className="col-span-1 xl:col-span-12">
        <ChartCard
          icon={Users}
          title="Demografia de Membros"
          subtitle="Distribuição por faixas etárias"
        >
          <div className="h-[300px] w-full">
            {temDadosBarra ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarraFormatados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="6 6" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="faixa" stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="Membros" fill="#2563EB" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart icon={BarChart3} message="Nenhum dado demográfico indexado." />
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
