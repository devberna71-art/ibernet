import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/home';
import Login from '../pages/login';
import FullScreenLoader from '../components/FullScreenLoader';

/* ─── Lazy imports ─────────────────────────────────────────────────── */
const Dashboard            = lazy(() => import('../pages/Dashboard'));
const GestaoMembros        = lazy(() => import('../pages/GestaoMembros'));
const GestaoDespesas       = lazy(() => import('../pages/GestaoDespesas'));
const GestaoIgrejas        = lazy(() => import('../pages/GestaoIgrejas'));
const Configuracoes        = lazy(() => import('../pages/Configuracoes'));
const Perfil               = lazy(() => import('../pages/Perfil'));
const CriarUsuario         = lazy(() => import('../pages/criarUsuario'));
const GestaoContribuicoes  = lazy(() => import('../pages/GestaoContribuicoes'));
const GestaoDepartamentos  = lazy(() => import('../pages/GestaoDepartamentos'));
const CadastroMembro       = lazy(() => import('../pages/CadastroMembro'));
const Ministerios          = lazy(() => import('../pages/ministerios'));
const Notificacoes         = lazy(() => import('../pages/Notificacoes'));
const PerfilMembro         = lazy(() => import('../pages/PerfilMembro'));
const Cartao               = lazy(() => import('../pages/Cartao'));
const ChatPage             = lazy(() => import('../pages/Chat/ChatPage'));
const MembersChat          = lazy(() => import('../pages/Chat/MembersChat'));
const CriarContaMembro     = lazy(() => import('../pages/CriarContaMembro'));
const RelatorioDespesa     = lazy(() => import('../pages/Relatrios/RelatorioDespesa'));
const RelatorioSede        = lazy(() => import('../pages/Relatrios/RelatorioSede'));
const RelatorioMembros     = lazy(() => import('../pages/Relatrios/RelatorioMembros'));
const ReltorioPresencas    = lazy(() => import('../pages/Relatrios/ReltorioPresencas'));
const RelatorioFinanceiro  = lazy(() => import('../pages/Relatrios/RelatorioFinanceiroGeral'));
const RelatorioContrib     = lazy(() => import('../pages/Relatrios/RelatorioContribuicoes'));
const GestaoCargos         = lazy(() => import('../pages/GestaoCargos'));
const Salarios             = lazy(() => import('../pages/Salarios'));
const GestaoCulto          = lazy(() => import('../pages/Cultos/GestaoCulto'));
const ListaCultos          = lazy(() => import('../pages/Cultos/ListaCultos'));
const FormTipoCulto        = lazy(() => import('../components/FormTipoCulto'));
const CadastrarIgrejaDono  = lazy(() => import('../components/CadastrarIgrejaDono'));

/* ─── Super Admin lazy imports ─── */
const LayoutAdmin      = lazy(() => import('../layouts/LayoutAdmin'));
const DashboardGeral   = lazy(() => import('../pages/super-admin/DashboardGeral'));
const ListaIgrejas     = lazy(() => import('../pages/super-admin/ListaIgrejas'));
const DetalhesIgreja   = lazy(() => import('../pages/super-admin/DetalhesIgreja'));
const LogsSistema      = lazy(() => import('../pages/super-admin/LogsSistema'));
const ConfigGlobal     = lazy(() => import('../pages/super-admin/ConfigGlobal'));

/* ─── Loading fallback ─────────────────────────────────────────────── */
function LoadingFallback() {
  return <FullScreenLoader />;
}

/* ─── Guards ───────────────────────────────────────────────────────── */

/** Redireciona utilizadores não autenticados para /login */
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  console.log(`[RouteGuard] RequireAuth: isAuthenticated=${isAuthenticated}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/** Apenas para Admin e Super Admin — redireciona membros/moderadores */
function RequireAdmin({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  console.log(`[RouteGuard] RequireAdmin: isAuthenticated=${isAuthenticated}, role=${role}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin' && role !== 'superadmin' && role !== 'super_admin') return <Navigate to="/perfil" replace />;
  return children;
}

