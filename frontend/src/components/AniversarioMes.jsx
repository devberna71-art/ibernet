import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { FaBirthdayCake, FaCalendarAlt } from "react-icons/fa";

/* 🌈 Fundo elegante alinhado ao Design System */
const Background = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(to bottom, #f8faff, #ffffff)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(8, 3),
  position: "relative",
  overflow: "hidden",
}));

const SelectBox = styled(FormControl)(({ theme }) => ({
  minWidth: 220,
  marginBottom: theme.spacing(4),
  zIndex: 3,
}));

const TablePaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "1000px",
  padding: theme.spacing(1),
  overflow: "hidden",
  zIndex: 2,
}));

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AniversarianteMes = () => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscar = async (m) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/aniversarios/mes/${m}`);
      setLista(data.aniversariantes || []);
    } catch (error) {
      console.error("Erro ao buscar aniversariantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscar(mes);
  }, [mes]);

  return (
    <Background>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 2, textAlign: "center" }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: "primary.main",
            letterSpacing: "-0.02em",
          }}
        >
          🎉 Aniversariantes do Mês
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            mb: 4,
          }}
        >
          Veja quem está comemorando neste mês 💙
        </Typography>

        <SelectBox variant="outlined">
          <InputLabel>Mês</InputLabel>
          <Select
            value={mes}
            label="Mês"
            onChange={(e) => setMes(e.target.value)}
          >
            {meses.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </SelectBox>
      </motion.div>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="40vh"
          zIndex={2}
        >
          <CircularProgress />
        </Box>
      ) : lista.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", mt: 6 }}
        >
          Nenhum aniversariante neste mês 🎈
        </Typography>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", display: "flex", justifyContent: "center", zIndex: 2 }}
        >
          <TablePaper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>Idade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lista.map((pessoa, index) => {
                  const dataNasc = new Date(pessoa.data_nascimento);
                  const idade =
                    new Date().getFullYear() - dataNasc.getFullYear() -
                    (new Date().getMonth() < dataNasc.getMonth() ||
                    (new Date().getMonth() === dataNasc.getMonth() &&
                      new Date().getDate() < dataNasc.getDate())
                      ? 1
                      : 0);
                  return (
                    <TableRow key={pessoa.id || index}>
                      <TableCell>
                        <Avatar
                          src={pessoa.foto || "/default-user.png"}
                          alt={pessoa.nome}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {pessoa.nome}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FaCalendarAlt style={{ color: "#2563EB" }} />
                          {dataNasc.toLocaleDateString("pt-BR")}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FaBirthdayCake style={{ color: "#D97706" }} />
                          {idade} anos
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TablePaper>
        </motion.div>
      )}
    </Background>
  );
};

export default AniversarianteMes;

