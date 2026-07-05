import React, { useEffect, useState } from "react";
import { Calendar, Filter, Download, Loader2, X, CheckCircle2 } from "lucide-react";
import api from "../../api/axiosConfig";
import AppPage from "../../components/ui/AppPage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function ReltorioPresencas() {
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchPresencas();
  }, []);

  const fetchPresencas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/presencas");
      setPresencas(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar presenças.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppPage subtitle="Controle de frequência aos cultos e eventos.">
      {toast && (
        <div className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error" ? "bg-danger/5 border-danger/20 text-danger" : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-successSoft flex items-center justify-center text-success">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Relatório de Presenças</h2>
            <p className="text-muted text-textMuted mt-0.5">Controle de frequência</p>
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
      ) : presencas.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma presença registrada.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {presencas.map((presenca) => (
            <Card key={presenca.id} padding="p-4" className="hover:border-primary/20 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-successSoft flex items-center justify-center text-success">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">{presenca.membroNome || "Membro"}</h3>
                    <p className="text-xs text-textMuted">{presenca.data || "Data não informada"}</p>
                  </div>
                </div>
                <Badge variant={presenca.presente ? "success" : "warning"}>
                  {presenca.presente ? "Presente" : "Ausente"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppPage>
  );
}
