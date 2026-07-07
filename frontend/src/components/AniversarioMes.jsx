import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { CircularProgress, MenuItem, FormControl, Select, InputLabel, Avatar, useTheme } from "@mui/material";
import { Cake, CalendarDays, UserRound } from "lucide-react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AniversarianteMes = () => {
  const theme = useTheme(); // Acessando o seu eclesiaTheme
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... lógica de buscar continua a mesma

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.palette.text.primary }}>
          Aniversariantes do Mês
        </h2>
        <p className="mb-6" style={{ color: theme.palette.text.secondary }}>
          Veja quem está comemorando neste mês.
        </p>

        <FormControl size="small" className="min-w-[200px]">
          <InputLabel>Mês</InputLabel>
          <Select value={mes} label="Mês" onChange={(e) => setMes(e.target.value)}>
            {meses.map((m, i) => (
              <MenuItem key={i} value={i + 1}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl" style={{ borderColor: theme.palette.divider, backgroundColor: theme.palette.background.default }}>
          <p style={{ color: theme.palette.text.disabled }}>Nenhum aniversariante encontrado neste mês.</p>
        </div>
      ) : (
        <div className="rounded-xl shadow-sm overflow-hidden border" style={{ borderColor: theme.palette.divider }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: theme.palette.secondary.light }}>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.palette.text.secondary }}>Membro</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.palette.text.secondary }}>Data</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: theme.palette.text.secondary }}>Idade</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.palette.divider }}>
              {lista.map((pessoa) => {
                const dataNasc = new Date(pessoa.data_nascimento);
                const idade = new Date().getFullYear() - dataNasc.getFullYear();

                return (
                  <tr key={pessoa.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: theme.palette.background.paper }}>
                    <td className="p-4 flex items-center gap-3">
                      <Avatar
                        variant="rounded"
                        sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}
                      >
                        <UserRound size={20} />
                      </Avatar>
                      <span className="font-medium" style={{ color: theme.palette.text.primary }}>{pessoa.nome}</span>
                    </td>
                    <td className="p-4 text-sm flex items-center gap-2" style={{ color: theme.palette.text.secondary }}>
                      <CalendarDays size={16} style={{ color: theme.palette.primary.main }} />
                      {dataNasc.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="p-4 text-sm text-right font-medium" style={{ color: theme.palette.text.secondary }}>
                      <div className="flex items-center justify-end gap-2">
                        <Cake size={16} style={{ color: theme.palette.warning.main }} />
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