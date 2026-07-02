import React, { useState } from "react";
import { Coins, Eye, X } from "lucide-react";
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

/** Modal genérico leve */
function Modal({ open, onClose, title, children, maxWidth = "max-w-xl" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`relative bg-surface rounded-lg border border-border w-full ${maxWidth} max-h-[90vh] overflow-auto shadow-float`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="p-5">{children}</div>
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
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-primarySoft flex items-center justify-center text-primary">
            <Coins size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Gestão de Salários</h2>
            <p className="text-muted text-textMuted mt-0.5">Gestão de folhas de pagamento e subsídios.</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Badge variant="primary">Sistema Ativo</Badge>
          <Badge variant="secondary">Igrejas</Badge>
        </div>
      </div>

      {/* Tabs Customizados */}
      <div className="flex border-b border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t.index}
            onClick={() => setTab(t.index)}
            className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-px ${
              tab === t.index
                ? "border-primary text-primary"
                : "border-transparent text-textMuted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Card de Conteúdo */}
      <Card padding="p-6">
        {/* TAB 0: FUNCIONÁRIOS */}
        {tab === 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Gerenciamento de Funcionários</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenFuncionarios(true)}
              >
                <Eye size={13} className="shrink-0" />
                Ver Lista
              </Button>
            </div>
            <FormFuncionarios />
          </div>
        )}

        {/* TAB 1: SUBSÍDIOS */}
        {tab === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Subsídios e Abonos</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenSubsidios(true)}
              >
                <Eye size={13} className="shrink-0" />
                Ver Lista
              </Button>
            </div>
            <FormSubsidios />
          </div>
        )}

        {/* TAB 2: DESCONTOS */}
        {tab === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Descontos e Retenções</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenDescontos(true)}
              >
                <Eye size={13} className="shrink-0" />
                Ver Lista
              </Button>
            </div>
            <FormDescontos />
          </div>
        )}

        {/* TAB 3: SALÁRIOS */}
        {tab === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Processamento de Salários</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenSalarios(true)}
              >
                <Eye size={13} className="shrink-0" />
                Ver Salários Efetuados
              </Button>
            </div>
            <FormSalarios />
          </div>
        )}
      </Card>

      {/* MODAL FUNCIONÁRIOS */}
      <Modal
        open={openFuncionarios}
        onClose={() => setOpenFuncionarios(false)}
        title="Lista de Funcionários"
        maxWidth="max-w-5xl"
      >
        <ListaFuncionarios />
      </Modal>

      {/* MODAL SALÁRIOS */}
      <Modal
        open={openSalarios}
        onClose={() => setOpenSalarios(false)}
        title="Salários Efetuados"
        maxWidth="max-w-5xl"
      >
        <ListaSalarios />
      </Modal>

      {/* MODAL DESCONTOS */}
      <Modal
        open={openDescontos}
        onClose={() => setOpenDescontos(false)}
        title="Lista de Descontos"
        maxWidth="max-w-5xl"
      >
        <ListaDescontos />
      </Modal>

      {/* MODAL SUBSÍDIOS */}
      <Modal
        open={openSubsidios}
        onClose={() => setOpenSubsidios(false)}
        title="Lista de Subsídios"
        maxWidth="max-w-5xl"
      >
        <ListaSubsidios />
      </Modal>
    </AppPage>
  );
}