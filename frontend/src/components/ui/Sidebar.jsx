import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  ScrollText,
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Cross,
} from "lucide-react";
import logoBernet from "../../assets/Logo-Bernet.png";
import {
  membrosSubmenus,
  financasSubmenus,
  relatoriosFinanceirosSub,
  SIDEBAR_WIDTH,
} from "../../navbar/navConfig";

function NavItem({ to, icon: Icon, label, active, badge, onClick, className = "" }) {
  const base =
    "flex items-center gap-3 px-4 py-2.5 mx-3 rounded-sm text-body font-medium transition-colors duration-200";
  const state = active
    ? "bg-primarySoft text-primary"
    : "text-textMuted hover:text-text hover:bg-primarySoft/50";

  const content = (
    <>
      <span className="relative shrink-0">
        <Icon size={20} strokeWidth={1.75} />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="truncate">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${base} ${state} ${className}`} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${state} w-[calc(100%-24px)] ${className}`}>
      {content}
    </button>
  );
}

function SubNavItem({ to, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={[
        "block py-2 pl-11 pr-4 mx-3 rounded-sm text-muted transition-colors",
        active ? "text-primary font-semibold bg-primarySoft/60" : "text-textMuted hover:text-text hover:bg-primarySoft/40",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function CollapsibleSection({ label, icon: Icon, open, onToggle, children }) {
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-2.5 mx-3 w-[calc(100%-24px)] rounded-sm text-body font-medium text-textMuted hover:text-text hover:bg-primarySoft/50 transition-colors"
      >
        <Icon size={20} strokeWidth={1.75} />
        <span className="flex-1 text-left truncate">{label}</span>
        {open ? <ChevronDown size={16} strokeWidth={1.75} /> : <ChevronRight size={16} strokeWidth={1.75} />}
      </button>
      {open && <div className="mt-1 mb-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-7 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-textMuted">
      {children}
    </p>
  );
}

export default function Sidebar({
  userRole,
  membro,
  unreadMessagesCount = 0,
  onNavigate,
  onProfileClick,
  className = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [eventosOpen, setEventosOpen] = useState(false);
  const [membrosOpen, setMembrosOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNav = () => {
    onNavigate?.();
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className={[
        "fixed top-0 left-0 z-[1200] flex flex-col h-screen bg-surface border-r border-surfaceMuted overflow-hidden",
        className,
      ].join(" ")}
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center px-6 pt-8 pb-6 shrink-0">
        <img src={logoBernet} alt="Logo Bernet" className="h-12 object-contain" />
        <div className="flex items-center gap-1.5 mt-3 text-primary">
          <Cross size={14} strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-textMuted">
            Gestão Eclesiástica
          </span>
        </div>
      </div>

      <div className="h-px bg-surfaceMuted mx-5 shrink-0" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <SectionLabel>Navegação</SectionLabel>

        <NavItem
          to="/"
          icon={Home}
          label="Início"
          active={isActive("/")}
          onClick={handleNav}
        />

        {(userRole === "admin" || userRole === "usuario" || userRole === "moderador") && (
          <NavItem
            to="/chat/list"
            icon={MessageSquare}
            label="Comunicação"
            active={isActive("/chat/list")}
            badge={unreadMessagesCount}
            onClick={handleNav}
          />
        )}

        {(userRole === "admin" || userRole === "moderador") && (
          <NavItem
            to="/listaCultos"
            icon={ScrollText}
            label="Ata do Culto"
            active={isActive("/listaCultos")}
            onClick={handleNav}
          />
        )}

        {userRole === "admin" && (
          <NavItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Painel"
            active={isActive("/dashboard")}
            onClick={handleNav}
          />
        )}

        {(userRole === "admin" || userRole === "moderador") && (
          <>
            <SectionLabel>Administrativo</SectionLabel>

            <CollapsibleSection
              label="Eventos & Cultos"
              icon={CalendarDays}
              open={eventosOpen}
              onToggle={() => setEventosOpen(!eventosOpen)}
            >
              <SubNavItem to="/TabelaCulto" label="Agenda de Cultos" active={isActive("/TabelaCulto")} onClick={handleNav} />
              {userRole === "admin" && (
                <SubNavItem
                  to="/gestao/RelatorioPresencas"
                  label="Relatório de Frequência"
                  active={isActive("/gestao/RelatorioPresencas")}
                  onClick={handleNav}
                />
              )}
            </CollapsibleSection>

            <CollapsibleSection
              label="Secretaria"
              icon={Users}
              open={membrosOpen}
              onToggle={() => setMembrosOpen(!membrosOpen)}
            >
              {membrosSubmenus.map((sub) => (
                <SubNavItem key={sub.path} {...sub} active={isActive(sub.path)} onClick={handleNav} />
              ))}
            </CollapsibleSection>
          </>
        )}

        {userRole === "admin" && (
          <>
            <CollapsibleSection
              label="Gestão Financeira"
              icon={Wallet}
              open={financeiroOpen}
              onToggle={() => setFinanceiroOpen(!financeiroOpen)}
            >
              {financasSubmenus.map((sub) => (
                <SubNavItem key={sub.path} {...sub} active={isActive(sub.path)} onClick={handleNav} />
              ))}

              <button
                type="button"
                onClick={() => setRelatoriosOpen(!relatoriosOpen)}
                className="flex items-center justify-between w-[calc(100%-24px)] py-2 pl-11 pr-4 mx-3 rounded-sm text-muted text-textMuted hover:text-text hover:bg-primarySoft/40"
              >
                <span>Relatórios de Auditoria</span>
                {relatoriosOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {relatoriosOpen &&
                relatoriosFinanceirosSub.map((sub) => (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={handleNav}
                    className={[
                      "block py-2 pl-14 pr-4 mx-3 rounded-sm text-[12px] transition-colors",
                      isActive(sub.path)
                        ? "text-primary font-semibold bg-primarySoft/60"
                        : "text-textMuted hover:text-text hover:bg-primarySoft/40",
                    ].join(" ")}
                  >
                    {sub.label}
                  </Link>
                ))}
            </CollapsibleSection>

            <SectionLabel>Sistema</SectionLabel>
            <NavItem
              to="/configuracoes"
              icon={Settings}
              label="Configurações"
              active={isActive("/configuracoes")}
              onClick={handleNav}
            />
          </>
        )}
      </nav>

      {/* User profile footer */}
      <div className="shrink-0 border-t border-surfaceMuted p-4">
        {membro ? (
          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-3 w-full p-2 rounded-sm hover:bg-primarySoft/50 transition-colors text-left"
          >
            <img
              src={membro.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=FBE3CF&color=D97A4D`}
              alt={membro.nome}
              className="w-10 h-10 rounded-sm object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-text truncate">{membro.nome}</p>
              <p className="text-muted text-textMuted truncate">Ver perfil</p>
            </div>
            <ChevronDown size={18} strokeWidth={1.75} className="text-textMuted shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full p-2 rounded-sm text-danger hover:bg-danger/5 transition-colors"
          >
            <LogOut size={20} strokeWidth={1.75} />
            <span className="text-body font-medium">Encerrar sessão</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export { SIDEBAR_WIDTH };
