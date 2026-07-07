import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  HardDrive,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ToggleLeft,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axiosConfig";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function DetalhesIgreja() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "Sede";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [church, setChurch] = useState(null);
  const [toast, setToast] = useState(null);

  // Mocked limits based on Plan
  const [planLimits, setPlanLimits] = useState({
    name: "Plano Premium",
    price: "45.000 Kz / mês",
    expiration: "15 Dez 2026",
    membersLimit: 1000,
    storageLimit: 15.0, // GB
    storageUsed: 2.4, // GB
  });

  useEffect(() => {
    fetchChurchDetails();
  }, [id, type]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchChurchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sedes-com-filhais");
      const sedes = res.data || [];
      
      let found = null;
      if (type === "Sede") {
        const match = sedes.find((s) => s.id === parseInt(id));
        if (match) {
          found = {
            id: match.id,
            nome: match.nome,
            tipo: "Sede",
            status: match.status || "pendente",
            membros: match.quantidadeMembros || 0,
            telefone: match.telefone || "-",
            email: match.email || "-",
            endereco: match.endereco || "-",
            filiais: match.Filhals || [],
          };
        }
      } else {
        // Look in filiais
        for (const s of sedes) {
          const match = s.Filhals?.find((f) => f.id === parseInt(id));
          if (match) {
            found = {
              id: match.id,
              nome: match.nome,
              tipo: "Filial",
              status: match.status || "pendente",
              membros: match.quantidadeMembros || 0,
              telefone: match.telefone || "-",
              email: match.email || "-",
              endereco: match.endereco || "-",
              sedeId: s.id,
              sedeNome: s.nome,
            };
            break;
          }
        }
      }

      if (found) {
        setChurch(found);
        
        // Adjust plan limits based on members count
        if (found.membros > 500) {
          setPlanLimits({
            name: "Plano Enterprise",
            price: "85.000 Kz / mês",
            expiration: "30 Jan 2027",
            membersLimit: 5000,
            storageLimit: 50.0,
            storageUsed: 12.8,
          });
        } else if (found.membros < 50) {
          setPlanLimits({
            name: "Plano Básico",
            price: "18.000 Kz / mês",
            expiration: "01 Out 2026",
            membersLimit: 150,
            storageLimit: 5.0,
            storageUsed: 0.85,
          });
        }
      } else {
        showToast("Instituição não encontrada.", "error");
        setTimeout(() => navigate("/super-admin/igrejas"), 1500);
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar detalhes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!church) return;
    const nextStatus = church.status === "ativo" ? "bloqueado" : "ativo";
    const endpointType = church.tipo === "Sede" ? "sedes" : "filhais";

    try {
      await api.patch(`/${endpointType}/${church.id}/status`, { status: nextStatus });
      setChurch((prev) => ({ ...prev, status: nextStatus }));
      showToast(
        `Igreja "${church.nome}" foi ${nextStatus === "ativo" ? "ativada" : "suspensa"} com sucesso.`
      );
    } catch (err) {
      console.error(err);
      showToast("Erro ao alterar status.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/6" />
        <div className="h-14 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-60 bg-slate-200 rounded md:col-span-2" />
          <div className="h-60 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!church) return null;

  // Percentage calculations
  const memberPct = Math.round((church.membros / planLimits.membersLimit) * 100);
  const storagePct = Math.round((planLimits.storageUsed / planLimits.storageLimit) * 100);

  return (
    <div className="space-y-6 fade-in">
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

      {/* Back link */}
      <div>
        <Link
          to="/super-admin/igrejas"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs transition-colors font-medium"
        >
          <ArrowLeft size={14} />
          Voltar para listagem
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
            church.tipo === "Sede" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
          }`}>
            {church.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{church.nome}</h2>
              <Badge variant={church.status === "ativo" ? "success" : church.status === "bloqueado" ? "danger" : "warning"}>
                {church.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
              <Building2 size={12} />
              <span>{church.tipo}</span>
              {church.tipo === "Filial" && (
                <>
                  <span className="text-slate-300">|</span>
                  <span>Sede: <span className="font-semibold text-slate-700">{church.sedeNome}</span></span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={church.status === "ativo" ? "danger" : "primary"}
            size="sm"
            onClick={toggleStatus}
          >
            <ToggleLeft size={15} className="mr-1.5" />
            {church.status === "ativo" ? "Suspender Acesso" : "Ativar Acesso"}
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (Resource Consumption) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Usage Cards */}
          <Card className="shadow-xs" padding="p-6">
            <CardHeader title="Consumo de Recursos" subtitle="Verifique a utilização de cotas atribuídas ao plano" />
            
            <div className="space-y-6 mt-6">
              {/* Member Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Users size={15} className="text-violet-600" />
                    <span>Membros Cadastrados</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    <span className="font-bold text-slate-950">{church.membros}</span> / {planLimits.membersLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      memberPct > 90 ? "bg-red-500" : memberPct > 70 ? "bg-amber-500" : "bg-violet-600"
                    }`}
                    style={{ width: `${Math.min(memberPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{memberPct}% utilizado</span>
                  {memberPct > 80 && (
                    <span className="text-amber-600 flex items-center gap-0.5">
                      <AlertTriangle size={10} /> Cota próxima do limite
                    </span>
                  )}
                </div>
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <HardDrive size={15} className="text-blue-600" />
                    <span>Armazenamento (Média, Arquivos e Dados)</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    <span className="font-bold text-slate-950">{planLimits.storageUsed} GB</span> / {planLimits.storageLimit} GB
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      storagePct > 90 ? "bg-red-500" : storagePct > 70 ? "bg-amber-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(storagePct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{storagePct}% utilizado</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Details / Address Card */}
          <Card className="shadow-xs" padding="p-6">
            <CardHeader title="Informações de Registo & Contactos" subtitle="Morada e meios de comunicação oficiais" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Telefone</span>
                    <span className="font-medium text-slate-800">{church.telefone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Email Principal</span>
                    <span className="font-medium text-slate-800">{church.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Endereço</span>
                    <span className="font-medium text-slate-800">{church.endereco}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Status de Operação</span>
                    <span className="font-semibold text-slate-800 capitalize">{church.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Plan / Hierarchy details) */}
        <div className="space-y-6">
          {/* Plan / Subscription Details */}
          <Card className="shadow-xs bg-slate-900 text-white border-none" padding="p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                Subscrição Activa
              </span>
              <CreditCard size={18} className="text-violet-400" />
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold">{planLimits.name}</h3>
              <p className="text-slate-400 text-xs mt-1">Mensalidade recorrente no SaaS</p>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Mensalidade:</span>
                <span className="font-bold text-slate-100">{planLimits.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Renovação / Expiração:</span>
                <span className="font-semibold text-slate-100">{planLimits.expiration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de pagamento:</span>
                <span className="text-slate-200">Transferência Bancária</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white justify-center border-none shadow-lg shadow-violet-600/20"
                onClick={() => showToast("Solicitação de alteração de plano enviada ao suporte.", "success")}
              >
                Gerir Licenciamento
              </Button>
            </div>
          </Card>

          {/* Sibling/Subordinate Hierarchy details */}
          <Card className="shadow-xs" padding="p-5">
            {church.tipo === "Sede" ? (
              <>
                <CardHeader title="Filiais Vinculadas" subtitle={`Total: ${church.filiais?.length || 0}`} />
                <div className="mt-4 space-y-3.5 max-h-60 overflow-y-auto scrollbar-thin">
                  {church.filiais && church.filiais.length > 0 ? (
                    church.filiais.map((f) => (
                      <Link
                        key={f.id}
                        to={`/super-admin/igrejas/${f.id}?type=Filial`}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-md transition-all text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                            {f.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800">{f.nome}</span>
                        </div>
                        <Badge variant={f.status === "ativo" ? "success" : "danger"}>
                          {f.status}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Esta Sede não possui filiais vinculadas.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <CardHeader title="Sede Vinculada" />
                <div className="mt-4">
                  <Link
                    to={`/super-admin/igrejas/${church.sedeId}?type=Sede`}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-violet-300 transition-colors text-xs"
                  >
                    <Building2 size={16} className="text-slate-400" />
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sede Tutora</span>
                      <span className="font-bold text-slate-800 hover:text-violet-600 transition-colors">{church.sedeNome}</span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
