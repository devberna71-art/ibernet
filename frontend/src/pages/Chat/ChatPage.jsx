import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Loader2, AlertCircle, RotateCw } from "lucide-react";
import api from "../../api/axiosConfig";
import socket from "../../api/socketConfig";

function AvatarMini({ nome, foto }) {
  const iniciais = (nome || "?")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (foto) {
    return <img src={foto} alt={nome} className="w-7 h-7 rounded-full object-cover" />;
  }
  return (
    <div className="w-7 h-7 rounded-full bg-primarySoft text-primary text-[10px] font-bold flex items-center justify-center">
      {iniciais}
    </div>
  );
}

function formatarHora(dataStr) {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function formatarSeparadorData(dataStr) {
  const data = new Date(dataStr);
  if (Number.isNaN(data.getTime())) return "";
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const mesmoDia = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (mesmoDia(data, hoje)) return "Hoje";
  if (mesmoDia(data, ontem)) return "Ontem";
  return data.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ChatPage({ conversaId, membroSelecionado, meuMembroId }) {
  const [conversa, setConversa] = useState(null);
  const [erroHistorico, setErroHistorico] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const mensagensEndRef = useRef(null);
  const textareaRef = useRef(null);

  // EFEITO 1: Gerencia Histórico Inicial e Conexão de Tempo Real com Socket.io
  useEffect(() => {
    if (!conversaId) return;

    let ativo = true;

    const carregarHistoricoInicial = async () => {
      setErroHistorico(false);
      try {
        const res = await api.get(`/conversa/${conversaId}`);
        if (ativo) setConversa(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico inicial:", err);
        if (ativo) setErroHistorico(true);
      }
    };

    carregarHistoricoInicial();

    // Conecta e entra na sala desta conversa
    socket.connect();
    socket.emit("join_room", conversaId);

    socket.on("receive_message", (novaMensagem) => {
      setConversa((conversaAtual) => {
        if (!conversaAtual) return conversaAtual;

        const jaExiste = conversaAtual.mensagens.some((m) => m.id === novaMensagem.id);
        if (jaExiste) return conversaAtual;

        return {
          ...conversaAtual,
          mensagens: [...conversaAtual.mensagens, novaMensagem],
        };
      });

      // Se a mensagem recebida não é minha, marca como lida na hora
      if (Number(novaMensagem.MembroId) !== Number(meuMembroId)) {
        api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);
      }
    });

    return () => {
      ativo = false;
      socket.off("receive_message");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaId, tentativa]);

  // EFEITO 2: Marca como lidas assim que a conversa é aberta
  useEffect(() => {
    if (conversa) {
      api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaId, !!conversa]);

  // EFEITO 3: Mantém a rolagem sempre fixada na última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa?.mensagens?.length]);

  // Agrupa as mensagens por dia para exibir separadores de data
  const gruposPorDia = useMemo(() => {
    if (!conversa?.mensagens) return [];
    const grupos = [];
    let grupoAtual = null;

    conversa.mensagens.forEach((msg) => {
      const rotulo = msg.createdAt ? formatarSeparadorData(msg.createdAt) : null;
      if (!grupoAtual || grupoAtual.rotulo !== rotulo) {
        grupoAtual = { rotulo, mensagens: [] };
        grupos.push(grupoAtual);
      }
      grupoAtual.mensagens.push(msg);
    });

    return grupos;
  }, [conversa?.mensagens]);

  const ajustarAlturaTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  const enviarMensagem = async () => {
    const texto = mensagem.trim();
    if (!texto || enviando) return;

    setMensagem("");
    requestAnimationFrame(ajustarAlturaTextarea);
    setEnviando(true);

    try {
      const res = await api.post("/mensagens", {
        ChatConversaId: conversaId,
        texto,
      });

      setConversa((conversaAtual) => {
        if (!conversaAtual) return conversaAtual;
        const jaExiste = conversaAtual.mensagens.some((m) => m.id === res.data.id);
        if (jaExiste) return conversaAtual;

        return {
          ...conversaAtual,
          mensagens: [...conversaAtual.mensagens, res.data],
        };
      });

      await api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setMensagem(texto); // devolve o texto ao input para o membro tentar de novo
    } finally {
      setEnviando(false);
    }
  };

  // ESTADO: falha ao carregar o histórico
  if (erroHistorico) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white gap-3 px-4 text-center">
        <AlertCircle size={26} className="text-red-500" />
        <p className="text-sm text-textMuted">Não foi possível carregar esta conversa.</p>
        <button
          onClick={() => {
            setErroHistorico(false);
            setTentativa((t) => t + 1);
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <RotateCw size={14} /> Tentar novamente
        </button>
      </div>
    );
  }

  // ESTADO: sincronizando histórico inicial
  if (!conversa) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <Loader2 size={28} strokeWidth={1.75} className="text-primary animate-spin mb-2" />
        <p className="text-sm text-textMuted font-medium">Sincronizando conversa segura...</p>
      </div>
    );
  }

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
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text truncate">{membroSelecionado?.nome}</h3>
          <p className="text-xs text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            Online
          </p>
        </div>
      </div>

      {/* ÁREA DE MENSAGENS */}
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 bg-bgSection/30"
        style={{
          backgroundImage: "radial-gradient(#E2E8F0 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      >
        {gruposPorDia.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
            <p className="text-sm text-textMuted">
              Ainda não há mensagens. Diga olá para {membroSelecionado?.nome?.split(" ")[0] || "o membro"}! 👋
            </p>
          </div>
        )}

        {gruposPorDia.map((grupo, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            {grupo.rotulo && (
              <div className="flex justify-center my-2">
                <span className="text-[11px] font-semibold text-textMuted bg-white border border-border rounded-full px-3 py-1">
                  {grupo.rotulo}
                </span>
              </div>
            )}

            {grupo.mensagens.map((msg) => {
              const enviadaPorMim = Number(msg.MembroId) === Number(meuMembroId);
              return (
                <div
                  key={msg.id}
                  className={`flex ${enviadaPorMim ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {!enviadaPorMim && (
                    <AvatarMini
                      nome={msg.Membro?.nome || membroSelecionado?.nome}
                      foto={msg.Membro?.foto || membroSelecionado?.foto}
                    />
                  )}
                  <div
                    className={`px-4 py-2.5 max-w-[70%] rounded-2xl shadow-sm ${enviadaPorMim
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white text-text border border-border rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.texto}
                    </p>
                    {msg.createdAt && (
                      <p
                        className={`text-[10px] mt-1 text-right ${enviadaPorMim ? "text-white/70" : "text-textMuted"
                          }`}
                      >
                        {formatarHora(msg.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={mensagensEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t border-border">
        <div className="flex items-end bg-bgSection rounded-3xl px-4 py-2 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <textarea
            ref={textareaRef}
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              ajustarAlturaTextarea();
            }}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-text placeholder:text-textMuted/60 py-1 px-2 max-h-24"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
              }
            }}
          />
          <button
            onClick={enviarMensagem}
            disabled={enviando || !mensagem.trim()}
            aria-label="Enviar mensagem"
            className={`ml-2 p-2 rounded-full transition-all ${mensagem.trim()
                ? "bg-primary text-white hover:bg-primaryHover"
                : "bg-transparent text-textMuted"
              }`}
          >
            {enviando ? (
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