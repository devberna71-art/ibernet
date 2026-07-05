import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, Loader2, User } from "lucide-react";
import api from "../../api/axiosConfig";
import ChatPage from "./ChatPage";

export default function MembersChat() {
  const [membros, setMembros] = useState([]);
  const [meuMembroId, setMeuMembroId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversaId, setConversaId] = useState(null);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resUser, resMembros] = await Promise.all([
          api.get("/usuario/me"),
          api.get("/membros")
        ]);
        
        if (resUser.data?.usuario?.MembroId) {
          setMeuMembroId(Number(resUser.data.usuario.MembroId));
        }
        setMembros(resMembros.data || []);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    };
    carregarDadosIniciais();
  }, []);

  const iniciarConversa = async (membroDestino) => {
    if (Number(membroDestino.id) === Number(meuMembroId)) return;

    setLoading(true);
    setConversaId(null); 
    setMembroSelecionado(membroDestino);
    
    if (isMobile) setViewMode("chat");

    try {
      const res = await api.post("/conversas", {
        membros: [membroDestino.id]
      });

      const id = res.data?.id || res.data?.ChatConversaId;
      if (id) {
        setConversaId(id);
      }
    } catch (err) {
      console.error("Erro ao iniciar conversa:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      
      {/* SIDEBAR ESQUERDA */}
      <div className={`${isMobile ? (viewMode === "list" ? "w-full" : "hidden") : "w-[360px]"} flex flex-col bg-bgSection border-r border-border h-full`}>
        <div className="p-4 pb-3">
          <h2 className="text-xl font-bold text-text">Mensagens</h2>
          <p className="text-xs font-semibold text-textMuted">WORKSPACE PREMIUM</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {membros
            .filter((m) => Number(m.id) !== Number(meuMembroId))
            .map((m) => {
              const ativo = membroSelecionado?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => iniciarConversa(m)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all ${
                    ativo
                      ? "bg-primary text-white"
                      : "hover:bg-bgSection/50 text-text"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={m.foto}
                      alt={m.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${ativo ? "text-white" : "text-text"}`}>{m.nome}</p>
                    <p className={`text-xs ${ativo ? "text-white/75" : "text-textMuted"}`}>{m.email}</p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* PAINEL DE CHAT DIREITO */}
      <div className={`${isMobile ? (viewMode === "chat" ? "flex" : "hidden") : "flex"} flex-1 flex-col bg-white`}>
        
        {isMobile && viewMode === "chat" && (
          <div className="p-3 flex items-center border-b border-border">
            <button onClick={() => setViewMode("list")} className="p-2 -ml-2 text-textMuted hover:text-text">
              <ArrowLeft size={20} />
            </button>
            <span className="font-semibold text-text">{membroSelecionado?.nome}</span>
          </div>
        )}

        {conversaId ? (
          <ChatPage 
            key={conversaId}
            conversaId={conversaId} 
            membroSelecionado={membroSelecionado} 
            meuMembroId={meuMembroId} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-2xl bg-primarySoft flex items-center justify-center mb-4">
              <MessageSquare size={26} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text">Comunicação Corporativa</h3>
            <p className="text-textMuted text-center max-w-xs mt-2">
              Selecione um membro para iniciar uma conversa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
