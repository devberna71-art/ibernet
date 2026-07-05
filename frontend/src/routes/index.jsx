import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/home';
import Login from '../pages/login';
import FullScreenLoader from '../components/FullScreenLoader';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const GestaoMembros = lazy(() => import('../pages/GestaoMembros'));
const GestaoDespesas = lazy(() => import('../pages/GestaoDespesas'));
const GestaoIgrejas = lazy(() => import('../pages/GestaoIgrejas'));
const Configuracoes = lazy(() => import('../pages/Configuracoes'));
const Perfil = lazy(() => import('../pages/Perfil'));
const CriarUsuario = lazy(() => import('../pages/criarUsuario'));
const GestaoContribuicoes = lazy(() => import('../pages/GestaoContribuicoes'));
const GestaoDepartamentos = lazy(() => import('../pages/GestaoDepartamentos'));
const CadastroMembro = lazy(() => import('../pages/CadastroMembro'));
const Ministerios = lazy(() => import('../pages/ministerios'));
const Notificacoes = lazy(() => import('../pages/Notificacoes'));
const PerfilMembro = lazy(() => import('../pages/PerfilMembro'));
const Cartao = lazy(() => import('../pages/Cartao'));
const ChatPage = lazy(() => import('../pages/Chat/ChatPage'));
const MembersChat = lazy(() => import('../pages/Chat/MembersChat'));
const CriarContaMembro = lazy(() => import('../pages/CriarContaMembro'));
const Relatorios = lazy(() => import('../pages/relatorios'));
const RelatorioDespesa = lazy(() => import('../pages/Relatrios/RelatorioDespesa'));
const RelatorioSede = lazy(() => import('../pages/Relatrios/RelatorioSede'));
const RelatorioMembros = lazy(() => import('../pages/Relatrios/RelatorioMembros'));
const ReltorioPresencas = lazy(() => import('../pages/Relatrios/ReltorioPresencas'));
const RelatorioFinanceiroGeral = lazy(() => import('../pages/Relatrios/RelatorioFinanceiroGeral'));
const RelatorioContribuicoes = lazy(() => import('../pages/Relatrios/RelatorioContribuicoes'));
const GestaoCargos = lazy(() => import('../pages/GestaoCargos'));
const Salarios = lazy(() => import('../pages/Salarios'));
const GestaoCulto = lazy(() => import('../pages/Cultos/GestaoCulto'));
const ListaCultos = lazy(() => import('../pages/Cultos/ListaCultos'));
const FormTipoCulto = lazy(() => import('../components/FormTipoCulto'));
const CadastrarIgrejaDono = lazy(() => import('../components/CadastrarIgrejaDono'));

function LoadingFallback() {
  return <FullScreenLoader />;
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/criar-usuarios" element={<PublicOnlyRoute><CriarUsuario /></PublicOnlyRoute>} />

            <Route path="/" element={<Home />} />

            <Route element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/chat/list"
                element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
              />
              <Route
                path="/chat/members/:chatId"
                element={<ProtectedRoute><MembersChat /></ProtectedRoute>}
              />

              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/gestao-igrejas" element={<GestaoIgrejas />} />
                <Route path="/gestao-membros" element={<GestaoMembros />} />
                <Route path="/gestao-despesas" element={<GestaoDespesas />} />
                <Route path="/gestao-contribuicoes" element={<GestaoContribuicoes />} />
                <Route path="/gestao-departamentos" element={<GestaoDepartamentos />} />
                <Route path="/gestao-cargos" element={<GestaoCargos />} />
                <Route path="/cadastrar-igreja-dono" element={<CadastrarIgrejaDono />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/criar-conta-membro" element={<CriarContaMembro />} />
                <Route path="/cadastro-membro" element={<CadastroMembro />} />
                <Route path="/ministerios" element={<Ministerios />} />
                <Route path="/notificacoes" element={<Notificacoes />} />
                <Route path="/perfil-membro/:id" element={<PerfilMembro />} />
                <Route path="/cartao" element={<Cartao />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/relatorios/despesas" element={<RelatorioDespesa />} />
                <Route path="/relatorios/sede" element={<RelatorioSede />} />
                <Route path="/relatorios/membros" element={<RelatorioMembros />} />
                <Route path="/relatorios/presencas" element={<ReltorioPresencas />} />
                <Route path="/relatorios/financeiro-geral" element={<RelatorioFinanceiroGeral />} />
                <Route path="/relatorios/contribuicoes" element={<RelatorioContribuicoes />} />
                <Route path="/salarios" element={<Salarios />} />
                <Route path="/gestao-culto" element={<GestaoCulto />} />
                <Route path="/lista-cultos" element={<ListaCultos />} />
                <Route path="/form-tipo-culto" element={<FormTipoCulto />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;