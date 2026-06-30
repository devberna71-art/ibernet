import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import api from "../api/axiosConfig";
import ListCard, { ListCardItem } from "./ui/ListCard";

export default function ProximosCultos() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/cultos/proximos")
      .then((res) => setDados(res.data?.proximosCultos || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-soft border border-surfaceMuted/60 h-72 flex items-center justify-center">
        <CircularProgress size={26} />
      </div>
    );
  }

  const items = dados.map((culto) => {
    const date = culto.data ? new Date(culto.data) : null;
    return {
      id: culto.id,
      month: date
        ? date.toLocaleDateString("pt-PT", { month: "short" }).replace(".", "")
        : "—",
      day: date ? String(date.getDate()).padStart(2, "0") : "—",
      title: culto.tipo || culto.nome || "Culto",
      meta: [
        culto.hora && `às ${culto.hora}`,
        culto.presencas != null && `${culto.presencas} presentes`,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  });

  return (
    <ListCard
      title="Próximos Cultos"
      subtitle="Agenda dos eventos da igreja"
      viewAllTo="/TabelaCulto"
      items={items}
      emptyMessage="Nenhum culto agendado."
      renderItem={(item) => (
        <ListCardItem
          key={item.id}
          month={item.month}
          day={item.day}
          title={item.title}
          meta={item.meta}
        />
      )}
    />
  );
}
