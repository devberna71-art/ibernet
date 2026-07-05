import React from "react";
import { Baby, Users, GraduationCap, User, UserRound, UserCheck, UserRoundCheck } from "lucide-react";
import Card from "./ui/Card";

const GROUPS = [
  { label: "Crianças", key: "criancas", icon: Baby },
  { label: "Adolescentes", key: "adolescentes", icon: Users },
  { label: "Jovens", key: "jovens", icon: GraduationCap },
  { label: "Adultos", key: "adultos", icon: User },
  { label: "Idosos", key: "idosos", icon: UserRound },
];

function StatTile({ label, value, icon: Icon, large = false }) {
  return (
    <Card className="flex flex-col justify-between min-h-[180px]">
      <div className="flex items-center justify-center w-11 h-11 rounded-sm bg-primarySoft text-primary mb-4">
        <Icon size={large ? 28 : 22} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-2xs font-semibold uppercase tracking-wide text-textMuted mb-1">
          {label}
        </p>
        <p className={`font-bold text-text leading-none ${large ? "text-4xl md:text-5xl" : "text-3xl"}`}>
          {value}
        </p>
      </div>
    </Card>
  );
}

export default function Distribuicoes({ dados }) {
  const grupos = dados?.membros?.classificacaoGrupos || {
    criancas: 0,
    adolescentes: 0,
    jovens: 0,
    adultos: 0,
    idosos: 0,
  };
  const genero = dados?.membros?.distribuicaoGenero || { homens: 0, mulheres: 0 };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-2xs font-semibold uppercase tracking-wide text-textMuted mb-1">
          Estatísticas em tempo real
        </p>
        <h2 className="text-2xl font-bold text-text">Segmentação Demográfica</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        {GROUPS.map(({ label, key, icon }) => (
          <StatTile key={key} label={label} value={grupos[key] ?? 0} icon={icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatTile
          label="Homens Registrados"
          value={genero.homens}
          icon={UserCheck}
          large
        />
        <StatTile
          label="Mulheres Registradas"
          value={genero.mulheres}
          icon={UserRoundCheck}
          large
        />
      </div>
    </section>
  );
}
