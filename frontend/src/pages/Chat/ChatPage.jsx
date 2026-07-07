// src/components/Chat/ChatPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
    return <img src={foto} alt={nome} className="w-7 h-7 rounded-full object-cover border border-slate-100" />;
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

  // EFEITO 1: Gerencia Histórico Inicial e Conexão de Tempo Real
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

      if (Number(novaMensagem.MembroId) !== Number(meuMembroId)) {
        api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);
      }
    });

    return () => {
      ativo = false;
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [conversaId, tentativa, meuMembroId]);

  // EFEITO 2: Marca como lidas ao abrir a sala
  useEffect(() => {
    if (conversa) {
      api.post(`/conversa/${conversaId}/marcar-lidas`).catch(() => null);
    }
  }, [conversaId, conversa]);

  // EFEITO 3: Scroll fixado no final do fluxo
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa?.mensagens?.length]);

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
      setMensagem(texto);
    } finally {
      setEnviando(false);
    }
  };

  if (erroHistorico) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white gap-3 px-4 text-center">
        <AlertCircle size={16} className="text-red-500" />
        <p className="text-sm text-slate-500 font-medium">Não foi possível sincronizar este canal.</p>
        <button
          onClick={() => {
            setErroHistorico(false);
            setTentativa((t) => t + 1);
          }}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RotateCw size={12} /> Sincronizar Novamente
        </button>
      </div>
    );
  }

  if (!conversa) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <Loader2 size={16} className="text-primary animate-spin mb-2" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Autenticando sessão segura...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden text-left">
      {/* HEADER - PADRÃO AUDITORIA */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-white shadow-sm z-10">
        <div className="relative shrink-0">
          <img
            src={membroSelecionado?.foto || "/default-avatar.png"}
            alt={membroSelecionado?.nome}
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 truncate">{membroSelecionado?.nome}</h3>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Canal Ativo
          </p>
        </div>
      </div>

      {/* ÁREA DE HISTÓRICO */}
      <div
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-2 bg-slate-50/30"
        style={{
          backgroundImage: "radial-gradient(#E2E8F0 0.5px, transparent 0.5px)",
          backgroundSize: "16px 16px",
        }}
      >
        {gruposPorDia.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm mb-2">💬</div>
            <p className="text-xs font-semibold text-slate-400">
              Histórico em branco. Envie uma directriz para iniciar o diálogo.
            </p>
          </div>
        )}

        {gruposPorDia.map((grupo, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-2.5">
            {grupo.rotulo && (
              <div className="flex justify-center my-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 rounded-md px-2.5 py-1 shadow-sm">
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
                    className={`px-4 py-2.5 max-w-[75%] rounded-xl shadow-sm border ${enviadaPorMim
                        ? "bg-primary border-primary text-white rounded-br-none"
                        : "bg-white text-slate-700 border-slate-100 rounded-bl-none"
                      }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words font-medium">
                      {msg.texto}
                    </p>
                    {msg.createdAt && (
                      <p
                        className={`text-[9px] font-bold mt-1 text-right tracking-tight ${enviadaPorMim ? "text-white/70" : "text-slate-400"
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

      {/* INPUT CONSOLE BAR */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-end bg-slate-50/50 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <textarea
            ref={textareaRef}
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              ajustarAlturaTextarea();
            }}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-xs text-slate-800 placeholder:text-slate-400 py-1.5 px-2 max-h-24 font-medium"
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
            className={`p-2 rounded-lg transition-all shrink-0 ${mensagem.trim()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-transparent text-slate-400"
              }`}
          >
            {enviando ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}