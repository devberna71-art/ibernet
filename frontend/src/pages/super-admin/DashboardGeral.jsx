import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, Users, TrendingUp, Activity, ArrowUpRight,
  CheckCircle, AlertTriangle, Clock, RefreshCw,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Agora mesmo";
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)} h`;
  return `Há ${Math.floor(diff / 86400)} dia(s)`;
}

function derivePlan(membros) {
  if (membros >= 500) return { name: "Enterprise", color: "text-violet-600" };
  if (membros >= 50)  return { name: "Premium Pro", color: "text-blue-600" };
  return { name: "Básico", color: "text-slate-400" };
}

export default function DashboardGeral() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSedes: 0, totalFiliais: 0, totalIgrejas: 0,
    totalMembros: 0, activeIgrejas: 0, suspendedIgrejas: 0,
    pendingIgrejas: 0, sedes: [],
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => { fetchMetrics(); }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      const sedes = res.data || [];

      let totalSedes = sedes.length, totalFiliais = 0, totalMembros = 0;
      let activeIgrejas = 0, suspendedIgrejas = 0, pendingIgrejas = 0;
      const newAlerts = [], newAuditLogs = [];

      sedes.forEach((s) => {
        totalMembros += s.quantidadeMembros || 0;
        if (s.status === "ativo") activeIgrejas++;
        else if (s.status === "bloqueado") { suspendedIgrejas++; newAlerts.push({ id: `sede-${s.id}`, church: s.nome, tipo: "Sede", status: "bloqueado", updatedAt: s.updatedAt }); }
        else { pendingIgrejas++; newAlerts.push({ id: `sede-${s.id}`, church: s.nome, tipo: "Sede", status: "pendente", updatedAt: s.updatedAt }); }

        newAuditLogs.push({ id: `sede-${s.id}`, action: "Sede Registada", details: `"${s.nome}" cadastrada`, user: "Sistema", time: timeAgo(s.createdAt) });

        if (s.Filhals?.length > 0) {
          totalFiliais += s.Filhals.length;
          s.Filhals.forEach((f) => {
            totalMembros += f.quantidadeMembros || 0;
            if (f.status === "ativo") activeIgrejas++;
            else if (f.status === "bloqueado") { suspendedIgrejas++; newAlerts.push({ id: `filial-${f.id}`, church: f.nome, tipo: "Filial", status: "bloqueado", updatedAt: f.updatedAt }); }
            else pendingIgrejas++;
            newAuditLogs.push({ id: `filial-${f.id}`, action: "Filial Registada", details: `"${f.nome}" vinculada a "${s.nome}"`, user: "Sistema", time: timeAgo(f.createdAt) });
          });
        }
      });

      try {
        const ur = await api.get("/usuarios");
        const users = (ur.data?.usuarios || []).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,3);
        users.forEach(u => newAuditLogs.unshift({ id: `user-${u.id}`, action: "Utilizador Criado", details: `${u.nome} (${u.funcao})`, user: "Sistema", time: timeAgo(u.createdAt) }));
      } catch (_) {}

      setData({ totalSedes, totalFiliais, totalIgrejas: totalSedes+totalFiliais, totalMembros, activeIgrejas, suspendedIgrejas, pendingIgrejas, sedes });
      setAlerts(newAlerts.slice(0,5));
      setAuditLogs(newAuditLogs.slice(0,8));
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-md w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[1,2,3,4].map(i=><div key={i} className="h-28 bg-slate-200 rounded-md border border-slate-300"/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-md border border-slate-300"/>
        <div className="h-80 bg-slate-200 rounded-md border border-slate-300"/>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visão Geral da Plataforma</h2>
          <p className="text-slate-500 text-xs mt-0.5">Métricas operacionais em tempo real do Eclesia SaaS.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchMetrics}><RefreshCw size={14} className="mr-1.5"/>Atualizar</Button>
          <Button variant="primary" size="sm" as={Link} to="/super-admin/igrejas">Gerir Igrejas</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label:"Total de Instituições", value: data.totalIgrejas, sub: `${data.totalSedes} Sedes · ${data.totalFiliais} Filiais`, icon: Building2, color: "violet" },
          { label:"Membros Totais", value: data.totalMembros.toLocaleString("pt-PT"), sub: "Consumo de recursos ativo", icon: Users, color: "blue" },
          { label:"Igrejas Ativas", value: data.activeIgrejas, sub: data.totalIgrejas>0?`${Math.round(data.activeIgrejas/data.totalIgrejas*100)}% disponibilidade`:"—", icon: CheckCircle, color: "emerald" },
          { label:"Bloqueadas / Pendentes", value: `${data.suspendedIgrejas} / ${data.pendingIgrejas}`, sub: "Ações pendentes de suporte", icon: AlertTriangle, color: "amber" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className={`hover:border-${color}-300 transition-all duration-200 shadow-xs`} padding="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center border border-${color}-100`}>
                <Icon size={20}/>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xs" padding="p-6">
          <CardHeader title="Consumo Geral e Distribuição" subtitle="Membros ativos por Sede"/>
          <div className="mt-4 space-y-4">
            {data.sedes.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs">Nenhuma sede registada.</p>
            ) : data.sedes.slice(0,6).map((sede) => {
              const max = Math.max(...data.sedes.map(s=>s.quantidadeMembros||1),1);
              const pct = ((sede.quantidadeMembros||0)/max)*100;
              const plan = derivePlan(sede.quantidadeMembros||0);
              return (
                <div key={sede.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{sede.nome}</span>
                      <span className={`text-[10px] font-medium ${plan.color}`}>{plan.name}</span>
                    </div>
                    <span className="text-slate-500">{sede.quantidadeMembros||0} membros</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-600 h-full rounded-full transition-all duration-500" style={{width:`${Math.max(pct,3)}%`}}/>
                  </div>
                </div>
              );
            })}
            {data.sedes.length>6 && (
              <div className="text-right pt-1">
                <Link to="/super-admin/igrejas" className="text-xs font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center">
                  Ver todas <ArrowUpRight size={12} className="ml-0.5"/>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card className="shadow-xs" padding="p-6">
          <CardHeader title="Alertas Operacionais" subtitle="Bloqueadas ou com acesso pendente"/>
          <div className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle size={22} className="mx-auto mb-2 text-emerald-400"/>
                Tudo operacional!
              </div>
            ) : alerts.map(a => (
              <Link key={a.id} to="/super-admin/igrejas"
                className={`block p-3 rounded-lg border flex items-center justify-between gap-2 hover:opacity-80 transition-opacity ${a.status==="bloqueado"?"bg-red-50 border-red-100":"bg-amber-50 border-amber-100"}`}>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{a.church}</h4>
                  <p className="text-[10px] text-slate-500">{a.tipo}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold block ${a.status==="bloqueado"?"text-red-600":"text-amber-600"}`}>
                    {a.status==="bloqueado"?"Suspenso":"Pendente"}
                  </span>
                  <span className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5 justify-end">
                    <Clock size={8}/>{timeAgo(a.updatedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="shadow-xs" padding="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-cardTitle text-slate-900">Histórico de Actividade</h3>
            <p className="text-slate-500 text-xs mt-0.5">Eventos derivados dos registos reais da base de dados.</p>
          </div>
          <Link to="/super-admin/auditoria" className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-0.5">
            Ver IAM completo <ArrowUpRight size={14}/>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5">Evento</th><th className="py-2.5">Detalhes</th>
                <th className="py-2.5">Autor</th><th className="py-2.5 text-right">Tempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.length===0 ? (
                <tr><td colSpan="4" className="py-10 text-center text-slate-400">Sem registos disponíveis.</td></tr>
              ) : auditLogs.map(log => (
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
