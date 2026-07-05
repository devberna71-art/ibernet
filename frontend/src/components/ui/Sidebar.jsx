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
  Cross,
} from "lucide-react";
import logoEclesia from "../../assets/Logo-Eclesia.svg";
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
  superadmin: { label: "Super Admin", color: "bg-violet-100 text-violet-700" },
  super_admin: { label: "Super Admin", color: "bg-violet-100 text-violet-700" },
  admin:      { label: "Administrador", color: "bg-primarySoft text-primary" },
  moderador:  { label: "Moderador", color: "bg-amber-100 text-amber-700" },
  usuario:    { label: "Membro", color: "bg-green-100 text-green-700" },
};

/* ─── NavItem ──────────────────────────────────────────────────────── */
function NavItem({ to, icon: Icon, label, active, badge, onClick, className = "" }) {
  const base = "flex items-center gap-2.5 px-3 py-2 mx-2 rounded-sm text-body font-medium transition-colors duration-150";
  const state = active
    ? "bg-primarySoft text-primary"
    : "text-textMuted hover:text-text hover:bg-bgSection";

  const content = (
    <>
      <span className="relative shrink-0">
        <Icon size={16} strokeWidth={1.75} />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-danger text-white text-[9px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="truncate text-[13px]">{label}</span>
    </>
  );

  const handleClick = (e) => {
    if (onClick) onClick();
    // Log para debug de links não funcionantes
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
function SubNavItem({ to, label, active, onClick }) {
  const handleClick = () => {
    if (onClick) onClick();
    console.log(`[Sidebar] Navegando para submenu: ${to}`);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={[
        "block py-1.5 pl-9 pr-3 mx-2 rounded-sm text-[12px] transition-colors duration-150",
        active
          ? "text-primary font-semibold bg-primarySoft"
          : "text-textMuted hover:text-text hover:bg-bgSection",
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
        className="flex items-center gap-2.5 px-3 py-2 mx-2 w-[calc(100%-16px)] rounded-sm text-[13px] font-medium text-textMuted hover:text-text hover:bg-bgSection transition-colors duration-150"
      >
        <Icon size={16} strokeWidth={1.75} />
        <span className="flex-1 text-left truncate">{label}</span>
        {open ? <ChevronDown size={13} strokeWidth={2} /> : <ChevronRight size={13} strokeWidth={2} />}
      </button>
      {open && <div className="mt-0.5 mb-1 space-y-0.5">{children}</div>}
    </div>
  );
}

/* ─── SectionLabel ─────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p className="px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-textMuted/70">
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR — menus dinâmicos por perfil
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
    navigate("/login");
  };

  const roleMeta = ROLE_META[userRole] ?? { label: userRole, color: "bg-bgSection text-textMuted" };

  /* ── Seleciona o menu correto por perfil ── */
  const isAdmin      = userRole === "admin";
  const isModerador  = userRole === "moderador";
  const isUsuario    = userRole === "usuario";
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";

  return (
    <aside
      className={[
        "fixed top-0 left-0 z-[1200] flex flex-col h-screen bg-surface border-r border-border overflow-hidden",
        className,
      ].join(" ")}
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="flex flex-col items-center px-5 pt-5 pb-4 shrink-0 gap-2.5">
        <img src={logoEclesia} alt="Eclesia Logo" className="h-8 object-contain" />
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleMeta.color}`}>
          {isSuperAdmin && <ShieldCheck size={10} strokeWidth={2} />}
          {roleMeta.label}
        </span>
      </div>

      <div className="h-px bg-border mx-4 shrink-0" />

      {/* ── Navegação ── */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">

        {/* ════════ SUPER ADMIN ════════ */}
        {isSuperAdmin && (
          <>
            <SectionLabel>Plataforma</SectionLabel>
            <NavItem to="/dashboard"   icon={LayoutDashboard} label="Painel"    active={isActive("/dashboard")}   onClick={handleNav} />
            <CollapsibleSection label="Igrejas" icon={Building2} open={platformOpen} onToggle={() => setPlatformOpen(!platformOpen)}>
              {platformSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
            <SectionLabel>Sistema</SectionLabel>
            <NavItem to="/configuracoes" icon={Settings} label="Configurações" active={isActive("/configuracoes")} onClick={handleNav} />
          </>
        )}

        {/* ════════ ADMIN DA IGREJA ════════ */}
        {isAdmin && (
          <>
            <SectionLabel>Visão Geral</SectionLabel>
            <NavItem to="/dashboard"    icon={LayoutDashboard} label="Painel"         active={isActive("/dashboard")}    onClick={handleNav} />
            <NavItem to="/chat/list"    icon={MessageSquare}   label="Comunicação"     active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} />
            <NavItem to="/notificacoes" icon={Bell}            label="Notificações"    active={isActive("/notificacoes")} onClick={handleNav} />

            <SectionLabel>Igreja</SectionLabel>
            <CollapsibleSection label="Cultos & Eventos" icon={CalendarDays} open={cultosOpen} onToggle={() => setCultosOpen(!cultosOpen)}>
              {cultosSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Secretaria" icon={Users} open={secretariaOpen} onToggle={() => setSecretariaOpen(!secretariaOpen)}>
              {secretariaSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Finanças" icon={Wallet} open={financeiroOpen} onToggle={() => setFinanceiroOpen(!financeiroOpen)}>
              {financasSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
            <CollapsibleSection label="Relatórios" icon={BarChart3} open={relatoriosOpen} onToggle={() => setRelatoriosOpen(!relatoriosOpen)}>
              {relatoriosSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>

            <SectionLabel>Sistema</SectionLabel>
            <NavItem to="/configuracoes" icon={Settings} label="Configurações" active={isActive("/configuracoes")} onClick={handleNav} />
          </>
        )}

        {/* ════════ MODERADOR ════════ */}
        {isModerador && (
          <>
            <SectionLabel>Visão Geral</SectionLabel>
            <NavItem to="/lista-cultos" icon={LayoutDashboard} label="Painel"       active={isActive("/lista-cultos")} onClick={handleNav} />
            <NavItem to="/chat/list"    icon={MessageSquare}   label="Comunicação"  active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} />
            <NavItem to="/notificacoes" icon={Bell}            label="Notificações" active={isActive("/notificacoes")} onClick={handleNav} />

            <SectionLabel>Operação</SectionLabel>
            <CollapsibleSection label="Cultos" icon={CalendarDays} open={cultosOpen} onToggle={() => setCultosOpen(!cultosOpen)}>
              {cultosModeradorSubmenus.map((s) => (
                <SubNavItem key={s.path} {...s} active={isActive(s.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
            <NavItem to="/gestao-membros"     icon={Users}    label="Membros"   active={isActive("/gestao-membros")}     onClick={handleNav} />
            <NavItem to="/relatorios/presencas" icon={BarChart3} label="Presenças" active={isActive("/relatorios/presencas")} onClick={handleNav} />
          </>
        )}

        {/* ════════ MEMBRO (usuário) ════════ */}
        {isUsuario && (
          <>
            <SectionLabel>Minha Conta</SectionLabel>
            <NavItem to="/perfil"       icon={UserCircle}  label="Meu Perfil"      active={isActive("/perfil")}       onClick={handleNav} />
            <NavItem to="/cartao"       icon={CreditCard}  label="Cartão Digital"  active={isActive("/cartao")}       onClick={handleNav} />
            <NavItem to="/notificacoes" icon={Bell}        label="Notificações"    active={isActive("/notificacoes")} onClick={handleNav} />
            <NavItem to="/chat/list"    icon={MessageSquare} label="Comunicação"   active={isActive("/chat/list")}    badge={unreadMessagesCount} onClick={handleNav} />
          </>
        )}
      </nav>

      {/* ── Rodapé: perfil do utilizador ── */}
      <div className="shrink-0 border-t border-border p-3">
        {membro ? (
          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-2.5 w-full p-2 rounded-sm hover:bg-bgSection transition-colors text-left"
          >
            <img
              src={
                membro.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=EEF0FE&color=4F5EF7&size=80`
              }
              alt={membro.nome}
              className="w-8 h-8 rounded-sm object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text truncate">{membro.nome}</p>
              <p className="text-[11px] text-textMuted truncate">Ver perfil</p>
            </div>
            <ChevronDown size={14} strokeWidth={2} className="text-textMuted shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 w-full p-2 rounded-sm text-danger hover:bg-danger/5 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span className="text-[13px] font-medium">Encerrar sessão</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export { SIDEBAR_WIDTH };
