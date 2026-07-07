import React, { useState } from "react";
import {
  Settings,
  CreditCard,
  Mail,
  Palette,
  CheckCircle,
  HelpCircle,
  Save,
  Server,
  Sparkles,
} from "lucide-react";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ConfigGlobal() {
  const [activeTab, setActiveTab] = useState("planos");
  const [toast, setToast] = useState(null);

  // Config State
  const [plans, setPlans] = useState([
    { id: 1, name: "Básico", price: "18.000 Kz", members: 150, storage: 5, features: ["Gestão de Membros", "Ata de Cultos"] },
    { id: 2, name: "Premium Pro", price: "45.000 Kz", members: 1000, storage: 15, features: ["Gestão de Membros", "Ata de Cultos", "Controle Financeiro", "Comunicações/Chat"] },
    { id: 3, name: "Enterprise", price: "85.000 Kz", members: 5000, storage: 50, features: ["Membros ilimitados", "Ata de Cultos", "Controle Financeiro Completo", "Comunicações/Chat", "Multifiliais Avançado", "Suporte 24/7 Dedicated"] },
  ]);

  const [smtp, setSmtp] = useState({
    host: "smtp.mailgun.org",
    port: "587",
    user: "postmaster@eclesia.ao",
    pass: "••••••••••••••••••••",
    sender: "Eclesia Notificações <noreply@eclesia.ao>",
  });

  const [branding, setBranding] = useState({
    systemName: "Eclesia Gestão",
    accentColor: "#2563EB",
    allowSelfRegister: true,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (section) => {
    showToast(`Configurações de ${section} salvas com sucesso!`);
  };

  return (
    <div className="space-y-6 fade-in font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[3000] px-4 py-3 rounded-md border shadow-float text-xs font-semibold animate-fade-in ${
          toast.type === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-emerald-50 border-emerald-200 text-emerald-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configurações Gerais do Sistema</h2>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Personalize planos, configure SMTP de emails e customize a identidade da marca.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("planos")}
          className={`pb-3 text-xs font-semibold border-b-2 px-1 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === "planos"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard size={14} />
          Planos & Subscrições
        </button>
        <button
          onClick={() => setActiveTab("smtp")}
          className={`pb-3 text-xs font-semibold border-b-2 px-1 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === "smtp"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Mail size={14} />
          Emails Transacionais (SMTP)
        </button>
        <button
          onClick={() => setActiveTab("branding")}
          className={`pb-3 text-xs font-semibold border-b-2 px-1 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === "branding"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Palette size={14} />
          Personalização & Marca
        </button>
      </div>

      {/* Tab 1: Planos */}
      {activeTab === "planos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <Card key={p.id} className="relative overflow-hidden hover:border-violet-300 transition-all duration-200 flex flex-col justify-between" padding="p-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{p.name}</span>
                    <Badge variant={p.id === 2 ? "success" : "secondary"}>
                      {p.id === 2 ? "Mais Vendido" : "Activo"}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                    <span className="text-slate-400 text-xs font-semibold"> / mês</span>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-700 mb-6">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400">Limite de Membros:</span>
                      <span className="font-bold text-slate-900">{p.members}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400">Armazenamento Cota:</span>
                      <span className="font-bold text-slate-900">{p.storage} GB</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Recursos incluídos:</span>
                      <ul className="space-y-1.5 text-slate-600 pl-1">
                        {p.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <Button variant="secondary" size="sm" className="w-full justify-center" onClick={() => showToast(`Cotas de '${p.name}' abertas para edição.`)}>
                    Editar Limites
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: SMTP */}
      {activeTab === "smtp" && (
        <Card className="max-w-2xl shadow-xs" padding="p-6">
          <CardHeader title="Servidor SMTP de Saída" subtitle="Configurações para envio de alertas, faturas e recuperação de acessos" />
          
          <div className="space-y-4 mt-6 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Servidor SMTP:</label>
              <input
                type="text"
                value={smtp.host}
                onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Porta de Saída:</label>
              <input
                type="text"
                value={smtp.port}
                onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Usuário SMTP:</label>
              <input
                type="text"
                value={smtp.user}
                onChange={(e) => setSmtp({ ...smtp, user: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Senha SMTP:</label>
              <input
                type="password"
                value={smtp.pass}
                onChange={(e) => setSmtp({ ...smtp, pass: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Remetente:</label>
              <input
                type="text"
                value={smtp.sender}
                onChange={(e) => setSmtp({ ...smtp, sender: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => showToast("Enviando email de teste para administrador...", "success")}
                className="gap-1.5"
              >
                <Server size={14} />
                Testar Ligação
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave("SMTP")}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 border-none"
              >
                <Save size={14} />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Personalização */}
      {activeTab === "branding" && (
        <Card className="max-w-2xl shadow-xs" padding="p-6">
          <CardHeader title="Identidade Visual & Comportamento" subtitle="Customize o visual geral da plataforma para clientes finais" />
          
          <div className="space-y-4 mt-6 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Nome do Sistema:</label>
              <input
                type="text"
                value={branding.systemName}
                onChange={(e) => setBranding({ ...branding, systemName: e.target.value })}
                className="w-full sm:col-span-3 px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <label className="text-slate-500 font-semibold sm:text-right">Cor de Destaque:</label>
              <div className="sm:col-span-3 flex items-center gap-3">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-slate-600 font-mono text-xs">{branding.accentColor}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <label className="text-slate-500 font-semibold sm:text-right pt-1">Auto-Registo:</label>
              <div className="sm:col-span-3 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="self-reg"
                  checked={branding.allowSelfRegister}
                  onChange={(e) => setBranding({ ...branding, allowSelfRegister: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="self-reg" className="text-slate-500 font-medium">
                  Permitir que igrejas iniciem registo de testes de 14 dias através da landing page.
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave("Marca & Identidade")}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 border-none"
              >
                <Save size={14} />
                Gravar Definições
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