/** Apenas para Admin — redireciona os demais */
function RequireAdminOnly({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  console.log(`[RouteGuard] RequireAdminOnly: isAuthenticated=${isAuthenticated}, role=${role}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

/** Exclusivo para Super Admin */
function RequireSuperAdmin({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  console.log(`[RouteGuard] RequireSuperAdmin: isAuthenticated=${isAuthenticated}, role=${role}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'super_admin' && role !== 'superadmin') return <Navigate to="/dashboard" replace />;
  return children;
}

/** Admin OU Moderador */
function RequireAdminOrModerador({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  console.log(`[RouteGuard] RequireAdminOrModerador: isAuthenticated=${isAuthenticated}, role=${role}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin' && role !== 'moderador') return <Navigate to="/perfil" replace />;
  return children;
}

/** Rotas públicas — redireciona autenticados para o destino correto do seu perfil */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  console.log(`[RouteGuard] PublicOnlyRoute: isAuthenticated=${isAuthenticated}, role=${role}, loading=${loading}`);
  if (loading) return <LoadingFallback />;
  if (isAuthenticated) {
    if (role === 'usuario')   return <Navigate to="/perfil"      replace />;
    if (role === 'moderador') return <Navigate to="/lista-cultos" replace />;
    if (role === 'super_admin' || role === 'superadmin') return <Navigate to="/super-admin" replace />;
    // admin
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/* ─── Rotas ────────────────────────────────────────────────────────── */
function AppRoutes() {
  console.log('[AppRoutes] Rendering...');
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>

            {/* ── Públicas ── */}
            <Route path="/"               element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
            <Route path="/login"          element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/criar-usuarios" element={<PublicOnlyRoute><CriarUsuario /></PublicOnlyRoute>} />

            {/* ── Super Admin Portal ── */}
            <Route path="/super-admin" element={<RequireSuperAdmin><LayoutAdmin /></RequireSuperAdmin>}>
              <Route index element={<DashboardGeral />} />
              <Route path="igrejas" element={<ListaIgrejas />} />
              <Route path="igrejas/:id" element={<DetalhesIgreja />} />
              <Route path="auditoria" element={<LogsSistema />} />
              <Route path="configuracoes" element={<ConfigGlobal />} />
            </Route>

            {/* ── Protegidas (dentro do MainLayout) ── */}
            <Route element={<RequireAuth><MainLayout /></RequireAuth>}
            >

              {/* Dashboard — admin + superadmin */}
              <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />

              {/* Chat — todos os autenticados */}
              <Route path="/chat"                 element={<Navigate to="/chat/list" replace />} />
              <Route path="/chat/list"            element={<MembersChat />} />
              <Route path="/chat/members/:chatId" element={<MembersChat />} />

              {/* Notificações e Perfil — todos os autenticados */}
              <Route path="/notificacoes"     element={<Notificacoes />} />
              <Route path="/perfil"           element={<Perfil />} />
              <Route path="/cartao"           element={<Cartao />} />
              <Route path="/configuracoes"    element={<RequireAdmin><Configuracoes /></RequireAdmin>} />

              {/* Cultos — admin + moderador */}
              <Route path="/lista-cultos"    element={<RequireAdminOrModerador><ListaCultos /></RequireAdminOrModerador>} />
              <Route path="/gestao-culto"    element={<RequireAdminOrModerador><GestaoCulto /></RequireAdminOrModerador>} />
              <Route path="/form-tipo-culto" element={<RequireAdminOrModerador><FormTipoCulto /></RequireAdminOrModerador>} />

              {/* Membros — admin + moderador (moderador só leitura — controlado no componente) */}
              <Route path="/gestao-membros"    element={<RequireAdminOrModerador><GestaoMembros /></RequireAdminOrModerador>} />
              <Route path="/perfil-membro/:id" element={<RequireAdminOrModerador><PerfilMembro /></RequireAdminOrModerador>} />
              <Route path="/cadastro-membro"   element={<RequireAdminOnly><CadastroMembro /></RequireAdminOnly>} />

              {/* Relatórios — admin + moderador */}
              <Route path="/relatorios/membros"          element={<RequireAdminOrModerador><RelatorioMembros /></RequireAdminOrModerador>} />
              <Route path="/relatorios/presencas"        element={<RequireAdminOrModerador><ReltorioPresencas /></RequireAdminOrModerador>} />
              <Route path="/relatorios/despesas"         element={<RequireAdminOnly><RelatorioDespesa /></RequireAdminOnly>} />
              <Route path="/relatorios/sede"             element={<RequireAdminOnly><RelatorioSede /></RequireAdminOnly>} />
              <Route path="/relatorios/financeiro-geral" element={<RequireAdminOnly><RelatorioFinanceiro /></RequireAdminOnly>} />
              <Route path="/relatorios/contribuicoes"    element={<RequireAdminOnly><RelatorioContrib /></RequireAdminOnly>} />
              
              {/* Rotas legadas para compatibilidade com menus antigos */}
              <Route path="/gestao/relatorioContribuicoes" element={<RequireAdminOnly><RelatorioContrib /></RequireAdminOnly>} />
              <Route path="/gestao/relatorioDespesas"      element={<RequireAdminOnly><RelatorioDespesa /></RequireAdminOnly>} />
              <Route path="/gestao/relatorioFinanceiroGeral" element={<RequireAdminOnly><RelatorioFinanceiro /></RequireAdminOnly>} />
              <Route path="/gestao/relatorioSede"           element={<RequireAdminOnly><RelatorioSede /></RequireAdminOnly>} />
              <Route path="/gestao/RelatorioPresencas"     element={<RequireAdminOrModerador><ReltorioPresencas /></RequireAdminOrModerador>} />
              <Route path="/gestao/contribuicoes"           element={<RequireAdminOnly><GestaoContribuicoes /></RequireAdminOnly>} />
              <Route path="/gestao/despesas"                element={<RequireAdminOnly><GestaoDespesas /></RequireAdminOnly>} />
              <Route path="/gestao/membros"                 element={<RequireAdminOrModerador><GestaoMembros /></RequireAdminOrModerador>} />
              <Route path="/gestao/cargos"                  element={<RequireAdminOnly><GestaoCargos /></RequireAdminOnly>} />
              <Route path="/gestao/departamentos"           element={<RequireAdminOnly><GestaoDepartamentos /></RequireAdminOnly>} />
              <Route path="/TabelaCulto"                    element={<RequireAdminOrModerador><ListaCultos /></RequireAdminOrModerador>} />
              <Route path="/listaCultos"                    element={<RequireAdminOrModerador><ListaCultos /></RequireAdminOrModerador>} />
              <Route path="/gestao/gestaoigrejas"           element={<RequireSuperAdmin><GestaoIgrejas /></RequireSuperAdmin>} />

              {/* Finanças — admin apenas */}
              <Route path="/gestao-contribuicoes"  element={<RequireAdminOnly><GestaoContribuicoes /></RequireAdminOnly>} />
              <Route path="/gestao-despesas"       element={<RequireAdminOnly><GestaoDespesas /></RequireAdminOnly>} />
              <Route path="/salarios"              element={<RequireAdminOnly><Salarios /></RequireAdminOnly>} />
              <Route path="/tabelaSalarios"         element={<RequireAdminOnly><Salarios /></RequireAdminOnly>} />

              {/* Secretaria — admin apenas */}
              <Route path="/gestao-departamentos" element={<RequireAdminOnly><GestaoDepartamentos /></RequireAdminOnly>} />
              <Route path="/gestao-cargos"        element={<RequireAdminOnly><GestaoCargos /></RequireAdminOnly>} />
              <Route path="/ministerios"          element={<RequireAdminOnly><Ministerios /></RequireAdminOnly>} />
              <Route path="/cartao/membro"         element={<RequireAdminOnly><Cartao /></RequireAdminOnly>} />

              {/* Criar conta de membro — admin apenas */}
              <Route path="/criar-conta-membro" element={<RequireAdminOnly><CriarContaMembro /></RequireAdminOnly>} />

              {/* ── Super Admin — Plataforma ── */}
              <Route path="/gestao-igrejas"        element={<RequireSuperAdmin><GestaoIgrejas /></RequireSuperAdmin>} />
              <Route path="/cadastrar-igreja-dono" element={<RequireSuperAdmin><CadastrarIgrejaDono /></RequireSuperAdmin>} />

            </Route>

            {/* Fallback 404 → redireciona para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;