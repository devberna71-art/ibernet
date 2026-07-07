import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarDays,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Bell,
  CreditCard,
  UserCircle,
  Building2,
  ShieldCheck,
} from "lucide-react";
import logoEclesia from "../../assets/logo-ofi.png";
import {
  secretariaSubmenus,
  financasSubmenus,
  relatoriosSubmenus,
  cultosSubmenus,
  cultosModeradorSubmenus,
  platformSubmenus,
  SIDEBAR_WIDTH,
} from "../../navbar/navConfig";

/* ─── Role badge colors ────────────────────────────────────────────── */
const ROLE_META = {
  superadmin: { label: "Super Admin", color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
  super_admin: { label: "Super Admin", color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
  admin:      { label: "Administrador", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  moderador:  { label: "Moderador", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  usuario:    { label: "Membro", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
};

/* ─── Active state colors by role ──────────────────────────────────── */
const ACTIVE_CLASSES = {
  superadmin: "bg-violet-600 text-white shadow-md shadow-violet-600/10",
  super_admin: "bg-violet-600 text-white shadow-md shadow-violet-600/10",
  admin: "bg-blue-600 text-white shadow-md shadow-blue-600/10",
  moderador: "bg-amber-600 text-white shadow-md shadow-amber-600/10",
  usuario: "bg-emerald-600 text-white shadow-md shadow-emerald-600/10",
};

/* ─── NavItem ──────────────────────────────────────────────────────── */
function NavItem({ to, icon: Icon, label, active, badge, onClick, className = "", userRole = "admin" }) {
  const base = "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-all duration-150";
  
  const activeClass = ACTIVE_CLASSES[userRole] || ACTIVE_CLASSES.admin;
  const state = active
    ? activeClass
    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60";

  const content = (
    <>
      <span className="relative shrink-0">
        <Icon size={18} strokeWidth={1.75} />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="truncate">{label}</span>
    </>
  );

  const handleClick = (e) => {
    if (onClick) onClick();
    if (to) {
      console.log(`[Sidebar] Navegando para: ${to}`);
    }
  };

  if (to) {
    return (
      <Link to={to} className={`${base} ${state} ${className}`} onClick={handleClick}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={handleClick} className={`${base} ${state} w-[calc(100%-16px)] ${className}`}>
      {content}
    </button>
  );
}

/* ─── SubNavItem ───────────────────────────────────────────────────── */
function SubNavItem({ to, label, active, onClick, userRole = "admin" }) {
  const handleClick = () => {
    if (onClick) onClick();
    console.log(`[Sidebar] Navegando para submenu: ${to}`);
  };

  // Give active submenu item a colored indicator matching the role
  const activeIndicatorColor = 
    userRole === "super_admin" || userRole === "superadmin" ? "text-violet-400" :
    userRole === "moderador" ? "text-amber-400" :
    userRole === "usuario" ? "text-emerald-400" : "text-blue-400";

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={[
        "block py-2 pl-10 pr-3 mx-2 rounded-md text-xs font-medium transition-all duration-150",
        active
          ? `${activeIndicatorColor} font-semibold bg-slate-800`
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/* ─── CollapsibleSection ───────────────────────────────────────────── */
function CollapsibleSection({ label, icon: Icon, open, onToggle, children }) {
  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-2.5 mx-2 w-[calc(100%-16px)] rounded-md text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all duration-150"
      >
        <Icon size={18} strokeWidth={1.75} />
        <span className="flex-1 text-left truncate">{label}</span>
        {open ? <ChevronDown size={14} strokeWidth={2} /> : <ChevronRight size={14} strokeWidth={2} />}
      </button>
      {open && <div className="mt-1 mb-1 space-y-0.5 pl-1">{children}</div>}
    </div>
  );
}

/* ─── SectionLabel ─────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p className="px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR — menus dinâmicos por perfil
   Estilização Dark Premium (Slate)
   Unificado com o layout do Super Admin
═══════════════════════════════════════════════════════════════════ */
export default function Sidebar({
  userRole,
  membro,
  unreadMessagesCount = 0,
  onNavigate,
  onProfileClick,
  className = "",
}) {
  const location  = useLocation();
  const navigate  = useNavigate();

  const [cultosOpen,     setCultosOpen]     = useState(false);
  const [secretariaOpen, setSecretariaOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);
  const [platformOpen,   setPlatformOpen]   = useState(false);

  const isActive = (path) => location.pathname === path;
  const handleNav = () => onNavigate?.();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const roleMeta = ROLE_META[userRole] ?? { label: userRole, color: "bg-slate-800 text-slate-400 border border-slate-700/50" };

  /* ── Seleciona o menu correto por perfil ── */
  const isAdmin      = userRole === "admin";
  const isModerador  = userRole === "moderador";
  const isUsuario    = userRole === "usuario";
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";

  return (
    <aside
      className={[
        "fixed top-0 left-0 z-[1200] flex flex-col h-screen bg-slate-900 text-slate-100 font-sans border-r border-slate-800 overflow-hidden",
        className,
      ].join(" ")}
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* Header/Branding */}
      <div className="flex flex-col items-center px-6 pt-6 pb-4 shrink-0 gap-2">
        <img src={logoEclesia} alt="Eclesia Logo" className="h-16 object-contain filter brightness-110" />
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${roleMeta.color}`}>
          {isSuperAdmin && <ShieldCheck size={11} strokeWidth={2} className="shrink-0" />}
          {roleMeta.label}
        </span>
      </div>

      <div className="h-px bg-slate-800 mx-4 my-2 shrink-0" />

      {/* ── Navegação ── */}
      <nav className="flex-1 overflow-y-auto py-2 px-1 scrollbar-thin">

        {/* ════════ SUPER ADMIN ════════ */}
        {isSuperAdmin && (
          <>
            <SectionLabel>Plataforma</SectionLabel>
            <NavItem to="/super-admin" icon={LayoutDashboard} label="Painel" active={isActive("/super-admin")} onClick={handleNav} userRole={userRole} />
            <CollapsibleSection label="Igrejas" icon={Building2} open={platformOpen} onToggle={() => setPlatformOpen(!platformOpen)}>
              {platformSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>
            <SectionLabel>Sistema</SectionLabel>
            <NavItem to="/super-admin/configuracoes" icon={Settings} label="Configurações" active={isActive("/super-admin/configuracoes")} onClick={handleNav} userRole={userRole} />
          </>
        )}

        {/* ════════ ADMIN DA IGREJA ════════ */}
        {isAdmin && (
          <>
            <SectionLabel>Visão Geral</SectionLabel>
            <NavItem to="/dashboard"    icon={LayoutDashboard} label="Painel"         active={isActive("/dashboard")}    onClick={handleNav} userRole={userRole} />
            <NavItem to="/chat/list"    icon={MessageSquare}   label="Comunicação"     active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} userRole={userRole} />
            <NavItem to="/notificacoes" icon={Bell}            label="Notificações"    active={isActive("/notificacoes")} onClick={handleNav} userRole={userRole} />

            <SectionLabel>Igreja</SectionLabel>
            <CollapsibleSection label="Cultos & Eventos" icon={CalendarDays} open={cultosOpen} onToggle={() => setCultosOpen(!cultosOpen)}>
              {cultosSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Secretaria" icon={Users} open={secretariaOpen} onToggle={() => setSecretariaOpen(!secretariaOpen)}>
              {secretariaSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Finanças" icon={Wallet} open={financeiroOpen} onToggle={() => setFinanceiroOpen(!financeiroOpen)}>
              {financasSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Relatórios" icon={BarChart3} open={relatoriosOpen} onToggle={() => setRelatoriosOpen(!relatoriosOpen)}>
              {relatoriosSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>

            <SectionLabel>Sistema</SectionLabel>
            <NavItem to="/configuracoes" icon={Settings} label="Configurações" active={isActive("/configuracoes")} onClick={handleNav} userRole={userRole} />
          </>
        )}

        {/* ════════ MODERADOR ════════ */}
        {isModerador && (
          <>
            <SectionLabel>Visão Geral</SectionLabel>
            <NavItem to="/lista-cultos" icon={LayoutDashboard} label="Painel"       active={isActive("/lista-cultos")} onClick={handleNav} userRole={userRole} />
            <NavItem to="/chat/list"    icon={MessageSquare}   label="Comunicação"  active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} userRole={userRole} />
            <NavItem to="/notificacoes" icon={Bell}            label="Notificações" active={isActive("/notificacoes")} onClick={handleNav} userRole={userRole} />

            <SectionLabel>Operação</SectionLabel>
            <CollapsibleSection label="Cultos" icon={CalendarDays} open={cultosOpen} onToggle={() => setCultosOpen(!cultosOpen)}>
              {cultosModeradorSubmenus.map((s) => (
                <SubNavItem key={s.path} to={s.path} label={s.label} active={isActive(s.path)} onClick={handleNav} userRole={userRole} />
              ))}
            </CollapsibleSection>
            <NavItem to="/gestao-membros"     icon={Users}    label="Membros"   active={isActive("/gestao-membros")}     onClick={handleNav} userRole={userRole} />
            <NavItem to="/relatorios/presencas" icon={BarChart3} label="Presenças" active={isActive("/relatorios/presencas")} onClick={handleNav} userRole={userRole} />
          </>
        )}

        {/* ════════ MEMBRO (usuário) ════════ */}
        {isUsuario && (
          <>
            <SectionLabel>Minha Conta</SectionLabel>
            <NavItem to="/perfil"       icon={UserCircle}  label="Meu Perfil"      active={isActive("/perfil")}       onClick={handleNav} userRole={userRole} />
            <NavItem to="/cartao"       icon={CreditCard}  label="Cartão Digital"  active={isActive("/cartao")}       onClick={handleNav} userRole={userRole} />
            <NavItem to="/notificacoes" icon={Bell}        label="Notificações"    active={isActive("/notificacoes")} onClick={handleNav} userRole={userRole} />
            <NavItem to="/chat/list"    icon={MessageSquare} label="Comunicação"   active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} userRole={userRole} />
          </>
        )}
      </nav>

      {/* ── Rodapé: perfil do utilizador ── */}
      <div className="shrink-0 border-t border-slate-800 p-4 bg-slate-950/40">
        {membro ? (
          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-slate-800/60 transition-colors text-left"
          >
            <img
              src={
                membro.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=2563EB&color=ffffff&size=80`
              }
              alt={membro.nome}
              className="w-9 h-9 rounded-md object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{membro.nome}</p>
              <p className="text-[10px] text-slate-500 truncate">Ver perfil</p>
            </div>
            <ChevronDown size={14} strokeWidth={2} className="text-slate-500 shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Encerrar sessão</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export { SIDEBAR_WIDTH };
