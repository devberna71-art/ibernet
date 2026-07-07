import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Wallet,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Shield,
  CheckCircle2,
  Star,
  ChevronRight,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import heroImage from "../assets/homeimg.jpg";
import logoEclesia from "../assets/logo-ofi.png";
import NavbarVisitor from "../navbar/NavbarVisitor";

/* ── Utilitários inline ── */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primarySoft text-primary text-xs font-semibold">
      {children}
    </span>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="group p-6 rounded-lg border border-border bg-surface hover:border-primary/30 hover:shadow-float transition-all duration-300">
      <div className="w-10 h-10 rounded-md bg-primarySoft flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <Icon size={20} strokeWidth={1.75} className="text-primary" />
      </div>
      <h3 className="text-base font-semibold text-text mb-1.5">{title}</h3>
      <p className="text-sm text-textMuted leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-text mb-1">{number}</p>
      <p className="text-sm text-textMuted">{label}</p>
    </div>
  );
}

function PlanCard({ name, price, desc, features, highlighted = false }) {
  const navigate = useNavigate();
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-7 transition-all duration-300 ${
        highlighted
          ? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
          : "border-border bg-surface hover:border-primary/30 hover:shadow-float"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold shadow-sm">
            <Star size={11} fill="currentColor" /> Mais popular
          </span>
        </div>
      )}
      <div className="mb-5">
        <p className={`text-sm font-semibold mb-1 ${highlighted ? "text-white/80" : "text-textMuted"}`}>{name}</p>
        <div className="flex items-end gap-1 mb-2">
          <span className={`text-4xl font-bold ${highlighted ? "text-white" : "text-text"}`}>{price}</span>
          {price !== "Grátis" && <span className={`text-sm mb-1 ${highlighted ? "text-white/70" : "text-textMuted"}`}>/mês</span>}
        </div>
        <p className={`text-sm ${highlighted ? "text-white/70" : "text-textMuted"}`}>{desc}</p>
      </div>
      <ul className="space-y-2.5 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2
              size={15}
              strokeWidth={2}
              className={`mt-0.5 shrink-0 ${highlighted ? "text-white/80" : "text-success"}`}
            />
            <span className={highlighted ? "text-white/90" : "text-textSecondary"}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/criar-usuarios")}
        className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors ${
          highlighted
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-white hover:bg-primaryHover"
        }`}
      >
        Começar agora
      </button>
    </div>
  );
}

function TestimonialCard({ name, role, quote, initials }) {
  return (
    <div className="p-6 rounded-lg border border-border bg-surface hover:shadow-float transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} strokeWidth={0} fill="#F59E0B" className="text-warning" />
        ))}
      </div>
      <p className="text-sm text-textSecondary leading-relaxed mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primarySoft flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{name}</p>
          <p className="text-xs text-textMuted">{role}</p>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Users,         title: "Gestão de Membros",     desc: "Cadastro completo, cartões, perfis e histórico de cada membro da sua congregação." },
  { icon: Wallet,        title: "Controlo Financeiro",   desc: "Dízimos, ofertas, despesas e relatórios financeiros completos em tempo real." },
  { icon: CalendarDays,  title: "Eventos & Cultos",      desc: "Agenda de cultos, atas digitais e relatórios de frequência automatizados." },
  { icon: MessageSquare, title: "Comunicação Interna",   desc: "Canal seguro de mensagens entre líderes, moderadores e membros." },
  { icon: BarChart3,     title: "Relatórios & Analytics",desc: "Gráficos, estatísticas e exportações para tomada de decisão estratégica." },
  { icon: Shield,        title: "Segurança & Controlo",  desc: "Permissões por função, dados criptografados e auditoria de acessos." },
];

const PLANS = [
  {
    name: "Básico",
    price: "Grátis",
    desc: "Para igrejas pequenas que estão a começar.",
    features: ["Até 50 membros", "Gestão básica de membros", "Agenda de cultos", "1 utilizador admin"],
  },
  {
    name: "Crescimento",
    price: "$29",
    desc: "Para congregações em expansão.",
    features: ["Membros ilimitados", "Módulo financeiro completo", "Relatórios avançados", "Chat interno", "5 utilizadores admin"],
    highlighted: true,
  },
  {
    name: "Igreja",
    price: "$79",
    desc: "Para redes de igrejas e sedes múltiplas.",
    features: ["Múltiplas filiais", "API & integrações", "Suporte prioritário", "Admin ilimitados", "Backup automático"],
  },
];

const TESTIMONIALS = [
  { name: "Pastor Bernardo A.",    role: "Igreja Evangélica, Luanda",    initials: "BA", quote: "O sistema transformou completamente a nossa gestão. Antes perdia horas em planilhas, agora tudo está organizado num só lugar." },
  { name: "Irmã Maria José",       role: "Secretária, Igreja Baptista",  initials: "MJ", quote: "A gestão de membros e os relatórios financeiros são fantásticos. Recomendo a todas as igrejas que queiram modernizar." },
  { name: "Diác. António F.",      role: "Tesoureiro, Igreja Pentecostal",initials: "AF", quote: "Controlar as finanças da nossa igreja nunca foi tão simples. Os relatórios automáticos poupam imenso tempo." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <NavbarVisitor />

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center"
      >
        {/* Background image com overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Conteúdo do hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32">
          <div className="max-w-2xl">
            <div className="mb-6 animate-fade-up">
              <Pill>
                <Zap size={11} strokeWidth={2.5} />
                Nova versão disponível
              </Pill>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5 animate-fade-up [animation-delay:100ms]">
              Gerencie sua{" "}
              <span className="text-[#818CF8]">iglesia</span>{" "}
              com inteligência
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl animate-fade-up [animation-delay:200ms]">
              Bernet@-Eclesia é o sistema completo de gestão eclesiástica. Membros,
              finanças, cultos e comunicação — tudo integrado, seguro e simples.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up [animation-delay:300ms]">
              <button
                onClick={() => navigate("/criar-usuarios")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primaryHover transition-colors"
              >
                Começar gratuitamente
                <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => {
                  document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Ver funcionalidades
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-6 animate-fade-up [animation-delay:400ms]">
              <div className="flex -space-x-2">
                {["BA","MJ","AF","CP"].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/80 border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">
                <span className="text-white font-semibold">+200 igrejas</span> já usam a plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ STATS ══════════════════════════════ */}
      <section className="py-14 bg-bgSection border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="+200" label="Igrejas cadastradas" />
            <StatCard number="+15k" label="Membros gerenciados" />
            <StatCard number="99.9%" label="Disponibilidade" />
            <StatCard number="+500k" label="Transações processadas" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FEATURES ══════════════════════════════ */}
      <section id="servicos" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="max-w-xl mb-12">
            <Pill>Funcionalidades</Pill>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mt-4 mb-3 tracking-tight">
              Tudo que a sua igreja precisa
            </h2>
            <p className="text-base text-textMuted leading-relaxed">
              Uma plataforma integrada que cobre cada aspecto da gestão eclesiástica,
              do membro ao balanço financeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ DESTAQUE ══════════════════════════════ */}
      <section className="py-20 bg-bgSection border-y border-border" id="sobre">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <Pill>Por que escolher Bernet@</Pill>
              <h2 className="text-3xl lg:text-4xl font-bold text-text mt-4 mb-4 tracking-tight">
                Desenvolvido por quem{" "}
                <span className="gradient-text">entende igrejas</span>
              </h2>
              <p className="text-base text-textMuted leading-relaxed mb-6">
                A nossa equipa combina experiência em tecnologia com profundo
                conhecimento do contexto eclesiástico angolano. Cada funcionalidade
                foi pensada para resolver problemas reais.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  { icon: Globe, text: "Interface totalmente em Português europeu e angolano" },
                  { icon: Lock,  text: "Dados seguros e privados, nunca partilhados" },
                  { icon: Zap,   text: "Atualizações contínuas sem custo adicional" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-sm bg-primarySoft flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} strokeWidth={2} className="text-primary" />
                    </div>
                    <span className="text-sm text-textSecondary leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/criar-usuarios"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primaryHover transition-colors"
              >
                Criar conta gratuita
                <ChevronRight size={15} strokeWidth={2} />
              </Link>
            </div>

            {/* Imagem / Card decorativo */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img
                  src={heroImage}
                  alt="Nossa equipa"
                  className="w-full h-72 object-cover object-top"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-surface rounded-lg border border-border shadow-float p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-successSoft flex items-center justify-center">
                  <CheckCircle2 size={20} strokeWidth={1.75} className="text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">Sistema verificado</p>
                  <p className="text-2xs text-textMuted">SSL + backup automático</p>
                </div>
              </div>
              {/* Stats badge */}
              <div className="absolute -top-4 -right-4 bg-primary rounded-lg p-4 text-white shadow-lg">
                <p className="text-2xl font-bold leading-none">200+</p>
                <p className="text-xs text-white/80 mt-0.5">igrejas ativas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ PLANOS ══════════════════════════════ */}
      <section id="planos" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Pill>Planos</Pill>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mt-4 mb-3 tracking-tight">
              Preços simples e transparentes
            </h2>
            <p className="text-base text-textMuted">
              Comece grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ TESTEMUNHOS ══════════════════════════════ */}
      <section className="py-20 bg-bgSection border-y border-border" id="testemunhos">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Pill>Testemunhos</Pill>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mt-4 mb-3 tracking-tight">
              O que dizem as igrejas
            </h2>
            <p className="text-base text-textMuted">
              Histórias reais de pastores e líderes que transformaram a sua gestão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA FINAL ══════════════════════════════ */}
      <section className="py-20" id="contacto">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primarySoft mb-6">
            <Zap size={24} strokeWidth={1.75} className="text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 tracking-tight">
            Pronto para modernizar sua igreja?
          </h2>
          <p className="text-base text-textMuted mb-8 max-w-lg mx-auto">
            Crie a sua conta gratuitamente em menos de 2 minutos. Sem cartão,
            sem compromisso — só resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/criar-usuarios"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primaryHover transition-colors"
            >
              Criar conta gratuita
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <a
              href={`https://wa.me/244923519571?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre a plataforma Bernet@-Eclesia.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md border border-border text-text font-semibold text-sm hover:bg-bgSection transition-colors"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FOOTER ══════════════════════════════ */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src={logoEclesia} alt="Eclesia" className="h-10 object-contain" />
              <span className="text-sm text-textMuted">Gestão Eclesiástica</span>
            </div>
            <p className="text-xs text-textMuted">
              © {new Date().getFullYear()} Bernet@-Eclesia. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs text-textMuted hover:text-text transition-colors">Entrar</Link>
              <Link to="/criar-usuarios" className="text-xs text-textMuted hover:text-text transition-colors">Criar conta</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={`https://wa.me/244923519571?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o Bernet@-Eclesia.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] w-13 h-13 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{ background: "#25D366", width: 52, height: 52 }}
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
