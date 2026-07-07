// src/components/Chat/MembersChat.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageSquare, Search, AlertCircle, RotateCw } from "lucide-react";
import api from "../../api/axiosConfig";
import ChatPage from "./ChatPage";

function Avatar({ nome, foto, size = "md", online = true }) {
  const iniciais = (nome || "?")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const dimensao = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <div className="relative shrink-0">
      {foto ? (
        <img
          src={foto}
          alt={nome}
          className={`${dimensao} rounded-full object-cover border border-slate-100`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`${dimensao} rounded-full bg-primarySoft text-primary text-xs font-bold items-center justify-center ${foto ? "hidden" : "flex"}`}
      >
        {iniciais}
      </div>
      {online && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
      )}
    </div>
  );
}

function MembroSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 mb-1 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="h-2 w-1/2 rounded bg-slate-50" />
      </div>
    </div>
  );
}

export default function MembersChat() {
  const [membros, setMembros] = useState([]);
  const [meuMembroId, setMeuMembroId] = useState(null);
  const [loadingMembros, setLoadingMembros] = useState(true);
  const [erroMembros, setErroMembros] = useState(false);
  const [busca, setBusca] = useState("");

  const [conversaId, setConversaId] = useState(null);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [carregandoConversa, setCarregandoConversa] = useState(false);

  const [viewMode, setViewMode] = useState("list");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const carregarDadosIniciais = async () => {
    setLoadingMembros(true);
    setErroMembros(false);
    try {
      const [resUser, resMembros] = await Promise.all([
        api.get("/usuario/me"),
        api.get("/membros"),
      ]);

      if (resUser.data?.usuario?.MembroId) {
        setMeuMembroId(Number(resUser.data.usuario.MembroId));
      }
      setMembros(resMembros.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setErroMembros(true);
    } finally {
      setLoadingMembros(false);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const membrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return membros
      .filter((m) => Number(m.id) !== Number(meuMembroId))
      .filter((m) =>
        termo
          ? m.nome?.toLowerCase().includes(termo) || m.email?.toLowerCase().includes(termo)
          : true
      )
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
  }, [membros, meuMembroId, busca]);

  const iniciarConversa = async (membroDestino) => {
    if (Number(membroDestino.id) === Number(meuMembroId)) return;
    if (Number(membroSelecionado?.id) === Number(membroDestino.id) && conversaId) {
      if (isMobile) setViewMode("chat");
      return;
    }

    setCarregandoConversa(true);
    setConversaId(null);
    setMembroSelecionado(membroDestino);

    if (isMobile) setViewMode("chat");

    try {
      const res = await api.post("/conversas", {
        membros: [membroDestino.id],
      });

      const id = res.data?.id || res.data?.ChatConversaId;
      if (id) {
        setConversaId(id);
      }
    } catch (err) {
      console.error("Erro ao iniciar conversa:", err);
    } finally {
      setCarregandoConversa(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans antialiased text-left">
      {/* SIDEBAR ESQUERDA - LIMPA SEM FUNDO CINZENTO */}
      <div
        className={`${isMobile ? (viewMode === "list" ? "w-full" : "hidden") : "w-[360px]"
          } flex flex-col bg-white border-r border-slate-200 h-full`}
      >
        <div className="p-4 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mensagens</h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
            Comunidade da Igreja
          </p>
        </div>

        {/* PROCURAR MEMBRO */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search size={14} className="text-slate-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Procurar membro..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium py-0.5"
            />
          </div>
        </div>

        {/* LISTAGEM */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {loadingMembros && (
            <div className="px-1 space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <MembroSkeleton key={i} />
              ))}
            </div>
          )}

          {!loadingMembros && erroMembros && (
            <div className="flex flex-col items-center text-center gap-2 px-4 py-10 bg-white border border-slate-100 rounded-xl m-2">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-xs text-slate-500 font-medium">Não foi possível carregar os membros.</p>
              <button
                onClick={carregarDadosIniciais}
                className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors mt-1"
              >
                <RotateCw size={12} /> Tentar novamente
              </button>
            </div>
          )}

          {!loadingMembros && !erroMembros && membrosFiltrados.length === 0 && (
            <div className="flex flex-col items-center text-center gap-1 px-4 py-10">
              <p className="text-xs font-medium text-slate-400">
                {busca ? "Nenhum membro encontrado." : "Ainda não há outros membros cadastrados."}
              </p>
            </div>
          )}

          {!loadingMembros &&
            !erroMembros &&
            membrosFiltrados.map((m) => {
              const ativo = membroSelecionado?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => iniciarConversa(m)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${ativo 
                      ? "bg-primary border-primary text-white shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-slate-50/50 hover:border-slate-100 text-slate-700"
                    }`}
                >
                  <Avatar nome={m.nome} foto={m.foto} online={true} />
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-xs font-bold truncate ${ativo ? "text-white" : "text-slate-800"}`}>
                      {m.nome}
                    </p>
                    <p className={`text-[11px] truncate font-medium mt-0.5 ${ativo ? "text-white/80" : "text-slate-400"}`}>
                      {m.email}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* PAINEL DE CHAT DIREITO */}
      <div
        className={`${isMobile ? (viewMode === "chat" ? "flex" : "hidden") : "flex"} flex-1 flex-col bg-white`}
      >
        {isMobile && viewMode === "chat" && (
          <div className="p-3 flex items-center gap-2 border-b border-slate-200 bg-white">
            <button
              onClick={() => setViewMode("list")}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <Avatar nome={membroSelecionado?.nome} foto={membroSelecionado?.foto} size="sm" />
            <span className="font-bold text-xs text-slate-800 truncate">{membroSelecionado?.nome}</span>
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
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/10">
            <div className="w-11 h-11 rounded-xl bg-primarySoft flex items-center justify-center text-primary mb-3 border border-slate-100 shadow-none">
              <MessageSquare size={16} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {carregandoConversa ? "Sincronizando canal operacional..." : "Módulo de Comunicação"}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 text-center max-w-xs mt-1.5 leading-relaxed">
              {carregandoConversa
                ? "A carregar as credenciais seguras da sala."
                : "Selecione um utilizador do directório lateral para auditar ou iniciar uma nova sessão de conversação."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}