import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";

import {
  Home,
  Event,
  People,
  AttachMoney,
  Assessment,
  AccountBalance,
  Receipt,
  Work,
  BarChart,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Build,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import NotificationBell from "../components/Contador";
import logoBernet from "../assets/Logo-Bernet.png";

export default function NavbarMobile({ userRole, toggleDrawer }) {
  // ================= STATES =================
  const [eventosOpen, setEventosOpen] = useState(false);
  const [membrosOpen, setMembrosOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosFinanceirosOpen, setRelatoriosFinanceirosOpen] = useState(false);

  // ================= SUBMENUS =================
  const eventosSubmenus = [
    { path: "/TabelaCulto", label: "Culto", icon: <Event /> },
    { path: "/gestao/RelatorioPresencas", label: "Relatório de Cultos", icon: <Assessment /> },
  ];

  const membrosSubmenus = [
    { path: "/gestao/membros", label: "Membros", icon: <People /> },
    { path: "/cartao/membro", label: "Cartões", icon: <People /> },
    { path: "/gestao/cargos", label: "Cargos", icon: <Work /> },
    { path: "/gestao/departamentos", label: "Departamentos", icon: <Work /> },
    { path: "/gestao/relatorioSede", label: "Relatório Estatístico dos Membros", icon: <People /> },
  ];

  const financasSubmenus = [
    { path: "/salarios", label: "Salários", icon: <AccountBalance /> },
    { path: "/gestao/contribuicoes", label: "Contribuições", icon: <AttachMoney /> },
    { path: "/gestao/despesas", label: "Despesas", icon: <Receipt /> },
  ];

  const relatoriosFinanceirosSub = [
    { path: "/gestao/relatorioContribuicoes", label: "Contribuições", icon: <AttachMoney /> },
    { path: "/tabelaSalarios", label: "Salários", icon: <AccountBalance /> },
    { path: "/gestao/relatorioDespesas", label: "Despesas", icon: <Receipt /> },
    { path: "/gestao/relatorioFinanceiroGeral", label: "Geral de contribuições", icon: <AccountBalance /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#1e3a8a",
        color: "white",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <List>

        {/* ================= LOGO (CORRIGIDO) ================= */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <Box
            component="img"
            src={logoBernet}
            alt="Logo Bernet"
            sx={{ height: 90 }}
          />
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

        {/* ================= HOME ================= */}
        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: "white" }}><Home /></ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem>

        {/* ================= SUPER ADMIN ================= */}
        {userRole === "super_admin" && (
          <ListItem button component={Link} to="/gestao/gestaoigrejas" onClick={toggleDrawer(false)}>
            <ListItemIcon sx={{ color: "white" }}><AccountBalance /></ListItemIcon>
            <ListItemText primary="Gerir Igrejas" />
          </ListItem>
        )}

        {/* ================= ADMIN ================= */}
        {userRole === "admin" && (
          <>
            <NotificationBell userRole={userRole} />

            <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: "white" }}><BarChart /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button component={Link} to="/listaCultos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: "white" }}><Event /></ListItemIcon>
              <ListItemText primary="Registrar Culto" />
            </ListItem>

            {/* ================= EVENTOS ================= */}
            <ListItem button onClick={() => setEventosOpen(!eventosOpen)}>
              <ListItemIcon sx={{ color: "white" }}><Event /></ListItemIcon>
              <ListItemText primary="Eventos" />
              {eventosOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={eventosOpen}>
              {eventosSubmenus.map((item) => (
                <ListItem
                  key={item.path}
                  button
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </Collapse>

            {/* ================= MEMBROS ================= */}
            <ListItem button onClick={() => setMembrosOpen(!membrosOpen)}>
              <ListItemIcon sx={{ color: "white" }}><People /></ListItemIcon>
              <ListItemText primary="Membros" />
              {membrosOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={membrosOpen}>
              {membrosSubmenus.map((item) => (
                <ListItem
                  key={item.path}
                  button
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </Collapse>

            {/* ================= FINANÇAS ================= */}
            <ListItem button onClick={() => setFinanceiroOpen(!financeiroOpen)}>
              <ListItemIcon sx={{ color: "white" }}><AttachMoney /></ListItemIcon>
              <ListItemText primary="Finanças" />
              {financeiroOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={financeiroOpen}>
              {financasSubmenus.map((item) => (
                <ListItem
                  key={item.path}
                  button
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}

              {/* ================= RELATÓRIOS ================= */}
              <ListItem
                button
                onClick={() => setRelatoriosFinanceirosOpen(!relatoriosFinanceirosOpen)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon sx={{ color: "white" }}><Assessment /></ListItemIcon>
                <ListItemText primary="Relatórios" />
                {relatoriosFinanceirosOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={relatoriosFinanceirosOpen}>
                {relatoriosFinanceirosSub.map((item) => (
                  <ListItem
                    key={item.path}
                    button
                    component={Link}
                    to={item.path}
                    onClick={toggleDrawer(false)}
                    sx={{ pl: 6 }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </Collapse>
            </Collapse>
          </>
        )}

        {/* ================= MEMBRO ================= */}
        {userRole === "membro" && (
          <>
            <ListItem button component={Link} to="/cadastro/membro" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: "white" }}><People /></ListItemIcon>
              <ListItemText primary="Cadastro" />
            </ListItem>

            <ListItem button component={Link} to="/perfil/membro" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: "white" }}><AccountCircle /></ListItemIcon>
              <ListItemText primary="Meu Perfil" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
}