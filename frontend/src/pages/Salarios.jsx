// src/pages/GestaoSalarios.jsx
import React, { useState } from "react";
import { Coins, Eye, X, Maximize2, Minimize2 } from "lucide-react";
import FormFuncionarios from "../components/FormFuncionarios";
import FormSubsidios from "../components/FormSubsidios";
import FormDescontos from "../components/FormDescontos";
import FormSalarios from "../components/FormSalarios";
import ListaFuncionarios from "../components/ListaFuncionarios";
import ListaSalarios from "../components/ListaSalarios";
import ListaDescontos from "../components/ListaDescontos";
import ListaSubsidios from "../components/ListaSubsidios";
import AppPage from "../components/ui/AppPage";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

/** Modal corporativo leve com suporte a maximização */
function Modal({ open, onClose, title, children, defaultMaxWidth = "max-w-xl" }) {
  const [maximizado, setMaximizado] = useState(false);

  React.useEffect(() => {
    if (!open) setMaximizado(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`relative bg-white rounded-xl border border-slate-200 w-full overflow-y-auto shadow-xl transition-all duration-200 max-h-[90vh] ${
          maximizado ? "max-w-5xl h-[85vh]" : defaultMaxWidth
        }`}
      >
        {/* Cabeçalho Técnico do Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
          
          <div className="flex items-center gap-2.5 text-slate-400">
            <button
              type="button"
              onClick={() => setMaximizado(!maximizado)}
              className="hover:text-slate-600 transition-colors p-0.5"
              title={maximizado ? "Restaurar tamanho" : "Maximizar janela"}
            >
              {maximizado ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="hover:text-slate-600 transition-colors p-0.5 border-l border-slate-200 pl-2"
              title="Fechar janela"
            >
              <X size={15} />
            </button>
          </div>
        </div>
        
        <div className="p-5 text-left">{children}</div>
      </div>
    </div>
  );
}

export default function GestaoSalarios() {
  const [tab, setTab] = useState(0);

  const [openFuncionarios, setOpenFuncionarios] = useState(false);
  const [openSalarios, setOpenSalarios] = useState(false);
  const [openDescontos, setOpenDescontos] = useState(false);
  const [openSubsidios, setOpenSubsidios] = useState(false);

  const tabs = [
    { label: "Funcionários", index: 0 },
    { label: "Subsídios", index: 1 },
    { label: "Descontos", index: 2 },
    { label: "Processamento Salarial", index: 3 },
  ];

  return (
    <AppPage subtitle="Administração de funcionários, membros, subsídios, descontos e processamento salarial.">
      
      {/* ================= HEADER PRINCIPAL ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 text-left">
        <div className="flex items-center gap-3">
          {/* Aplicado bg-primarySoft e text-primary do Design System */}
          <div className="w-10 h-10 rounded-lg bg-primarySoft flex items-center justify-center text-primary shadow-sm">
            <Coins size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Gestão de Salários</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Gestão de folhas de pagamento e subsídios.</p>
          </div>
        </div>
        <div className="flex gap-1.5 self-start sm:self-auto">
          <Badge variant="primary" className="text-[10px] font-bold tracking-wider uppercase">Sistema Ativo</Badge>
          <Badge variant="secondary" className="text-[10px] font-bold tracking-wider uppercase">Igrejas</Badge>
        </div>
      </div>

      {/* ================= ABA DE NAVEGAÇÃO INTERNA (TABS) ================= */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.index}
            onClick={() => setTab(t.index)}
            
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px uppercase tracking-wider ${
              tab === t.index
                ? "border-primary text-primary font-black"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================= PAINEL DE FORMULÁRIO ATIVO ================= */}
      <Card padding="p-6" className="border border-slate-100 shadow-sm bg-white rounded-xl text-left">
        
        {/* TAB 0: CONTROL DE FUNCIONÁRIOS */}
        {tab === 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ficha de Inscrição / Admissão</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenFuncionarios(true)}
                className="flex items-center gap-1.5 border border-slate-200 text-slate-700 font-bold"
              >
                <Eye size={12} className="text-slate-400" />
                Consultar Quadro
              </Button>
            </div>
            <FormFuncionarios />
          </div>
        )}

        {/* TAB 1: PARAMETRIZAÇÃO DE SUBSÍDIOS */}
        {tab === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Definição de Abonos e Gratificações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenSubsidios(true)}
                className="flex items-center gap-1.5 border border-slate-200 text-slate-700 font-bold"
              >
                <Eye size={12} className="text-slate-400" />
                Listar Abonos
              </Button>
            </div>
            <FormSubsidios />
          </div>
        )}

        {/* TAB 2: PARAMETRIZAÇÃO DE DESCONTOS */}
        {tab === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configuração de Retenções Normativas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenDescontos(true)}
                className="flex items-center gap-1.5 border border-slate-200 text-slate-700 font-bold"
              >
                <Eye size={12} className="text-slate-400" />
                Listar Retenções
              </Button>
            </div>
            <FormDescontos />
          </div>
        )}

        {/* TAB 3: EMISSÃO E LIQUIDAÇÃO SALARIAL */}
        {tab === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cálculo e Liquidação de Salários</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenSalarios(true)}
                className="flex items-center gap-1.5 border border-slate-200 text-slate-700 font-bold"
              >
                <Eye size={12} className="text-slate-400" />
                Histórico de Emissões
              </Button>
            </div>
            <FormSalarios />
          </div>
        )}
      </Card>

      {/* ================= FLUXO ESTRUTURADO DE MODAIS (TABELAS DE DADOS) ================= */}
      
      <Modal
        open={openFuncionarios}
        onClose={() => setOpenFuncionarios(false)}
        title="Quadro Operativo de Funcionários"
        defaultMaxWidth="max-w-5xl"
      >
        <ListaFuncionarios />
      </Modal>

      <Modal
        open={openSalarios}
        onClose={() => setOpenSalarios(false)}
        title="Relatório de Processamentos e Salários Efetuados"
        defaultMaxWidth="max-w-5xl"
      >
        <ListaSalarios />
      </Modal>

      <Modal
        open={openDescontos}
        onClose={() => setOpenDescontos(false)}
        title="Tabela Corrente de Descontos e Deduções"
        defaultMaxWidth="max-w-3xl"
      >
        <ListaDescontos />
      </Modal>

      <Modal
        open={openSubsidios}
        onClose={() => setOpenSubsidios(false)}
        title="Tabela Corrente de Subsídios Configurados"
        defaultMaxWidth="max-w-3xl"
      >
        <ListaSubsidios />
      </Modal>
      
    </AppPage>
  );
}