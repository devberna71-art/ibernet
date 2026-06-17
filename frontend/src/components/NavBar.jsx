// pages/Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  Collapse,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Login as LoginIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Work as WorkIcon,
  AccountCircle as AccountCircleIcon,
  Build as BuildIcon,
  ExpandLess,
  ExpandMore,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import api from '../api/axiosConfig';
import logoBernet from "../assets/Logo-Bernet.png";
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // <- adicione esta linha
// ✅ Import do novo componente
import NotificationBell from './Contador';

import UserBadge from './UserMiniProfile';

import AssignmentIcon from '@mui/icons-material/Assignment'; // ícone para Compromisso Pastoral


export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  
  // Mobile submenus
const [gestaoOpenMobile, setGestaoOpenMobile] = useState(false);
const [relatoriosOpenMobile, setRelatoriosOpenMobile] = useState(false);
const [financeiroOpenMobile, setFinanceiroOpenMobile] = useState(false);
const [administrativoOpenMobile, setAdministrativoOpenMobile] = useState(false);
const [userOpenMobile, setUserOpenMobile] = useState(false);
const [membrosOpenMobile, setMembrosOpenMobile] = useState(false); // ✅ ADICIONADO

// Desktop anchors
const [gestaoAnchor, setGestaoAnchor] = useState(null);
const [relatoriosAnchor, setRelatoriosAnchor] = useState(null);
const [financeiroAnchor, setFinanceiroAnchor] = useState(null);
const [administrativoAnchor, setAdministrativoAnchor] = useState(null);
const [userAnchor, setUserAnchor] = useState(null);
const [membrosAnchor, setMembrosAnchor] = useState(null); // ✅ ADICIONADO

const isLogged = Boolean(userRole);

  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // ===== NOVOS MENUS =====

// EVENTOS
const eventosSubmenus = [
  { path: '/TabelaCulto', label: 'Culto', icon: <EventIcon /> },
  
  { path: '/gestao/RelatorioPresencas', label: 'Relatório de Cultos', icon: <AssessmentIcon /> }, 
 
];


// MEMBROS
const membrosSubmenus = [
  { path: '/gestao/membros', label: 'Membros', icon: <PeopleIcon /> },
  { path: '/cartao/membro', label: 'Cartões', icon: <PeopleIcon /> },
  { path: '/gestao/cargos', label: 'Cargos', icon: <WorkIcon /> },
  { path: '/gestao/departamentos', label: 'Departamentos', icon: <WorkIcon /> },
  { path: '/gestao/relatorioSede', label: 'Relatório Estatístico dos Membros', icon: <PeopleIcon /> },
];


// FINANÇAS
const financasSubmenus = [
  { path: '/salarios', label: 'Salários', icon: <AssignmentIcon /> },
  { path: '/gestao/contribuicoes', label: 'Contribuições', icon: <AttachMoneyIcon /> },
  { path: '/gestao/despesas', label: 'Despesas', icon: <ReceiptIcon /> },
];

// Submenus de relatórios dentro de Finanças
const relatoriosFinanceirosSub = [
  { path: '/gestao/relatorioContribuicoes', label: 'Contribuições', icon: <AttachMoneyIcon /> },
  { path: '/tabelaSalarios', label: 'Salários', icon: <AccountBalanceIcon /> },
  { path: '/gestao/relatorioDespesas', label: 'Despesas', icon: <ReceiptIcon /> },
  { path: '/gestao/relatorioFinanceiroGeral', label: 'Geral de contribuições', icon: <AccountBalanceIcon /> },
];




  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/usuario/status', { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.usuario) setUserRole(res.data.usuario.funcao);
      } catch (err) {
        console.error('Erro ao buscar função do usuário:', err);
      }
    };
    fetchUserRole();
  }, []);


  const [membro, setMembro] = useState(null);

