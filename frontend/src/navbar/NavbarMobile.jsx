import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography
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
  AccountCircleRounded,
  AdminPanelSettingsRounded
} from "@mui/icons-material";

import { Link, useLocation } from "react-router-dom";
import NotificationBell from "../components/Contador";
import logoBernet from "../assets/Logo-Bernet.png";

export default function NavbarMobile({ userRole, toggleDrawer }) {
  const location = useLocation();

  // ================= STATES =================
  const [eventosOpen, setEventosOpen] = useState(false);
  const [membrosOpen, setMembrosOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosFinanceirosOpen, setRelatoriosFinanceirosOpen] = useState(false);

  // Helper para verificar link ativo
  const isActived = (path) => location.pathname === path;

  // ================= SUBMENUS =================
  const eventosSubmenus = [
    { path: "/TabelaCulto", label: "Agenda de Cultos", icon: <EventNoteRounded /> },
    { path: "/gestao/RelatorioPresencas", label: "Relatório de Frequência", icon: <AssessmentRounded /> },
  ];

  const membrosSubmenus = [
    { path: "/gestao/membros", label: "Relação de Membros", icon: <PeopleAltRounded /> },
    { path: "/cartao/membro", label: "Cartões de Membro", icon: <BadgeRounded /> },
    { path: "/gestao/cargos", label: "Ministérios & Cargos", icon: <BadgeRounded /> },
    { path: "/gestao/departamentos", label: "Departamentos Internos", icon: <BadgeRounded /> },
    { path: "/gestao/relatorioSede", label: "Relatório Estatístico", icon: <AssessmentRounded /> },
  ];

  const financasSubmenus = [
    { path: "/salarios", label: "Folha de Pagamentos", icon: <PaidRounded /> },
    { path: "/gestao/contribuicoes", label: "Dízimos & Ofertas", icon: <AccountBalanceWalletRounded /> },
    { path: "/gestao/despesas", label: "Fluxo de Despesas", icon: <ReceiptLongRounded /> },
  ];

  const relatoriosFinanceirosSub = [
    { path: "/gestao/relatorioContribuicoes", label: "Entradas por Período", icon: <AccountBalanceWalletRounded /> },
    { path: "/tabelaSalarios", label: "Histórico Salarial", icon: <PaidRounded /> },
    { path: "/gestao/relatorioDespesas", label: "Saídas & Custos", icon: <ReceiptLongRounded /> },
    { path: "/gestao/relatorioFinanceiroGeral", label: "Balanço Consolidado", icon: <AssessmentRounded /> },
  ];

  return (
    <Box className="modern-sidebar-mobile">
      <style>{`
        .modern-sidebar-mobile {
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
          color: #F8FAFC;
          overflow-y: auto;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .modern-sidebar-mobile::-webkit-scrollbar {
          width: 4px;
        }

        .modern-sidebar-mobile::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .logo-area-mobile {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 25px 20px 20px 20px;
        }

        .logo-img-mobile {
          height: 55px;
          object-fit: contain;
          filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.15));
        }

        .system-tag-mobile {
          font-size: 10px;
          font-weight: 700;
          color: #38BDF8;
          letter-spacing: 2px;
          margin-top: 10px;
          text-transform: uppercase;
        }

        .menu-section-label-mobile {
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
          letter-spacing: 1px;
          padding: 15px 24px 5px 24px;
          text-transform: uppercase;
        }

        .premium-btn-mobile {
          margin: 4px 14px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #94A3B8;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-btn-mobile:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #F8FAFC;
        }

        .premium-btn-mobile.active-link {
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.03) 100%);
          color: #38BDF8;
          border-left: 4px solid #38BDF8;
          padding-left: 10px;
        }

        .premium-btn-mobile.active-link .MuiListItemIcon-root {
          color: #38BDF8;
        }

        .premium-btn-mobile .MuiListItemIcon-root {
          color: #64748B;
          min-width: 34px;
          transition: color 0.25s ease;
        }

        .premium-btn-mobile .MuiListItemIcon-root svg {
          font-size: 22px;
        }

        .premium-btn-mobile:hover .MuiListItemIcon-root {
          color: #F8FAFC;
        }

        .premium-btn-mobile .MuiTypography-root {
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .premium-submenu-box-mobile {
          background: rgba(0, 0, 0, 0.15);
          margin: 2px 14px;
          border-radius: 10px;
          padding: 4px 0;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .premium-sub-btn-mobile {
          padding: 8px 14px 8px 36px;
          color: #64748B;
          border-radius: 8px;
          margin: 2px 6px;
          transition: all 0.2s ease;
        }

        .premium-sub-btn-mobile:hover {
          color: #F8FAFC;
          background: rgba(255, 255, 255, 0.02);
        }

        .premium-sub-btn-mobile.active-link {
          color: #38BDF8;
          background: rgba(56, 189, 248, 0.05);
        }

        .premium-sub-btn-mobile .MuiTypography-root {
          font-size: 13px;
          font-weight: 400;
        }

        .premium-deep-btn-mobile {
          padding: 7px 14px 7px 48px;
          color: #475569;
          border-radius: 6px;
          margin: 2px 6px;
          transition: all 0.2s ease;
        }

        .premium-deep-btn-mobile:hover {
          color: #F8FAFC;
        }

        .premium-deep-btn-mobile.active-link {
          color: #38BDF8;
        }

        .premium-deep-btn-mobile .MuiTypography-root {
          font-size: 12.5px;
        }

        .sidebar-divider-mobile {
          border-color: rgba(255, 255, 255, 0.04);
          margin: 10px 20px;
        }
      `}</style>

      <Box>
        {/* ================= LOGO AREA ================= */}
        <Box className="logo-area-mobile">
          <img src={logoBernet} className="logo-img-mobile" alt="Logo Bernet" />
          <Typography className="system-tag-mobile">Gestão Eclesiástica</Typography>
        </Box>

        <Divider className="sidebar-divider-mobile" />

        <List sx={{ px: 0 }}>
          <Typography className="menu-section-label-mobile">Navegação Principal</Typography>

          {/* ================= HOME ================= */}
          <ListItemButton
            component={Link}
            to="/"
            onClick={toggleDrawer(false)}
            className={`premium-btn-mobile ${isActived("/") ? "active-link" : ""}`}
          >
            <ListItemIcon><HomeRounded /></ListItemIcon>
            <ListItemText primary="Início" />
          </ListItemButton>

          {/* ================= SUPER ADMIN ================= */}
          {userRole === "super_admin" && (
            <ListItemButton
              component={Link}
              to="/gestao/gestaoigrejas"
              onClick={toggleDrawer(false)}
              className={`premium-btn-mobile ${isActived("/gestao/gestaoigrejas") ? "active-link" : ""}`}
            >
              <ListItemIcon><AdminPanelSettingsRounded /></ListItemIcon>
              <ListItemText primary="Gerir Igrejas" />
            </ListItemButton>
          )}

          {/* ================= ADMIN MÓDULOS ================= */}
          {userRole === "admin" && (
            <>
              <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center" }}>
                <NotificationBell userRole={userRole} />
              </Box>

              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={toggleDrawer(false)}
                className={`premium-btn-mobile ${isActived("/dashboard") ? "active-link" : ""}`}
              >
                <ListItemIcon><SpaceDashboardRounded /></ListItemIcon>
                <ListItemText primary="Painel Estatístico" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/listaCultos"
                onClick={toggleDrawer(false)}
                className={`premium-btn-mobile ${isActived("/listaCultos") ? "active-link" : ""}`}
              >
                <ListItemIcon><EventNoteRounded /></ListItemIcon>
                <ListItemText primary="Registrar Culto" />
              </ListItemButton>

              <Typography className="menu-section-label-mobile">Módulos Administrativos</Typography>

              {/* EVENTOS */}
              <ListItemButton
                onClick={() => setEventosOpen(!eventosOpen)}
                className="premium-btn-mobile"
              >
                <ListItemIcon><EventNoteRounded /></ListItemIcon>
                <ListItemText primary="Eventos & Cultos" />
                {eventosOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>

              <Collapse in={eventosOpen} timeout="auto" unmountOnExit>
                <Box className="premium-submenu-box-mobile">
                  {eventosSubmenus.map((sub) => (
                    <ListItemButton
                      key={sub.path}
                      component={Link}
                      to={sub.path}
                      onClick={toggleDrawer(false)}
                      className={`premium-sub-btn-mobile ${isActived(sub.path) ? "active-link" : ""}`}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  ))}
                </Box>
              </Collapse>

              {/* MEMBROS */}
              <ListItemButton
                onClick={() => setMembrosOpen(!membrosOpen)}
                className="premium-btn-mobile"
              >
                <ListItemIcon><PeopleAltRounded /></ListItemIcon>
                <ListItemText primary="Secretaria" />
                {membrosOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>

              <Collapse in={membrosOpen} timeout="auto" unmountOnExit>
                <Box className="premium-submenu-box-mobile">
                  {membrosSubmenus.map((sub) => (
                    <ListItemButton
                      key={sub.path}
                      component={Link}
                      to={sub.path}
                      onClick={toggleDrawer(false)}
                      className={`premium-sub-btn-mobile ${isActived(sub.path) ? "active-link" : ""}`}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  ))}
                </Box>
              </Collapse>

              {/* FINANÇAS */}
              <ListItemButton
                onClick={() => setFinanceiroOpen(!financeiroOpen)}
                className="premium-btn-mobile"
              >
                <ListItemIcon><AccountBalanceWalletRounded /></ListItemIcon>
                <ListItemText primary="Gestão Financeira" />
                {financeiroOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </ListItemButton>

              <Collapse in={financeiroOpen} timeout="auto" unmountOnExit>
                <Box className="premium-submenu-box-mobile">
                  {financasSubmenus.map((sub) => (
                    <ListItemButton
                      key={sub.path}
                      component={Link}
                      to={sub.path}
                      onClick={toggleDrawer(false)}
                      className={`premium-sub-btn-mobile ${isActived(sub.path) ? "active-link" : ""}`}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  ))}

                  <ListItemButton
                    onClick={() => setRelatoriosFinanceirosOpen(!relatoriosFinanceirosOpen)}
                    className="premium-sub-btn-mobile"
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
                        onClick={toggleDrawer(false)}
                        className={`premium-deep-btn-mobile ${isActived(deepSub.path) ? "active-link" : ""}`}
                      >
                        <ListItemText primary={deepSub.label} />
                      </ListItemButton>
                    ))}
                  </Collapse>
                </Box>
              </Collapse>
            </>
          )}

          {/* ================= MEMBRO ================= */}
          {userRole === "membro" && (
            <>
              <Typography className="menu-section-label-mobile">Área do Membro</Typography>
              
              <ListItemButton
                component={Link}
                to="/cadastro/membro"
                onClick={toggleDrawer(false)}
                className={`premium-btn-mobile ${isActived("/cadastro/membro") ? "active-link" : ""}`}
              >
                <ListItemIcon><PeopleAltRounded /></ListItemIcon>
                <ListItemText primary="Cadastro" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/perfil/membro"
                onClick={toggleDrawer(false)}
                className={`premium-btn-mobile ${isActived("/perfil/membro") ? "active-link" : ""}`}
              >
                <ListItemIcon><AccountCircleRounded /></ListItemIcon>
                <ListItemText primary="Meu Perfil" />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Box>
  );
}