import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Badge,
  IconButton,
  styled,
  useTheme,
  useMediaQuery
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import api from "../../api/axiosConfig";
import ChatPage from "./ChatPage";

// 🟢 Efeito de Pulsação de Presença
const PremiumOnlineBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#10B981",
    color: "#10B981",
    boxShadow: "0 0 0 3px #ffffff, 0px 2px 4px rgba(16, 185, 129, 0.2)",
    width: 10,
    height: 10,
    borderRadius: "50%",
    "&::after": {
      position: "absolute",
      top: 0, left: 0, width: "100%", height: "100%",
      borderRadius: "50%",
      animation: "auraPulse 2.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes auraPulse": {
    "0%": { transform: "scale(0.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

export default function MembersChat() {
  const [membros, setMembros] = useState([]);
  const [meuMembroId, setMeuMembroId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversaId, setConversaId] = useState(null);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    // Evita clicar em si mesmo
    if (Number(membroDestino.id) === Number(meuMembroId)) return;

    // Reset de estado antes de nova carga para garantir a transição
    setLoading(true);
    setConversaId(null); 
    setMembroSelecionado(membroDestino);
    
    if (isMobile) setViewMode("chat");

    try {
      const res = await api.post("/conversas", {
        membros: [membroDestino.id]
      });

      // Captura o ID da conversa de forma robusta
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
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#FFFFFF", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─── SIDEBAR ESQUERDA ─── */}
      <Box sx={{
        width: isMobile ? "100%" : 360,
        display: isMobile && viewMode !== "list" ? "none" : "flex",
        flexDirection: "column",
        bgcolor: "#F8FAFC",
        borderRight: "1px solid #E2E8F0",
        height: "100%"
      }}>
        <Box sx={{ p: 4, pb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.35rem" }}>Mensagens</Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>WORKSPACE PREMIUM</Typography>
        </Box>

        <List sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
          {membros
            .filter((m) => Number(m.id) !== Number(meuMembroId))
            .map((m) => {
              const ativo = membroSelecionado?.id === m.id;
              return (
                <ListItemButton
                  key={m.id}
                  onClick={() => iniciarConversa(m)}
                  sx={{
                    borderRadius: "14px",
                    p: "12px 16px",
                    mb: 0.5,
                    backgroundColor: ativo ? "#0A46E4" : "transparent",
                    "&:hover": { backgroundColor: ativo ? "#0A46E4" : "rgba(15, 23, 42, 0.04)" },
                    transition: "0.2s"
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 58 }}>
                    <PremiumOnlineBadge overlap="circular" variant="dot">
                      <Avatar src={m.foto} sx={{ width: 42, height: 42 }} />
                    </PremiumOnlineBadge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: ativo ? 600 : 550, color: ativo ? "#FFFFFF" : "#0F172A" }}>{m.nome}</Typography>}
                    secondary={<Typography sx={{ fontSize: "0.8rem", color: ativo ? "rgba(255,255,255,0.75)" : "#64748B" }}>{m.email}</Typography>}
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>

      {/* ─── PAINEL DE CHAT DIREITO ─── */}
      <Box sx={{ flex: 1, display: isMobile && viewMode !== "chat" ? "none" : "flex", flexDirection: "column", bgcolor: "#FFFFFF" }}>
        
        {isMobile && viewMode === "chat" && (
          <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid #E2E8F0" }}>
            <IconButton onClick={() => setViewMode("list")}><ArrowBackIosNewIcon /></IconButton>
            <Typography sx={{ fontWeight: 700 }}>{membroSelecionado?.nome}</Typography>
          </Box>
        )}

        {conversaId ? (
          <ChatPage 
            key={conversaId} // Isso força a recarga do componente quando o ID muda
            conversaId={conversaId} 
            membroSelecionado={membroSelecionado} 
            meuMembroId={meuMembroId} 
          />
        ) : (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 4 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: "20px", bgcolor: "#F0F5FF", display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
              <ForumOutlinedIcon sx={{ fontSize: 26, color: "#0A46E4" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.15rem" }}>Comunicação Corporativa</Typography>
            <Typography sx={{ color: "#64748B", textAlign: "center", maxWidth: 300, mt: 1 }}>
              Selecione um membro para iniciar uma conversa.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}