import { useEffect, useState, useRef } from "react";
import { Send, Loader2, User } from "lucide-react";
import api from "../../api/axiosConfig";
import socket from "../../api/socketConfig";

export default function ChatPage({ conversaId, membroSelecionado, meuMembroId }) {
  const [conversa, setConversa] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const mensagensEndRef = useRef(null);

  // EFEITO 1: Gerencia Histórico Inicial e Conexão de Tempo Real com Socket.io
  useEffect(() => {
    if (!conversaId) return;

    // 1. Busca o histórico de mensagens inicial via Axios
    const carregarHistoricoInicial = async () => {
      try {
        const res = await api.get(`/conversa/${conversaId}`);
        setConversa(res.data);
      } catch (err) { 
        console.error("Erro ao carregar histórico inicial:", err); 
      }
    };
    
    carregarHistoricoInicial();

    // 2. Conecta e gerencia salas no Socket.io
    socket.connect();
    
    // Avisa o servidor para colocar esse cliente na sala específica desta conversa
    socket.emit("join_room", conversaId);

    // Ouve as novas mensagens enviadas para esta sala
    socket.on("receive_message", (novaMensagem) => {
      setConversa((conversaAtual) => {
        if (!conversaAtual) return conversaAtual;

        // Evita duplicar mensagens caso você mesmo tenha enviado e o POST já inseriu localmente
        const mensagemJaExiste = conversaAtual.mensagens.some(
          (m) => m.id === novaMensagem.id
        );
        
        if (mensagemJaExiste) return conversaAtual;

        return {
          ...conversaAtual,
          mensagens: [...conversaAtual.mensagens, novaMensagem]
        };
      });
    });

    // Limpeza crucial: desliga os ouvintes de eventos e desconecta do WebSocket
    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [conversaId]);

  // EFEITO 2: Mantém a rolagem do chat sempre fixada na última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa?.mensagens]);

  // FUNÇÃO: Envia mensagem via POST e atualiza a tela instantaneamente
  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;
    const textoParaEnviar = mensagem;
    setMensagem("");
    
    try {
      setLoading(true);
      
      const res = await api.post("/mensagens", { 
        ChatConversaId: conversaId, 
        texto: textoParaEnviar 
      });

      // Atualiza o estado na hora sem fazer uma nova requisição HTTP de histórico
      setConversa((conversaAtual) => {
        if (!conversaAtual) return conversaAtual;
        
        const mensagemJaExiste = conversaAtual.mensagens.some((m) => m.id === res.data.id);
        if (mensagemJaExiste) return conversaAtual;

        return {
          ...conversaAtual,
          mensagens: [...conversaAtual.mensagens, res.data]
        };
      });

      // Notifica o backend para atualizar as confirmações de leitura
      await api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);

    } catch (err) { 
      console.error("Erro ao enviar mensagem:", err);
      setMensagem(textoParaEnviar);
    } finally { 
      setLoading(false); 
    }
  };

  // RENDERIZAÇÃO: Estado de Sincronização inicial do chat
  if (!conversa) return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <Loader2 size={28} strokeWidth={1.75} className="text-primary animate-spin mb-2" />
      <p className="text-body text-textMuted font-medium">Sincronizando conversa segura...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* HEADER */}
      <div className="p-3 flex items-center gap-3 border-b border-border bg-white">
        <div className="relative">
          <img
            src={membroSelecionado?.foto}
            alt={membroSelecionado?.nome}
            className="w-10 h-10 rounded-full object-cover border-2 border-bgSection shadow-sm"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-text">{membroSelecionado?.nome}</h3>
          <p className="text-xs text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            Online
          </p>
        </div>
      </div>

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-bgSection/30" style={{ backgroundImage: "radial-gradient(#E2E8F0 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
        {conversa.mensagens?.map((msg) => {
          const enviadaPorMim = Number(msg.MembroId) === Number(meuMembroId);
          return (
            <div key={msg.id} className={`flex ${enviadaPorMim ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!enviadaPorMim && (
                <img
                  src={msg.Membro?.foto || membroSelecionado?.foto}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <div
                className={`px-4 py-2.5 max-w-[70%] rounded-2xl shadow-sm ${
                  enviadaPorMim
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white text-text border border-border rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.texto}</p>
              </div>
            </div>
          );
        })}
        <div ref={mensagensEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t border-border">
        <div className="flex items-center bg-bgSection rounded-full px-4 py-2 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-text placeholder:text-textMuted/60 py-1 px-2 max-h-24"
            rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensagem(); } }}
          />
          <button
            onClick={enviarMensagem}
            disabled={loading || !mensagem.trim()}
            className={`ml-2 p-2 rounded-full transition-all ${
              mensagem.trim()
                ? "bg-primary text-white hover:bg-primaryHover"
                : "bg-transparent text-textMuted"
            }`}
          >
            {loading ? (
              <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
            ) : (
              <Send size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
