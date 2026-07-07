// src/components/AniversarioMes.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { CircularProgress, MenuItem, FormControl, Select, InputLabel, Avatar, useTheme } from "@mui/material";
import { Cake, CalendarDays, UserRound } from "lucide-react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AniversarianteMes = () => {
  const theme = useTheme();
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  // Exemplo de integração da tua lógica mantendo o estado limpo
  useEffect(() => {
    const carregarAniversariantes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/membros/aniversariantes?mes=${mes}`);
        setLista(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar aniversariantes do mês:", err);
      } finally {
        setLoading(false);
      }
    };
    carregarAniversariantes();
  }, [mes]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left">
      {/* Filtro Operacional Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Histórico de Celebrações</h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Consulte os registos por período mensal.</p>
        </div>

        <FormControl size="small" className="min-w-[160px]">
          <InputLabel id="select-mes-label">Mês de Referência</InputLabel>
          <Select
            labelId="select-mes-label"
            value={mes}
            label="Mês de Referência"
            onChange={(e) => setMes(e.target.value)}
            sx={{ fontSize: "13px", color: theme.palette.text.primary }}
          >
            {meses.map((m, i) => (
              <MenuItem key={i} value={i + 1} sx={{ fontSize: "13px" }}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <CircularProgress size={20} className="text-primary" />
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">
          <p className="text-xs font-medium text-slate-400">Nenhum registo de aniversário encontrado para o período.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Membro</th>
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Data</th>
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Idade Estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((pessoa) => {
                const dataNasc = new Date(pessoa.data_nascimento);
                const idade = new Date().getFullYear() - dataNasc.getFullYear();

                return (
                  <tr key={pessoa.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 flex items-center gap-2.5">
                      <Avatar
                        variant="rounded"
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '6px',
                          bgcolor: 'rgba(59, 130, 246, 0.1)', 
                          color: '#3b82f6' 
                        }}
                      >
                        <UserRound size={14} />
                      </Avatar>
                      <span className="text-xs font-bold text-slate-700">{pessoa.nome}</span>
                    </td>
                    <td className="p-3 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400" />
                        {dataNasc.toLocaleDateString("pt-PT", { day: '2-digit', month: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-3 text-xs font-bold text-slate-500 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Cake size={13} className="text-amber-500" />
                        {idade} anos
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AniversarianteMes;