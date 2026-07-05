import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Badge 
} from "@mui/material";

import {
  HomeRounded,
  EventNoteRounded,
  PeopleAltRounded,
  AccountBalanceWalletRounded,
  AssessmentRounded,
  PaidRounded,
  ReceiptLongRounded,
  BadgeRounded,
  SpaceDashboardRounded,
  ExpandLess,
  ExpandMore,
  ForumRounded, 
  LogoutRounded,
  SettingsRounded,
  HistoryEduRounded 
} from "@mui/icons-material";

import NotificationBell from "../components/Contador";
import UserBadge from "../components/UserMiniProfile";

import { Link, useNavigate, useLocation } from "react-router-dom";
import logoEclesia from "../assets/Logo-Eclesia.svg";
import api from "../api/axiosConfig";
import socket from "../api/socketConfig";

import { io } from "socket.io-client"; 

export default function NavbarDesktop() {
  const navigate = useNavigate();
  const location = useLocation();

  const SIDEBAR_WIDTH = 300;
  const TOPBAR_HEIGHT = 80;

  const [userRole, setUserRole] = useState(null);
  const [membro, setMembro] = useState(null);
  
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const [eventosOpen, setEventosOpen] = useState(false);
  const [membrosOpen, setMembrosOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosFinanceirosOpen, setRelatoriosFinanceirosOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/chat/list") {
      setUnreadMessagesCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/usuario/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.usuario) {
          setUserRole(res.data.usuario.funcao);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/meu-perfil");
        setMembro(res.data?.usuario?.membro);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerfil();
  }, []);

 


useEffect(() => {
  // Se o seu socketConfig não conecta automaticamente, você pode forçar a abertura/autenticação aqui:
  if (!socket.connected) {
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();
  }

  // Ouvir o evento global usando a instância importada padrão
  socket.on("global_new_message", (data) => {
    if (
      location.pathname !== "/chat/list" &&
      membro &&
      Number(data.MembroId) !== Number(membro.id)
    ) {
      setUnreadMessagesCount((prev) => prev + 1);
    }
  });

  // Limpeza do listener ao desmontar o componente
  return () => {
    socket.off("global_new_message");
  };
}, [location.pathname, membro]);



  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const membrosSubmenus = [
    { path: "/gestao-membros", label: "Relação de Membros", icon: <PeopleAltRounded /> },
    { path: "/cartao/membro", label: "Cartões de Membro", icon: <BadgeRounded /> },
    { path: "/gestao-cargos", label: "Ministérios & Cargos", icon: <BadgeRounded /> },
    { path: "/gestao-departamentos", label: "Departamentos Internos", icon: <BadgeRounded /> },
    { path: "/relatorios/sede", label: "Relatório Estatístico", icon: <AssessmentRounded /> },
  ];

  const financasSubmenus = [
    { path: "/salarios", label: "Folha de Pagamentos", icon: <PaidRounded /> },
    { path: "/gestao-contribuicoes", label: "Dízimos & Ofertas", icon: <AccountBalanceWalletRounded /> },
    { path: "/gestao-despesas", label: "Fluxo de Despesas", icon: <ReceiptLongRounded /> },
  ];

  const relatoriosFinanceirosSub = [
    { path: "/relatorios/contribuicoes", label: "Entradas por Período", icon: <AccountBalanceWalletRounded /> },
    { path: "/salarios", label: "Histórico Salarial", icon: <PaidRounded /> },
    { path: "/relatorios/despesas", label: "Saídas & Custos", icon: <ReceiptLongRounded /> },
    { path: "/relatorios/financeiro-geral", label: "Balanço Consolidado", icon: <AssessmentRounded /> },
  ];

  const isActived = (path) => location.pathname === path;

  return (
    <>
      {/* ================= TOPBAR PREMIUM ================= */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: `${SIDEBAR_WIDTH}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          background: "rgba(255, 255, 255, 0.85)",
          color: "#0F172A",
          borderBottom: "1px solid #E2E8F0",
          backdropFilter: "blur(12px)",
          zIndex: 1100,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${TOPBAR_HEIGHT}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {userRole === "admin" && <NotificationBell userRole={userRole} />}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserBadge membro={membro} />
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px` }} />

      {/* ================= SIDEBAR PREMIUM ================= */}
      <Box className="modern-sidebar">
        <style>{`
          .modern-sidebar {
            width: ${SIDEBAR_WIDTH}px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
            color: #F8FAFC;
            overflow-y: auto;
            font-family: 'Inter', sans-serif;
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 1200;
          }

          .modern-sidebar::-webkit-scrollbar {
            width: 4px;
          }

          .modern-sidebar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }

          .logo-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 35px 24px 25px 24px;
          }

          .logo-img {
            height: 65px;
            object-fit: contain;
            filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.15));
          }

          .system-tag {
            font-size: 11px;
            font-weight: 700;
            color: #38BDF8;
            letter-spacing: 2px;
            margin-top: 12px;
            text-transform: uppercase;
          }

          .menu-section-label {
            font-size: 11px;
            font-weight: 600;
            color: #64748B;
            letter-spacing: 1px;
            padding: 20px 28px 10px 28px;
            text-transform: uppercase;
          }

          .premium-btn {
            margin: 4px 18px;
            padding: 12px 16px;
            border-radius: 12px;
            color: #94A3B8;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .premium-btn:hover {
            background: rgba(255, 255, 255, 0.04);
            color: #F8FAFC;
          }

          .premium-btn.active-link {
            background: linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.03) 100%);
            color: #38BDF8;
            border-left: 4px solid #38BDF8;
            padding-left: 12px;
          }

          .peculiar-btn-culto {
            margin: 12px 18px;
            padding: 14px 16px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
            border: 1px dashed rgba(56, 189, 248, 0.3);
            color: #E2E8F0;
            transition: all 0.3s ease;
          }

          .peculiar-btn-culto:hover {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%);
            border: 1px solid #38BDF8;
            box-shadow: 0px 4px 12px rgba(56, 189, 248, 0.15);
            color: #FFFFFF;
          }

          .peculiar-btn-culto.active-link {
            background: linear-gradient(135deg, #2563EB 0%, #0284C7 100%);
            border: 1px solid #38BDF8;
            color: #FFFFFF !important;
            box-shadow: 0px 4px 15px rgba(37, 99, 235, 0.4);
          }

          .peculiar-btn-culto.active-link .MuiListItemIcon-root {
            color: #FFFFFF !important;
          }

          .peculiar-btn-culto .MuiListItemIcon-root {
            color: #38BDF8;
            min-width: 38px;
          }

          .peculiar-btn-culto:hover .MuiListItemIcon-root {
            color: #FFFFFF;
          }

          .premium-btn.active-link .MuiListItemIcon-root {
            color: #38BDF8;
          }

          .premium-btn .MuiListItemIcon-root {
            color: #64748B;
            min-width: 38px;
            transition: color 0.25s ease;
          }

          .premium-btn:hover .MuiListItemIcon-root {
            color: #F8FAFC;
          }

          .premium-btn .MuiTypography-root, .peculiar-btn-culto .MuiTypography-root {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.3px;
          }

          .premium-submenu-box {
            background: rgba(0, 0, 0, 0.15);
            margin: 2px 18px;
            border-radius: 12px;
            padding: 4px 0;
            border: 1px solid rgba(255, 255, 255, 0.02);
          }

          .premium-sub-btn {
            padding: 9px 16px 9px 42px;
            color: #64748B;
            border-radius: 8px;
            margin: 2px 8px;
            transition: all 0.2s ease;
          }

          .premium-sub-btn:hover {
            color: #F8FAFC;
            background: rgba(255, 255, 255, 0.02);
          }

          .premium-sub-btn.active-link {
            color: #38BDF8;
            background: rgba(56, 189, 248, 0.05);
          }

          .premium-sub-btn .MuiTypography-root {
            font-size: 13.5px;
            font-weight: 400;
          }

          .premium-deep-btn {
            padding: 8px 16px 8px 56px;
            color: #475569;
            border-radius: 6px;
            margin: 2px 8px;
            transition: all 0.2s ease;
          }

          .premium-deep-btn:hover {
            color: #F8FAFC;
          }

          .premium-deep-btn.active-link {
            color: #38BDF8;
          }

          .premium-deep-btn .MuiTypography-root {
            font-size: 13px;
          }

          .sidebar-divider {
            border-color: rgba(255, 255, 255, 0.04);
            margin: 15px 24px;
          }

          .logout-section {
            padding: 16px 18px;
            margin-top: auto;
          }

          .logout-btn {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            color: #EF4444;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            background: rgba(239, 68, 68, 0.08);
            color: #F87171;
          }

          .logout-btn .MuiListItemIcon-root {
            color: inherit;
            min-width: 38px;
          }
        `}</style>

        <Box>
          <Box className="logo-area">
            <img src={logoEclesia} className="logo-img" alt="Eclesia Logo" />
            <Typography className="system-tag">Gestão Eclesiástica</Typography>
          </Box>

          <Divider className="sidebar-divider" />

          <List sx={{ px: 0 }}>
            <Typography className="menu-section-label">Navegação Principal</Typography>

            <ListItemButton 
              component={Link} 
              to="/" 
              className={`premium-btn ${isActived("/") ? "active-link" : ""}`}
            >
              <Typography sx={{ display: 'none' }}>{userRole}</Typography>
              <ListItemIcon><HomeRounded /></ListItemIcon>
              <ListItemText primary="Início" />
            </ListItemButton>

            {/* 💬 COMUNICAÇÃO (USUARIO, ADMIN E MODERADOR) */}
            {(userRole === "admin" || userRole === "usuario" || userRole === "moderador") && (
              <ListItemButton 
                component={Link} 
                to="/chat/list" 
                className={`premium-btn ${isActived("/chat/list") ? "active-link" : ""}`}
              >
                <ListItemIcon>
                  <Badge 
                    badgeContent={unreadMessagesCount} 
                    color="error"
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        fontWeight: "bold"
                      }
                    }}
                  >
                    <ForumRounded />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Canal de Comunicação" />
              </ListItemButton>
            )}

            {/* 📜 ATA DO CULTO apontando para /listaCultos (ADMIN E MODERADOR) */}
            {(userRole === "admin" || userRole === "moderador") && (
              <ListItemButton 
                component={Link} 
                to="/lista-cultos" 
                className={`peculiar-btn-culto ${isActived("/lista-cultos") ? "active-link" : ""}`}
              >
                <ListItemIcon><HistoryEduRounded /></ListItemIcon>
                <ListItemText 
                  primary="Ata do Culto" 
                  primaryTypographyProps={{ sx: { fontWeight: '600 !important' } }}
                />
              </ListItemButton>
            )}

            {/* 🛡️ PAINEL ESTATÍSTICO (EXCLUSIVO ADMIN) */}
            {userRole === "admin" && (
              <ListItemButton 
                component={Link} 
                to="/dashboard" 
                className={`premium-btn ${isActived("/dashboard") ? "active-link" : ""}`}
              >
                <ListItemIcon><SpaceDashboardRounded /></ListItemIcon>
                <ListItemText primary="Painel Estatístico" />
              </ListItemButton>
            )}

            {/* 🌐 MENUS COMPARTILHADOS ENTRE ADMIN E MODERADOR (COM RESTRIÇÕES) */}
            {(userRole === "admin" || userRole === "moderador") && (
              <>
                <Typography className="menu-section-label">Módulos Administrativos</Typography>

                {/* EVENTOS (Condicional para Moderador não ver Relatório de Frequência) */}
                <ListItemButton 
                  onClick={() => setEventosOpen(!eventosOpen)} 
                  className={`premium-btn ${eventosOpen ? "menu-open" : ""}`}
                >
                  <ListItemIcon><EventNoteRounded /></ListItemIcon>
                  <ListItemText primary="Eventos & Cultos" />
                  {eventosOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </ListItemButton>

                <Collapse in={eventosOpen} timeout="auto" unmountOnExit>
                  <Box className="premium-submenu-box">
                    <ListItemButton
                      component={Link}
                      to="/lista-cultos"
                      className={`premium-sub-btn ${isActived("/lista-cultos") ? "active-link" : ""}`}
                    >
                      <ListItemText primary="Agenda de Cultos" />
                    </ListItemButton>

                    {/* Apenas Admin vê o Relatório de Frequência */}
                    {userRole === "admin" && (
                      <ListItemButton
                        component={Link}
                        to="/relatorios/presencas"
                        className={`premium-sub-btn ${isActived("/relatorios/presencas") ? "active-link" : ""}`}
                      >
                        <ListItemText primary="Relatório de Frequência" />
                      </ListItemButton>
                    )}
                  </Box>
                </Collapse>

                {/* SECRETARIA (Acesso Completo para Admin e Moderador) */}
                <ListItemButton 
                  onClick={() => setMembrosOpen(!membrosOpen)} 
                  className={`premium-btn ${membrosOpen ? "menu-open" : ""}`}
                >
                  <ListItemIcon><PeopleAltRounded /></ListItemIcon>
                  <ListItemText primary="Secretaria" />
                  {membrosOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </ListItemButton>

                <Collapse in={membrosOpen} timeout="auto" unmountOnExit>
                  <Box className="premium-submenu-box">
                    {membrosSubmenus.map((sub) => (
                      <ListItemButton
                        key={sub.path}
                        component={Link}
                        to={sub.path}
                        className={`premium-sub-btn ${isActived(sub.path) ? "active-link" : ""}`}
                      >
                        <ListItemText primary={sub.label} />
                      </ListItemButton>
                    ))}
                  </Box>
                </Collapse>
              </>
            )}

            {/* 💰 FINANÇAS (EXCLUSIVO ADMIN) */}
            {userRole === "admin" && (
              <>
                <ListItemButton 
                  onClick={() => setFinanceiroOpen(!financeiroOpen)} 
                  className={`premium-btn ${financeiroOpen ? "menu-open" : ""}`}
                >
                  <ListItemIcon><AccountBalanceWalletRounded /></ListItemIcon>
                  <ListItemText primary="Gestão Financeira" />
                  {financeiroOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </ListItemButton>

                <Collapse in={financeiroOpen} timeout="auto" unmountOnExit>
                  <Box className="premium-submenu-box">
                    {financasSubmenus.map((sub) => (
                      <ListItemButton
                        key={sub.path}
                        component={Link}
                        to={sub.path}
                        className={`premium-sub-btn ${isActived(sub.path) ? "active-link" : ""}`}
                      >
                        <ListItemText primary={sub.label} />
                      </ListItemButton>
                    ))}

                    <ListItemButton
                      onClick={() => setRelatoriosFinanceirosOpen(!relatoriosFinanceirosOpen)}
                      className="premium-sub-btn"
                      sx={{ color: relatoriosFinanceirosOpen ? "#38BDF8 !important" : "inherit" }}
                    >
                      <ListItemText primary="Relatórios de Auditoria" />
                      {relatoriosFinanceirosOpen ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                    </ListItemButton>

                    <Collapse in={relatoriosFinanceirosOpen} timeout="auto" unmountOnExit>
                      {relatoriosFinanceirosSub.map((deepSub) => (
                        <ListItemButton
                          key={deepSub.path}
                          component={Link}
                          to={deepSub.path}
                          className={`premium-deep-btn ${isActived(deepSub.path) ? "active-link" : ""}`}
                        >
                          <ListItemText primary={deepSub.label} />
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </Box>
                </Collapse>

                {/* ⚙️ CONFIGURAÇÕES DO SISTEMA (EXCLUSIVO ADMIN) */}
                <Typography className="menu-section-label">Sistema</Typography>
                <ListItemButton 
                  component={Link} 
                  to="/configuracoes" 
                  className={`premium-btn ${isActived("/configuracoes") ? "active-link" : ""}`}
                >
                  <ListItemIcon><SettingsRounded /></ListItemIcon>
                  <ListItemText primary="Configurações" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>

        <Box className="logout-section">
          <Divider className="sidebar-divider" sx={{ mb: 2, mx: 0 }} />
          <ListItemButton onClick={logout} className="logout-btn">
            <ListItemIcon><LogoutRounded sx={{ color: "inherit" }} /></ListItemIcon>
            <ListItemText primary="Encerrar Sessão" />
          </ListItemButton>
        </Box>
      </Box>
    </>
  );
}
