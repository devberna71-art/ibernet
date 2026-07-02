import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import api from "../api/axiosConfig";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function AtribuirCargoMembro({ cargos }) {
  const [membros, setMembros] = useState([]);
  const [membroSelecionado, setMembroSelecionado] = useState("");
  const [cargoSelecionado, setCargoSelecionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const res = await api.get("/membros");
        setMembros(res.data);
      } catch {
        showToast("Erro ao carregar membros.", "error");
      }
    };
    fetchMembros();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAtribuir = async (e) => {
    e.preventDefault();
    if (!membroSelecionado || !cargoSelecionado) {
      showToast("Selecione o membro e o cargo correspondentes.", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/atribuir-cargos", { membroId: membroSelecionado, cargoId: cargoSelecionado });
      showToast("Cargo atribuído ao membro com sucesso!");
      setMembroSelecionado("");
      setCargoSelecionado("");
    } catch {
      showToast("Erro ao atribuir cargo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding="p-5 md:p-6" className="mt-6 border-primary/10">
      {/* Toast popup */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error"
            ? "bg-danger/5 border-danger/20 text-danger"
            : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <UserCheck size={16} className="text-primary" />
        <h3 className="text-xs font-bold text-text uppercase tracking-wide">
          Atribuir Cargo a Membro
        </h3>
      </div>

      <form onSubmit={handleAtribuir} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Selecionar Membro */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Membro
          </label>
          <select
            value={membroSelecionado}
            onChange={(e) => setMembroSelecionado(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Selecione um membro</option>
            {membros.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Selecionar Cargo */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1.5">
            Cargo
          </label>
          <select
            value={cargoSelecionado}
            onChange={(e) => setCargoSelecionado(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Selecione um cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin shrink-0" />
                Atribuindo...
              </>
            ) : (
              'Atribuir Cargo'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
