import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import logoEclesia from "../assets/Logo-Eclesia.svg";

const NAV_LINKS = [
  { label: "Início",        href: "/#hero" },
  { label: "Funcionalidades", href: "/#servicos" },
  { label: "Sobre nós",    href: "/#sobre" },
  { label: "Planos",       href: "/#planos" },
  { label: "Contacto",     href: "/#contacto" },
];

export default function NavbarVisitor({ toggleDrawer }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Para drawer mobile vindo do Navbar.jsx
  const isMobileDrawer = typeof toggleDrawer === "function";

  const handleNavClick = (href) => {
    setMobileOpen(false);
    toggleDrawer?.();

    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  };

  /* ───── MOBILE DRAWER (dentro do Drawer do Navbar.jsx) ───── */
  if (isMobileDrawer) {
    return (
      <div className="flex flex-col h-full bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <img src={logoEclesia} alt="Eclesia Logo" className="h-8 object-contain" />
          <button
            onClick={() => toggleDrawer()}
            className="p-1.5 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-textSecondary hover:text-text hover:bg-bgSection transition-colors text-left"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTAs */}
        <div className="px-4 py-5 border-t border-border space-y-2">
          <Link
            to="/login"
            onClick={() => toggleDrawer()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-sm border border-border text-sm font-semibold text-text hover:bg-bgSection transition-colors"
          >
            <LogIn size={15} strokeWidth={1.75} />
            Entrar
          </Link>
          <Link
            to="/criar-usuarios"
            onClick={() => toggleDrawer()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-sm bg-primary text-white text-sm font-semibold hover:bg-primaryHover transition-colors"
          >
            Começar gratuitamente
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  /* ───── DESKTOP NAVBAR ───── */
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1400] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logoEclesia} alt="Eclesia Logo" className="h-8 object-contain" />
          </Link>

          {/* Links centro — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-3.5 py-2 rounded-sm text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-textSecondary hover:text-text hover:bg-bgSection"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTAs direita */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/login"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-semibold transition-colors ${
                scrolled
                  ? "text-textSecondary hover:text-text hover:bg-bgSection"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <LogIn size={14} strokeWidth={1.75} />
              Entrar
            </Link>
            <Link
              to="/criar-usuarios"
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary text-white text-sm font-semibold hover:bg-primaryHover transition-colors"
            >
              Começar agora
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>

          {/* Hamburguer mobile */}
          <button
            className={`lg:hidden p-2 rounded-sm transition-colors ${
              scrolled ? "text-text hover:bg-bgSection" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[1300] lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1 mb-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex w-full items-center px-3 py-2.5 rounded-sm text-sm font-medium text-textSecondary hover:text-text hover:bg-bgSection transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-sm border border-border text-sm font-semibold text-text hover:bg-bgSection transition-colors"
              >
                <LogIn size={14} strokeWidth={1.75} />
                Entrar
              </Link>
              <Link
                to="/criar-usuarios"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-sm bg-primary text-white text-sm font-semibold hover:bg-primaryHover transition-colors"
              >
                Começar
                <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}