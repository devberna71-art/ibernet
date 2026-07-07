import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageSquare, Search, AlertCircle, RotateCw } from "lucide-react";
import api from "../../api/axiosConfig";
import ChatPage from "./ChatPage";

// Avatar com fallback de iniciais caso o membro não tenha foto
// (tamanhos fixos "sm"/"md" para as classes do Tailwind serem detectadas no build)
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
          className={`${dimensao} rounded-full object-cover`}
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
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
      )}
    </div>
  );
}

function MembroSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 mb-1 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-border/60" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-border/60" />
        <div className="h-2 w-1/2 rounded bg-border/40" />
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
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* SIDEBAR ESQUERDA */}
      <div
        className={`${isMobile ? (viewMode === "list" ? "w-full" : "hidden") : "w-[360px]"
          } flex flex-col bg-bgSection border-r border-border h-full`}
      >
        <div className="p-4 pb-3">
          <h2 className="text-xl font-bold text-text">Mensagens</h2>
          <p className="text-xs font-semibold text-textMuted tracking-wide">
            COMUNIDADE DA IGREJA
          </p>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 focus-within:border-primary transition-colors">
            <Search size={16} className="text-textMuted" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Procurar membro..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-text placeholder:text-textMuted/70"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {loadingMembros && (
            <div className="px-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <MembroSkeleton key={i} />
              ))}
            </div>
          )}

          {!loadingMembros && erroMembros && (
            <div className="flex flex-col items-center text-center gap-2 px-4 py-10">
              <AlertCircle size={22} className="text-red-500" />
              <p className="text-sm text-textMuted">Não foi possível carregar os membros.</p>
              <button
                onClick={carregarDadosIniciais}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <RotateCw size={14} /> Tentar novamente
              </button>
            </div>
          )}

          {!loadingMembros && !erroMembros && membrosFiltrados.length === 0 && (
            <div className="flex flex-col items-center text-center gap-1 px-4 py-10">
              <p className="text-sm text-textMuted">
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
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all ${ativo ? "bg-primary text-white" : "hover:bg-white text-text"
                    }`}
                >
                  <Avatar nome={m.nome} foto={m.foto} />
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${ativo ? "text-white" : "text-text"
                        }`}
                    >
                      {m.nome}
                    </p>
                    <p className={`text-xs truncate ${ativo ? "text-white/75" : "text-textMuted"}`}>
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
        className={`${isMobile ? (viewMode === "chat" ? "flex" : "hidden") : "flex"
          } flex-1 flex-col bg-white`}
      >
        {isMobile && viewMode === "chat" && (
          <div className="p-3 flex items-center gap-2 border-b border-border">
            <button
              onClick={() => setViewMode("list")}
              className="p-2 -ml-2 text-textMuted hover:text-text"
            >
              <ArrowLeft size={20} />
            </button>
            <Avatar nome={membroSelecionado?.nome} foto={membroSelecionado?.foto} size="sm" />
            <span className="font-semibold text-text truncate">{membroSelecionado?.nome}</span>
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
            <h3 className="text-lg font-bold text-text">
              {carregandoConversa ? "Abrindo conversa..." : "Comunicação da Igreja"}
            </h3>
            <p className="text-textMuted text-center max-w-xs mt-2">
              {carregandoConversa
                ? "Só um momento."
                : "Selecione um membro para iniciar uma conversa."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}