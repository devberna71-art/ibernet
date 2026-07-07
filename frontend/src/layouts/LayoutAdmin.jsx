import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Bell,
} from "lucide-react";
import logoEclesia from "../assets/logo-ofi.png";
import api from "../api/axiosConfig";

const SIDEBAR_WIDTH = "240px";

const MENU_ITEMS = [
  { path: "/super-admin", label: "Visão Geral", icon: LayoutDashboard },
  { path: "/super-admin/igrejas", label: "Gestão de Igrejas", icon: Building2 },
  { path: "/super-admin/auditoria", label: "IAM & Auditoria", icon: Users },
  { path: "/super-admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function LayoutAdmin() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/usuario/status");
        setUser(res.data?.usuario || null);
      } catch (err) {
        console.error("Erro ao obter dados do usuário:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/super-admin") {
      return location.pathname === "/super-admin" || location.pathname === "/super-admin/";
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans border-r border-slate-800">
      {/* Header/Logo */}
      <div className="flex flex-col items-center px-6 pt-6 pb-4 shrink-0 gap-2">
        <img src={logoEclesia} alt="Eclesia Logo" className="h-16 object-contain filter brightness-110" />
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
          <ShieldCheck size={11} className="shrink-0" />
          Super Admin
        </span>
      </div>

      <div className="h-px bg-slate-800 mx-4 my-2 shrink-0" />

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <p className="px-4 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Administração SaaS
        </p>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="shrink-0 border-t border-slate-800 p-4 bg-slate-950/40">
        {user ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-md bg-violet-600 flex items-center justify-center font-bold text-white shrink-0">
              {user.nome ? user.nome.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.nome}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || "super_admin@ibernet.com"}</p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={14} />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block fixed top-0 left-0 bottom-0 z-40 shrink-0"
        style={{ width: SIDEBAR_WIDTH }}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div
        className="flex-1 min-w-0 flex flex-col md:pl-[240px]"
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              className="md:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-slate-800 hidden md:block">
              Painel de Controlo SaaS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline-block bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Ambiente: <span className="font-semibold text-slate-700">Produção</span>
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 w-[260px] bg-slate-900 shadow-xl flex flex-col h-full animate-slide-in">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}
