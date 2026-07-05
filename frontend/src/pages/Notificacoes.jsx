import React, { useEffect, useState } from "react";
import { Cake, Loader2, RefreshCw, Calendar, User } from "lucide-react";
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
    return (
      date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
    );
  };

  const calculateAge = (dateStr) => {
    if (!dateStr) return "-";
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <AppPage subtitle="Comemore conosco cada momento especial.">
      {toast && (
        <div className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error" ? "bg-danger/5 border-danger/20 text-danger" : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white">
            <Cake size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Aniversariantes</h2>
            <p className="text-muted text-textMuted mt-0.5">Celebrações especiais 💙</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast("Lista atualizada automaticamente a cada 60 segundos", "info")}
          disabled={atualizando}
        >
          <RefreshCw size={13} className={`w-4 h-4 shrink-0 mr-2 ${atualizando ? "animate-spin" : ""}`} />
          {atualizando ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando aniversariantes...</span>
        </div>
      ) : notificacoes.length === 0 ? (
        <Card className="text-center py-12">
          <Cake size={32} className="text-textMuted mx-auto mb-3" />
          <p className="text-body text-textMuted">Nenhum aniversário recente 🎈</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notificacoes.map((notif, index) => {
            const isToday = isBirthdayToday(notif.Membro?.data_nascimento);
            const idade = calculateAge(notif.Membro?.data_nascimento);

            return (
              <Card
                key={notif.id || index}
                padding="p-4"
                className={`hover:border-primary/20 transition-all duration-200 ${
                  isToday ? "border-warning bg-warning/5" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      isToday
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                        : "bg-gradient-to-br from-primary to-purple-500 text-white"
                    }`}>
                      <Cake size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-text">{notif.Membro?.nome || "Membro Desconhecido"}</h3>
                        {isToday && (
                          <Badge variant="warning">🎊 Hoje!</Badge>
                        )}
                      </div>
                      <p className={`text-xs font-semibold mb-2 ${isToday ? "text-warning" : "text-primary"}`}>
                        {idade} anos
                      </p>
                      <p className="text-xs text-textMuted line-clamp-2">{notif.mensagem}</p>
                      <p className="text-[10px] text-textMuted mt-2 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(notif.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {notif.Membro?.foto && (
                    <img
                      src={notif.Membro.foto}
                      alt={notif.Membro.nome}
                      className={`w-20 h-20 rounded-xl object-cover ${
                        isToday ? "border-2 border-warning" : "border-2 border-border"
                      }`}
                    />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Aniversariante do Mês */}
      <div className="mt-8">
        <AniversarianteMes />
      </div>
    </AppPage>
  );
}
