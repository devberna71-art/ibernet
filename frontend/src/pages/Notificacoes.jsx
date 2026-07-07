import React, { useEffect, useState } from "react";
import { Cake, LoaderCircle, RefreshCw, CalendarDays, UserRound, Bell } from "lucide-react";
import api from "../api/axiosConfig";
import AppPage from "../components/ui/AppPage";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import AniversarianteMes from "../components/AniversarioMes";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        if (!loading) setAtualizando(true);
        const response = await api.get("/aniversarios");
        setNotificacoes(response.data.todasNotificacoes || []);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        showToast("Erro ao carregar notificações.", "error");
      } finally {
        setLoading(false);
        setTimeout(() => setAtualizando(false), 800);
      }
    };

    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 60000);
    return () => clearInterval(interval);
  }, []);

  const isBirthdayToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  };

  const calculateAge = (dateStr) => {
    if (!dateStr) return "-";
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <AppPage subtitle="Comemore conosco cada momento especial.">
      {/* Toast Refatorado */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-lg border shadow-sm font-medium transition-all ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
            toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-700" :
              "bg-green-50 border-green-200 text-green-700"
          }`}>
          {toast.message}
        </div>
      )}

      {/* Header Refatorado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Cake size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Aniversariantes</h2>
            <p className="text-sm text-slate-600">Acompanhe as celebrações da comunidade.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast("Lista atualizada", "info")}
          disabled={atualizando}
        >
          <RefreshCw size={14} className={`mr-2 ${atualizando ? "animate-spin" : ""}`} />
          {atualizando ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
          <LoaderCircle size={32} className="animate-spin text-blue-600" />
          <span className="text-sm font-medium">Carregando aniversariantes...</span>
        </div>
      ) : notificacoes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 border-dashed">
          <Bell size={40} className="text-slate-300 mb-3" />
          <p className="text-slate-600 font-medium">Nenhum aniversário por agora</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((notif, index) => {
            const isToday = isBirthdayToday(notif.Membro?.data_nascimento);
            const idade = calculateAge(notif.Membro?.data_nascimento);

            return (
              <Card
                key={notif.id || index}
                className={`p-4 transition-all hover:shadow-sm ${isToday ? "border-amber-200 bg-amber-50/30" : "border-slate-200"
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${!notif.Membro?.foto ? "bg-blue-50 text-blue-600" : ""}`}>
                    {notif.Membro?.foto ? (
                      <img src={notif.Membro.foto} alt={notif.Membro.nome} className="w-full h-full object-cover" />
                    ) : (
                      <UserRound size={24} />
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{notif.Membro?.nome || "Membro"}</h3>
                      {isToday && (
                        <Badge variant="warning" className="border-amber-200 bg-amber-100 text-amber-800">Aniversário hoje</Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mb-1">{idade} anos completos</p>
                    <p className="text-sm text-slate-600 leading-relaxed truncate">{notif.mensagem}</p>

                    <div className="flex items-center gap-2 mt-3 text-slate-400">
                      <CalendarDays size={14} />
                      <span className="text-[11px] font-medium uppercase tracking-wider">
                        {new Date(notif.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <AniversarianteMes />
      </div>
    </AppPage>
  );
}