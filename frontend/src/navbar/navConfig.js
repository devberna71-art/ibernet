// ─── Largura do sidebar ────────────────────────────────────────────
export const SIDEBAR_WIDTH = 220;

// ─── ADMIN DA IGREJA — Secretaria ──────────────────────────────────
export const secretariaSubmenus = [
  { path: "/gestao-membros",       label: "Relação de Membros" },
  { path: "/gestao-departamentos", label: "Departamentos" },
  { path: "/ministerios",          label: "Ministérios" },
  { path: "/gestao-cargos",        label: "Cargos & Funções" },
];

// ─── ADMIN DA IGREJA — Finanças ────────────────────────────────────
export const financasSubmenus = [
  { path: "/gestao-contribuicoes", label: "Dízimos & Ofertas" },
  { path: "/gestao-despesas",      label: "Despesas" },
  { path: "/salarios",             label: "Folha de Pagamentos" },
];

// ─── ADMIN DA IGREJA — Relatórios ──────────────────────────────────
export const relatoriosSubmenus = [
  { path: "/relatorios/membros",          label: "Membros" },
  { path: "/relatorios/contribuicoes",    label: "Contribuições" },
  { path: "/relatorios/despesas",         label: "Despesas" },
  { path: "/relatorios/financeiro-geral", label: "Balanço Geral" },
  { path: "/relatorios/presencas",        label: "Presenças" },
  { path: "/relatorios/sede",             label: "Sede & Filiais" },
];

// ─── ADMIN DA IGREJA — Cultos ──────────────────────────────────────
export const cultosSubmenus = [
  { path: "/lista-cultos",    label: "Agenda de Cultos" },
  { path: "/gestao-culto",    label: "Registar Culto" },
  { path: "/form-tipo-culto", label: "Tipos de Culto" },
];

// ─── MODERADOR — Cultos ────────────────────────────────────────────
export const cultosModeradorSubmenus = [
  { path: "/lista-cultos",    label: "Agenda de Cultos" },
  { path: "/gestao-culto",    label: "Registar Culto" },
];

// ─── SUPER ADMIN — Plataforma ──────────────────────────────────────
export const platformSubmenus = [
  { path: "/gestao-igrejas",        label: "Igrejas & Sedes" },
  { path: "/cadastrar-igreja-dono", label: "Onboarding Igreja" },
];
