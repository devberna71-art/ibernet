import api from '../api/axiosConfig';

// Busca Avançada de Membros
export const buscarMembrosAvancada = async (filtros) => {
  const response = await api.post('/lista/membros', filtros);
  return response.data;
};

// Filtros Disponíveis para Relatórios
export const getFiltrosMembros = async () => {
  const response = await api.get('/lista/filtros-membros');
  return response.data;
};
