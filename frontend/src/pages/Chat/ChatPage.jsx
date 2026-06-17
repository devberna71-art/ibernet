import { useEffect, useState, useRef } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  CircularProgress,
  Fade
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import api from "../../api/axiosConfig";
import socket from "../../api/socketConfig"; // 🚀 IMPORTANTE: Ajuste o caminho para o seu arquivo socketConfig

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
    socket.connect(); // Força a conexão já que o autoConnect está como false
    
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
    setMensagem(""); // Reseta o input imediatamente para manter a fluidez visual
    
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
      setMensagem(textoParaEnviar); // Em caso de falha de rede, devolve o texto digitado ao input
    } finally { 
      setLoading(false); 
    }
  };

  // RENDERIZAÇÃO: Estado de Sincronização inicial do chat
  if (!conversa) return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", bgcolor: "#FFFFFF" }}>
      <CircularProgress size={28} sx={{ color: "#0A46E4", mb: 2 }} />
      <Typography sx={{ color: "#64748B", fontWeight: 500, letterSpacing: "0.5px" }}>Sincronizando conversa segura...</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      
      {/* HEADER PREMIUM */}
      <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #F1F5F9", bgcolor: "#FFFFFF" }}>
        <Avatar src={membroSelecionado?.foto} sx={{ width: 42, height: 42, border: "2px solid #F8FAFC", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1.05rem", letterSpacing: "-0.2px" }}>{membroSelecionado?.nome}</Typography>
          <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, bgcolor: "#10B981", borderRadius: "50%", boxShadow: "0 0 8px #10B981" }} /> Online
          </Typography>
        </Box>
      </Paper>

      {/* ÁREA DE MENSAGENS */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2.5, bgcolor: "#FBFDFE", backgroundImage: "radial-gradient(#E2E8F0 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
        {conversa.mensagens?.map((msg) => {
          const enviadaPorMim = Number(msg.MembroId) === Number(meuMembroId);
          return (
            <Fade in key={msg.id}>
              <Box sx={{ display: "flex", justifyContent: enviadaPorMim ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 1 }}>
                {!enviadaPorMim && <Avatar src={msg.Membro?.foto || membroSelecionado?.foto} sx={{ width: 28, height: 28 }} />}
                <Paper sx={{ 
                  p: "10px 16px", 
                  maxWidth: "70%", 
                  borderRadius: enviadaPorMim ? "16px 16px 4px 16px" : "16px 16px 16px 4px", 
                  backgroundColor: enviadaPorMim ? "#0A46E4" : "#FFFFFF", 
                  color: enviadaPorMim ? "#FFFFFF" : "#1E293B",
                  boxShadow: enviadaPorMim ? "0 4px 12px rgba(10, 70, 228, 0.2)" : "0 2px 6px rgba(0,0,0,0.04)",
                  border: enviadaPorMim ? "none" : "1px solid #E2E8F0"
                }}>
                  <Typography variant="body2" sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{msg.texto}</Typography>
                </Paper>
              </Box>
            </Fade>
          );
        })}
        <div ref={mensagensEndRef} />
      </Box>

      {/* INPUT BAR MODERNO */}
      <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
        <Box sx={{ 
          display: "flex", alignItems: "center", bgcolor: "#F8FAFC", borderRadius: "24px", p: "4px 8px", border: "1px solid #E2E8F0",
          "&:focus-within": { borderColor: "#0A46E4", boxShadow: "0 0 0 2px rgba(10,70,228,0.1)" } 
        }}>
          <TextField
            fullWidth
            multiline
            variant="standard"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite uma mensagem..."
            InputProps={{ disableUnderline: true, sx: { px: 2, py: 1 } }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensagem(); } }}
          />
          <IconButton 
            onClick={enviarMensagem} 
            disabled={loading || !mensagem.trim()}
            sx={{ 
              bgcolor: mensagem.trim() ? "#0A46E4" : "transparent",
              color: mensagem.trim() ? "#FFFFFF" : "#94A3B8",
              "&:hover": { bgcolor: mensagem.trim() ? "#0737B5" : "transparent" },
              transition: "0.3s"
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}