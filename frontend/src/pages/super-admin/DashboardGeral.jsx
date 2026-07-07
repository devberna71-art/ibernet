import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function DashboardGeral() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSedes: 0,
    totalFiliais: 0,
    totalIgrejas: 0,
    totalMembros: 0,
    activeIgrejas: 0,
    suspendedIgrejas: 0,
    pendingIgrejas: 0,
    sedes: [],
  });

  const [adoptionRate, setAdoptionRate] = useState(87.5);
  const [recentAudits, setRecentAudits] = useState([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      const sedes = res.data || [];

      let totalSedes = sedes.length;
      let totalFiliais = 0;
      let totalMembros = 0;
      let activeIgrejas = 0;
      let suspendedIgrejas = 0;
      let pendingIgrejas = 0;

      sedes.forEach((s) => {
        // Sede stats
        totalMembros += s.quantidadeMembros || 0;
        if (s.status === "ativo") activeIgrejas++;
        else if (s.status === "bloqueado") suspendedIgrejas++;
        else pendingIgrejas++;

        // Filiais stats
        if (s.Filhals && s.Filhals.length > 0) {
          totalFiliais += s.Filhals.length;
          s.Filhals.forEach((f) => {
            totalMembros += f.quantidadeMembros || 0;
            if (f.status === "ativo") activeIgrejas++;
            else if (f.status === "bloqueado") suspendedIgrejas++;
            else pendingIgrejas++;
          });
        }
      });

      setData({
        totalSedes,
        totalFiliais,
        totalIgrejas: totalSedes + totalFiliais,
        totalMembros,
        activeIgrejas,
        suspendedIgrejas,
        pendingIgrejas,
        sedes,
      });

      // Mock recent audits for IAM & Security logs
      setRecentAudits([
        { id: 1, action: "Cadastro de Sede", details: "Sede 'Assembleia de Deus' cadastrada", user: "Super Admin", time: "Há 10 minutos" },
        { id: 2, action: "Bloqueio de Igreja", details: "Filial 'Belém' suspensa por inadimplência", user: "Super Admin", time: "Há 2 horas" },
        { id: 3, action: "Atualização de Plano", details: "Igreja Central alterada para Plano Premium", user: "Super Admin", time: "Há 1 dia" },
        { id: 4, action: "Backup do Sistema", details: "Backup completo concluído com sucesso", user: "Sistema", time: "Há 1 dia" },
      ]);

    } catch (err) {
      console.error("Erro ao carregar métricas do super admin:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-10 bg-slate-200 rounded-md w-1/4"></div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-md border border-slate-300"></div>
          ))}
        </div>

        {/* Rows Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-md border border-slate-300"></div>
          <div className="h-96 bg-slate-200 rounded-md border border-slate-300"></div>
        </div>
      </div>
    );
  }

  // Pending payments (mocked as it doesn't exist in backend)
  const pendingPayments = [
    { id: 1, church: "Assembleia Shalom", value: "35.000 Kz", plan: "Mensal Pro", daysOverdue: 5 },
    { id: 2, church: "Ministério Resgate", value: "120.000 Kz", plan: "Anual Básico", daysOverdue: 12 },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visão Geral da Plataforma</h2>
          <p className="text-slate-500 text-xs mt-0.5">Visão consolidada e métricas operacionais do Eclesia SaaS.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchMetrics}>
            <Activity size={14} className="mr-1.5" />
            Atualizar Dados
          </Button>
          <Button variant="primary" size="sm" as={Link} to="/super-admin/igrejas">
            Gerir Igrejas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-violet-300 transition-all duration-200 shadow-xs" padding="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total de Instituições</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.totalIgrejas}</h3>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="font-semibold text-slate-700">{data.totalSedes}</span> Sedes · 
                <span className="font-semibold text-slate-700">{data.totalFiliais}</span> Filiais
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <Building2 size={20} />
            </div>
          </div>
        </Card>

        <Card className="hover:border-blue-300 transition-all duration-200 shadow-xs" padding="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Membros Totais</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.totalMembros.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp size={10} className="text-emerald-500" />
                <span>Consumo de recursos ativo</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users size={20} />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-300 transition-all duration-200 shadow-xs" padding="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Igrejas Ativas</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.activeIgrejas}</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Taxa de Disponibilidade: <span className="font-semibold text-slate-700">100%</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle size={20} />
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-300 transition-all duration-200 shadow-xs" padding="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bloqueadas / Pendentes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.suspendedIgrejas} <span className="text-slate-400 font-normal text-lg">/</span> {data.pendingIgrejas}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Ações pendentes de suporte
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <AlertTriangle size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Charts and Pending Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Church Activity & Adoption */}
        <Card className="lg:col-span-2 shadow-xs" padding="p-6">
          <CardHeader 
            title="Consumo Geral e Distribuição" 
            subtitle="Membros ativos por Sede (SaaS Resources Consumption)" 
          />
          <div className="mt-4 space-y-4">
            {data.sedes.slice(0, 5).map((sede) => {
              // Calc percent relative to total members or max
              const maxMembros = Math.max(...data.sedes.map(s => s.quantidadeMembros || 1));
              const pct = maxMembros > 0 ? ((sede.quantidadeMembros || 0) / maxMembros) * 100 : 0;
              return (
                <div key={sede.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sede.nome}</span>
                    <span className="text-slate-500 font-medium">{sede.quantidadeMembros} membros</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-violet-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {data.sedes.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Nenhuma congregação Sede registrada.
              </div>
            )}
            {data.sedes.length > 5 && (
              <div className="text-right">
                <Link to="/super-admin/igrejas" className="text-xs font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center">
                  Ver todas as congregações <ArrowUpRight size={12} className="ml-0.5" />
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Right Card: Alerts and Pending Payments */}
        <Card className="shadow-xs" padding="p-6">
          <CardHeader 
            title="Pendências Financeiras" 
            subtitle="Alertas de pagamento expirado ou atrasado" 
          />
          <div className="mt-4 space-y-4">
            {pendingPayments.map((p) => (
              <div key={p.id} className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{p.church}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Plano: {p.plan}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-red-600 block">{p.value}</span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-red-500 bg-red-100/50 px-1.5 py-0.5 rounded-full mt-1">
                    <Clock size={8} />
                    {p.daysOverdue} dias
                  </span>
                </div>
              </div>
            ))}
            {pendingPayments.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Tudo em dia! Sem faturas pendentes.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Row 3: Audit Logs Preview */}
      <Card className="shadow-xs" padding="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-cardTitle text-slate-900">Logs de Auditoria Recentes</h3>
            <p className="text-slate-500 text-xs mt-0.5">Registro em tempo real das atividades críticas do sistema.</p>
          </div>
          <Link to="/super-admin/auditoria" className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-0.5">
            Ver logs completos <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5">Ação</th>
                <th className="py-2.5">Detalhes</th>
                <th className="py-2.5">Autor</th>
                <th className="py-2.5 text-right">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentAudits.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{log.action}</td>
                  <td className="py-3 text-slate-500">{log.details}</td>
                  <td className="py-3 font-medium">{log.user}</td>
                  <td className="py-3 text-right text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
