import React, { useEffect, useState } from "react";
import { HandHeart, Filter, Download, Loader2, X, Search } from "lucide-react";
import api from "../../api/axiosConfig";
import AppPage from "../../components/ui/AppPage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function RelatorioContribuicoes() {
  const [contribuicoes, setContribuicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchContribuicoes();
  }, []);

  const fetchContribuicoes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contribuicoes");
      setContribuicoes(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar contribuições.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredContribuicoes = contribuicoes.filter(c =>
    c.membroNome?.toLowerCase().includes(search.toLowerCase()) ||
    c.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  const formatKz = (valor) => {
    return `${Number(valor || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
  };

  return (
    <AppPage subtitle="Detalhamento de todas as contribuições recebidas.">
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
            <HandHeart size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Relatório de Contribuições</h2>
            <p className="text-muted text-textMuted mt-0.5">Detalhamento de entradas</p>
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

      <Card padding="p-4" className="mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por membro ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando relatório...</span>
        </div>
      ) : filteredContribuicoes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma contribuição encontrada.</p>
        </Card>
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-bgSection text-[10px] font-bold text-textMuted uppercase tracking-wide">
                  <th className="px-5 py-3">Membro</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body">
                {filteredContribuicoes.map((contrib) => (
                  <tr key={contrib.id} className="hover:bg-bgSection/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-text">{contrib.membroNome || "-"}</td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{contrib.tipo || "Não informado"}</Badge>
                    </td>
                    <td className="px-5 py-3 text-textMuted">{contrib.data || "-"}</td>
                    <td className="px-5 py-3 font-bold text-success">{formatKz(contrib.valor)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={contrib.status === "confirmado" ? "success" : "warning"}>
                        {contrib.status || "Pendente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppPage>
  );
}