useEffect(() => {
  const fetchPerfil = async () => {
    try {
      const res = await api.get('/meu-perfil');
      setMembro(res.data.usuario.membro);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPerfil();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/login');
  };

  const handleOpenMenu = (setter) => (event) => setter(event.currentTarget);
  const handleCloseMenu = (setter) => () => setter(null);

  const drawerList = (
    <Box
    sx={{
      width: 260,
      bgcolor: '#1e3a8a',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto', // permite rolagem se tiver muitos itens
    }}
    role="presentation"
  >
    <List
      sx={{
        '& .MuiListItem-root': { color: 'white' },
        '& .MuiCollapse-root': { bgcolor: '#1e3a8a' }, // mantém o fundo azul nos submenus
        '& .MuiList-root': { bgcolor: '#1e3a8a' },     // força fundo azul nas listas internas
      }}
    ></List>
      <List>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <Box component="img" src={logoBernet} alt="Logo Bernet" sx={{ height: 100 }} />
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.4)', mb: 1 }} />

        


        {/* Menus visitantes */}
        {!userRole && (
          <>
         <ListItem sx={{ padding: 0 }}>
 

<ListItem sx={{ padding: 0 }}>
  <Button
    component={Link}
    to="/criar/conta/membro"
    onClick={toggleDrawer(false)}
    sx={{
      width: '100%',
      background: 'linear-gradient(135deg, #5CC8FF, #4A90E2)', // azul bebê forte
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.05rem',
      borderRadius: 5,
      paddingY: 1.5,
      textTransform: 'none',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, #4A90E2, #5CC8FF)',
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
      },
    }}
  >
    Criar conta de Membro
  </Button>
</ListItem>
</ListItem>
            <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
              <ListItemText primary="Início" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/sobre-equipe" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Sobre a Equipe" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/planos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="Planos" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/testemunhos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Testemunhos" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/contato" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><WorkIcon /></ListItemIcon>
              <ListItemText primary="Contato" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/servicos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><BuildIcon /></ListItemIcon>
              <ListItemText primary="Serviços" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/login" sx={{ bgcolor: '#ff9800', borderRadius: 2, my: 1 }} onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Login" sx={{ color: 'white', fontWeight: 'bold' }} />
            </ListItem>
           
          </>
        )}

        {/* Menus usuários logados */}
       {userRole && (
  <>
    {/* Super admin */}
    {userRole === 'super_admin' && (
      <>
        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Início" sx={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/gestao/gestaoigrejas" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
          <ListItemText primary="Gerir Igrejas" sx={{ color: 'white' }} />
        </ListItem>

       
        
      </>
    )}

    {/* Admin */}
    {userRole === 'admin' && (
      <>
        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Início" sx={{ color: 'white' }} />
        </ListItem>
        <NotificationBell userRole={userRole} />

        <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: 'white' }}><BarChartIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
        </ListItem>

        <ListItem button component={Link} to="/listaCultos" sx={{ bgcolor: '#ff4081', borderRadius: 2, my: 1 }}>
          <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
          <ListItemText primary="Registrar Culto" sx={{ color: 'white', fontWeight: 'bold' }} />
        </ListItem>

        <ListItem button onClick={() => setGestaoOpenMobile(!gestaoOpenMobile)}>
          <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
          <ListItemText primary="Eventos" sx={{ color: 'white' }} />
          {gestaoOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItem>
        <Collapse in={gestaoOpenMobile} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {eventosSubmenus.map((submenu) => (
              <ListItem
                button
                component={Link}
                to={submenu.path}
                key={submenu.path}
                sx={{ pl: 4 }}
                onClick={toggleDrawer(false)}
              >
                <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem button onClick={() => setMembrosOpenMobile(!membrosOpenMobile)}>
          <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Membros" sx={{ color: 'white' }} />
          {membrosOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItem>
        <Collapse in={membrosOpenMobile} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {membrosSubmenus.map((submenu) => (
              <ListItem
                button
                component={Link}
                to={submenu.path}
                key={submenu.path}
                sx={{ pl: 4 }}
                onClick={toggleDrawer(false)}
              >
                <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem button onClick={() => setFinanceiroOpenMobile(!financeiroOpenMobile)}>
          <ListItemIcon sx={{ color: 'white' }}><AttachMoneyIcon /></ListItemIcon>
          <ListItemText primary="Finanças" sx={{ color: 'white' }} />
          {financeiroOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItem>
        <Collapse in={financeiroOpenMobile} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {financasSubmenus.map((submenu) => (
              <ListItem
                button
                component={Link}
                to={submenu.path}
                key={submenu.path}
                sx={{ pl: 4 }}
                onClick={toggleDrawer(false)}
              >
                <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
              </ListItem>
            ))}

            <ListItem button onClick={() => setRelatoriosOpenMobile(!relatoriosOpenMobile)} sx={{ pl: 4 }}>
              <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Relatórios" sx={{ color: 'white' }} />
              {relatoriosOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
            </ListItem>
            <Collapse in={relatoriosOpenMobile} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {relatoriosFinanceirosSub.map((submenu) => (
                  <ListItem
                    button
                    component={Link}
                    to={submenu.path}
                    key={submenu.path}
                    sx={{ pl: 8 }}
                    onClick={toggleDrawer(false)}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                    <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Collapse>

        
        
      </>
    )}

    {/* Membro */}
    {userRole === 'membro' && (
  <>
    <Button component={Link} to="/cadastro/membro" startIcon={<PeopleIcon />} sx={{ mx: 1, color: 'white' }}>Cadastro</Button>
    <Button component={Link} to="/perfil/membro" startIcon={<AccountCircleIcon />} sx={{ mx: 1, color: 'white' }}>Meu Perfil</Button>
  </>
)}

  </>
)}

      </List>
    </Box>
  );

  return (
    <>
    
     {(!userRole || isMobile) && (
  <AppBar
    position="fixed"
    sx={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)',
    }}
  >
    <Toolbar>
      {isMobile && (
        <IconButton onClick={toggleDrawer(true)} color="inherit">
          <MenuIcon />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Box
          component="img"
          src={logoBernet}
          sx={{ height: { xs: 80, md: 120 } }}
        />
      </Box>

      {isMobile && userRole && (
        <UserBadge membro={membro} />
      )}
    </Toolbar>
  </AppBar>
)}

{userRole && !isMobile && (
  <Drawer
    variant="permanent"
    sx={{
      width: 260,
      '& .MuiDrawer-paper': {
        width: 260,
        bgcolor: '#1e3a8a',
        color: 'white',
      },
    }}
  >
    {drawerList}
  </Drawer>
)}


      <Toolbar />
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
}

