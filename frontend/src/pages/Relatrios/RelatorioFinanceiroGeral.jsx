import React, { useEffect, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, Wallet, Download, Loader2, X } from "lucide-react";
import api from "../../api/axiosConfig";
import AppPage from "../../components/ui/AppPage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function RelatorioFinanceiroGeral() {
  const [financeiro, setFinanceiro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchFinanceiro();
  }, []);

  const fetchFinanceiro = async () => {
    setLoading(true);
    try {
      const res = await api.get("/relatorio/financeiro-geral");
      setFinanceiro(res.data);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar dados financeiros.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatKz = (valor) => {
    return `${Number(valor || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
  };

  return (
    <AppPage subtitle="Balanço financeiro consolidado da igreja.">
      {toast && (
        <div className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error" ? "bg-danger/5 border-danger/20 text-danger" : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <Wallet size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Relatório Financeiro Geral</h2>
            <p className="text-muted text-textMuted mt-0.5">Balanço consolidado</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => showToast("Funcionalidade de exportação em desenvolvimento", "info")}
        >
          <Download size={15} className="w-4 h-4 shrink-0 mr-2" />
          Exportar
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando relatório...</span>
        </div>
      ) : !financeiro ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Dados financeiros não disponíveis.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-success text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} />
                <span className="text-[10px] font-semibold opacity-90 uppercase">Total Receitas</span>
              </div>
              <p className="text-2xl font-bold">{formatKz(financeiro.totalReceitas || 0)}</p>
            </Card>
            <Card className="bg-danger text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} />
                <span className="text-[10px] font-semibold opacity-90 uppercase">Total Despesas</span>
              </div>
              <p className="text-2xl font-bold">{formatKz(financeiro.totalDespesas || 0)}</p>
            </Card>
            <Card className={financeiro.saldo >= 0 ? "bg-primary text-white" : "bg-warning text-white"}>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} />
                <span className="text-[10px] font-semibold opacity-90 uppercase">Saldo</span>
              </div>
              <p className="text-2xl font-bold">{formatKz(financeiro.saldo || 0)}</p>
            </Card>
          </div>

          {/* Detalhamento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card padding="p-4">
              <h3 className="text-sm font-bold text-text mb-4">Receitas por Categoria</h3>
              <div className="space-y-3">
                {financeiro.receitasPorCategoria?.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-text">{cat.categoria}</span>
                    <Badge variant="success">{formatKz(cat.valor)}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="p-4">
              <h3 className="text-sm font-bold text-text mb-4">Despesas por Categoria</h3>
              <div className="space-y-3">
                {financeiro.despesasPorCategoria?.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-text">{cat.categoria}</span>
                    <Badge variant="danger">{formatKz(cat.valor)}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </AppPage>
  );
}
