import React from "react";
import {
  Users,
  UserPlus,
  Wallet,
  Receipt,
  Landmark,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "./ui/Card";

const calculateGrowth = (atual, anterior) => {
  const c = Number(atual || 0);
  const p = Number(anterior || 0);
  if (p <= 0 && c > 0) return { value: 100, positive: true };
  if (p <= 0) return { value: 0, positive: true };
  const growth = ((c - p) / p) * 100;
  return { value: Math.abs(Number(growth).toFixed(1)), positive: growth >= 0 };
};

function StatCard({ icon: Icon, title, value, growth, positive, accent = "primary", fullWidth = false }) {
  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-primarySoft text-primary">
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <p className="text-muted font-semibold uppercase tracking-wide text-textMuted">{title}</p>
        </div>
        <div
          className={[
            "flex items-center gap-1 px-2 py-1 rounded-sm text-[12px] font-semibold",
            positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
          ].join(" ")}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {growth}%
        </div>
      </div>
      <p
        className={[
          "font-bold text-text leading-none",
          fullWidth ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
          accent === "danger" ? "text-danger" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </Card>
  );
}

export default function DashboardCards({ dados }) {
  const totalMembros = Number(dados?.membros?.total || 0);
  const membrosAnterior = Number(dados?.membros?.mesAnterior || 0);
  const novosMembros = Number(dados?.novosMembrosMes || 0);
  const novosAnterior = Number(dados?.novosMembrosMesAnterior || 0);
  const contrib = Number(dados?.financeiro?.totalContribuicoesMes || 0);
  const contribAnt = Number(dados?.financeiro?.totalContribuicoesMesAnterior || 0);
  const desp = Number(dados?.financeiro?.despesasMes || 0);
  const despAnt = Number(dados?.financeiro?.despesasMesAnterior || 0);
  const saldo = Number(dados?.financeiro?.saldoFinanceiro || 0);
  const saldoAnt = Number(dados?.financeiro?.saldoFinanceiroAnterior || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      <StatCard
        icon={Users}
        title="Total de Membros"
        value={totalMembros.toLocaleString()}
        growth={calculateGrowth(totalMembros, membrosAnterior).value}
        positive={calculateGrowth(totalMembros, membrosAnterior).positive}
      />
      <StatCard
        icon={UserPlus}
        title="Novos Membros"
        value={novosMembros.toLocaleString()}
        growth={calculateGrowth(novosMembros, novosAnterior).value}
        positive={calculateGrowth(novosMembros, novosAnterior).positive}
      />
      <StatCard
        icon={Wallet}
        title="Contribuições"
        value={`${contrib.toLocaleString()} Kz`}
        growth={calculateGrowth(contrib, contribAnt).value}
        positive={calculateGrowth(contrib, contribAnt).positive}
      />
      <StatCard
        icon={Receipt}
        title="Despesas"
        value={`${desp.toLocaleString()} Kz`}
        growth={calculateGrowth(desp, despAnt).value}
        positive={!calculateGrowth(desp, despAnt).positive}
      />
      <StatCard
        icon={Landmark}
        title="Balanço Consolidado"
        value={`${saldo.toLocaleString()} Kz`}
        growth={calculateGrowth(saldo, saldoAnt).value}
        positive={calculateGrowth(saldo, saldoAnt).positive}
        accent={saldo >= 0 ? "primary" : "danger"}
        fullWidth
      />
    </div>
  );
}
