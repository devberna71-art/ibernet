import React from "react";
import { Baby, Users, GraduationCap, User, UserRound, UserCheck, UserRoundCheck } from "lucide-react";

export default function Distribuicoes({ dados }) {
  const grupos = dados?.membros?.classificacaoGrupos || { criancas: 0, adolescentes: 0, jovens: 0, adultos: 0, idosos: 0 };
  const genero = dados?.membros?.distribuicaoGenero || { homens: 0, mulheres: 0 };

  const sections = [
    { label: "Crianças", val: grupos.criancas, color: "#3b82f6", icon: <Baby size={26} /> },
    { label: "Adolescentes", val: grupos.adolescentes, color: "#8b5cf6", icon: <Users size={26} /> },
    { label: "Jovens", val: grupos.jovens, color: "#10b981", icon: <GraduationCap size={26} /> },
    { label: "Adultos", val: grupos.adultos, color: "#f97316", icon: <User size={26} /> },
    { label: "Idosos", val: grupos.idosos, color: "#f43f5e", icon: <UserRound size={26} /> },
  ];

  return (
    <div className="bg-[#f8fafc] p-4 md:p-10 min-h-screen">
      {/* Header com design de Dashboard Moderno */}
      <div className="mb-8 max-w-[600px]">
        <p className="mb-1 text-[0.7rem] font-black tracking-[0.25em] text-[#64748b]">
          ESTATÍSTICAS EM TEMPO REAL
        </p>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#211D19] md:text-[2.5rem]">
          Segmentação Demográfica
        </h2>
      </div>

      {/* Grid Grupos */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
        {sections.map((item, idx) => (
          <div
            key={idx}
            className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/50 bg-white/80 p-4 shadow-[0_8px_32px_rgba(31,38,135,0.05)] backdrop-blur-[12px] transition-all duration-600 ease-in-out hover:-translate-y-3 hover:border-opacity-30 hover:bg-white/95 hover:shadow-xl"
            style={{
              borderColor: `${item.color}44`,
              boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.05)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${item.color}44`;
              e.currentTarget.style.boxShadow = `0 24px 48px -12px ${item.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.05)';
            }}
          >
            <div
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f1f5f9] text-[#475569] transition-all duration-500 ease-in-out"
              style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {item.icon}
            </div>
            <div>
              <p className="mb-0.5 text-[0.7rem] font-extrabold uppercase tracking-[0.15em] text-[#64748b]">
                {item.label}
              </p>
              <p
                className="font-sans text-3xl font-extrabold leading-none text-[#211D19] transition-all duration-400 ease-in-out"
                style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}
              >
                {item.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gênero (Destaque) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "Homens Registrados", val: genero.homens, color: "#0d9488", icon: <UserCheck size={40} /> },
          { label: "Mulheres Registradas", val: genero.mulheres, color: "#db2777", icon: <UserRoundCheck size={40} /> }
        ].map((g, i) => (
          <div
            key={i}
            className="relative flex min-h-[220px] flex-row items-center justify-between gap-3 overflow-hidden rounded-[28px] border border-white/50 bg-white/80 p-5 shadow-[0_8px_32px_rgba(31,38,135,0.05)] backdrop-blur-[12px] transition-all duration-600 ease-in-out hover:-translate-y-3 hover:border-opacity-30 hover:bg-white/95 hover:shadow-xl"
            style={{
              borderColor: `${g.color}44`,
              boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.05)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${g.color}44`;
              e.currentTarget.style.boxShadow = `0 24px 48px -12px ${g.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.05)';
            }}
          >
            <div
              className="flex h-18 w-18 items-center justify-center rounded-[20px] bg-[#f1f5f9] text-[#475569] transition-all duration-500 ease-in-out"
              style={{ width: '72px', height: '72px', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {g.icon}
            </div>
            <div>
              <p className="mb-0.5 text-[0.85rem] font-extrabold uppercase tracking-[0.15em] text-[#64748b]">
                {g.label}
              </p>
              <p
                className="font-sans text-[4.5rem] font-extrabold leading-none text-[#211D19] transition-all duration-400 ease-in-out"
                style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1 }}
              >
                {g.val}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
