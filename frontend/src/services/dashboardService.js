import api from '../api/axiosConfig';

// Obter dados consolidados do dashboard
export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

// Gestão de Usuários Avançada
export const getGestaoUsuarios = async (params = {}) => {
  const response = await api.get('/gestao-usuarios', { params });
  return response.data;
};

// Dashboard - Top Contribuidores
export const getTopContribuidores = async () => {
  const response = await api.get('/dashboard/top-contribuidores');
  return response.data;
};

// Dashboard - Novos Membros
export const getNovosMembros = async () => {
  const response = await api.get('/dashboard/novos-membros');
  return response.data;
};

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

// Tipos de Despesa com Totais
export const getTiposDespesa = async () => {
  const response = await api.get('/lista/tipos-despesa');
  return response.data;
};

// CRUD Despesas
export const atualizarDespesa = async (id, data) => {
  const response = await api.put(`/despesas/${id}`, data);
  return response.data;
};

export const excluirDespesa = async (id) => {
  const response = await api.delete(`/despesas/${id}`);
  return response.data;
};

export const getTotaisDespesas = async () => {
  const response = await api.get('/despesas/totais');
  return response.data;
};

export const cadastrarDespesaSimplificado = async (data) => {
  const response = await api.post('/cadastro/despesas', data);
  return response.data;
};

// Despesas por Categoria
export const getDespesasPorCategoria = async (categoriaId) => {
  const response = await api.get(`/categorias/${categoriaId}/despesas`);
  return response.data;
};
