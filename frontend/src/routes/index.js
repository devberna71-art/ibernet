import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';
import FullScreenLoader from '../components/FullScreenLoader';

/* =========================
   LAZY IMPORTS (Páginas)
========================= */
const Home = lazy(() => import('../pages/home'));
const Membros = lazy(() => import('../pages/membros'));
const Ministerios = lazy(() => import('../pages/ministerios'));
const Relatorios = lazy(() => import('../pages/relatorios'));
const Login = lazy(() => import('../pages/login'));
const GestaoMembros = lazy(() => import('../pages/GestaoMembros'));
const CriarUsuarios = lazy(() => import('../pages/criarUsuario'));
const GestaoCargos = lazy(() => import('../pages/GestaoCargos'));
const GestaoContribuicoes = lazy(() => import('../pages/GestaoContribuicoes'));
const GestaoDespesas = lazy(() => import('../pages/GestaoDespesas'));

const RelatorioContribuicoes = lazy(() => import('../pages/Relatrios/RelatorioContribuicoes'));
const RelatorioFinanceiroGeral = lazy(() => import('../pages/Relatrios/RelatorioFinanceiroGeral'));
const RelatorioMembros = lazy(() => import('../pages/Relatrios/RelatorioMembros'));
const RelatorioDespesa = lazy(() => import('../pages/Relatrios/RelatorioDespesa'));
const RelatorioPresencas = lazy(() => import('../pages/Relatrios/ReltorioPresencas'));
const RelatorioSede = lazy(() => import('../pages/Relatrios/RelatorioSede'));

const GestaoIgrejas = lazy(() => import('../pages/GestaoIgrejas'));
const ListaCultos = lazy(() => import('../pages/Cultos/ListaCultos'));
const GestaoDepartamento = lazy(() => import('../pages/GestaoDepartamentos'));
const Perfil = lazy(() => import('../pages/Perfil'));
const TabelaCulto = lazy(() => import('../pages/Cultos/GestaoCulto'));

const SobreEquipe = lazy(() => import('../components/SobreEquipe'));
const Planos = lazy(() => import('../components/Planos'));
const Testemunhos = lazy(() => import('../components/Testemunhos'));
const Contato = lazy(() => import('../components/Contato'));
const Servicos = lazy(() => import('../components/servicos'));

const Aniversarios = lazy(() => import('../pages/Notificacoes'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Salarios = lazy(() => import('../pages/Salarios'));
const TabelaSalarios = lazy(() => import('../components/TabelaSalarios'));

const CadastroMembros = lazy(() => import('../pages/CadastroMembro'));
const CriarContaMembro = lazy(() => import('../pages/CriarContaMembro'));
const PerfilMembro = lazy(() => import('../pages/PerfilMembro'));
const Cartao = lazy(() => import('../pages/Cartao'));

const ChatList = lazy(() => import('../pages/Chat/MembersChat'));
const ChatPage = lazy(() => import('../pages/Chat/ChatPage'));

/* =========================
   COMPONENTE DE REDIRECIONAMENTO (ROOT)
========================= */
function HomeRedirect() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.get('/usuario/status', { headers: { Authorization: `Bearer ${token}` } });
          setIsAuthenticated(true);
        } catch {
          setIsAuthenticated(false);
        }
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) return <FullScreenLoader isDone={false} />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />;
}

/* =========================
   AUTH WRAPPER
========================= */
function AuthWrapper({ children }) {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const verificarStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setIsAllowed(false); return; }
        await api.get('/usuario/status', { headers: { Authorization: `Bearer ${token}` } });
        setIsAllowed(true);
      } catch (err) {
        setIsAllowed(false);
      }
    };
    verificarStatus();
  }, []);

  if (isAllowed === null) return <FullScreenLoader isDone={false} />;
  if (!isAllowed) return <Navigate to="/login" replace />;
  return children;
}

/* =========================
   APP ROUTES
========================= */
export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<FullScreenLoader isDone={false} />}>
        <Routes>
          <Route element={<MainLayout />}>
            
            {/* Rota inicial inteligente */}
            <Route path="/" element={<HomeRedirect />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/criar-usuarios" element={<CriarUsuarios />} />
            <Route path="/sobre-equipe" element={<SobreEquipe />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/testemunhos" element={<Testemunhos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/salarios" element={<Salarios />} />
            <Route path="/tabelaSalarios" element={<TabelaSalarios />} />
            <Route path="/aniversarios" element={<Aniversarios />} />
            <Route path="/TabelaCulto" element={<TabelaCulto />} />
            <Route path="/cadastro/membro" element={<CadastroMembros />} />
            <Route path="/perfil/membro" element={<PerfilMembro />} />
            <Route path="/criar/conta/membro" element={<CriarContaMembro />} />
            <Route path="/cartao/membro" element={<Cartao />} />
            <Route path="/chat/list" element={<ChatList />} />
            <Route path="/chat/:id" element={<ChatPage />} />

            <Route element={<AuthWrapper><Outlet /></AuthWrapper>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/membros" element={<Membros />} />
              <Route path="/ministerios" element={<Ministerios />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/gestao/membros" element={<GestaoMembros />} />
              <Route path="/gestao/cargos" element={<GestaoCargos />} />
              <Route path="/gestao/contribuicoes" element={<GestaoContribuicoes />} />
              <Route path="/gestao/despesas" element={<GestaoDespesas />} />
              <Route path="/gestao/relatorioContribuicoes" element={<RelatorioContribuicoes />} />
              <Route path="/gestao/relatorioDespesas" element={<RelatorioDespesa />} />
              <Route path="/gestao/relatorioFinanceiroGeral" element={<RelatorioFinanceiroGeral />} />
              <Route path="/gestao/relatorioMembros" element={<RelatorioMembros />} />
              <Route path="/gestao/RelatorioPresencas" element={<RelatorioPresencas />} />
              <Route path="/gestao/relatorioSede" element={<RelatorioSede />} />
              <Route path="/listaCultos" element={<ListaCultos />} />
              <Route path="/gestao/departamentos" element={<GestaoDepartamento />} />
              <Route path="/gestao/gestaoigrejas" element={<GestaoIgrejas />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}