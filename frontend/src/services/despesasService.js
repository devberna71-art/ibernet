import api from '../api/axiosConfig';

// --- CATEGORIAS ---

// Listar categorias com total de despesas
export const getCategoriasDespesas = async () => {
  const response = await api.get('/categorias/despesas');
  return response.data;
};

// Cadastrar nova categoria
export const cadastrarCategoria = async (data) => {
  const response = await api.post('/categorias', data);
  return response.data;
};

// Atualizar categoria existente
export const atualizarCategoria = async (id, data) => {
  const response = await api.put(`/categorias/${id}`, data);
  return response.data;
};

// Excluir categoria
export const excluirCategoria = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
};

// --- DESPESAS ---

export const getDespesas = async (params = {}) => {
  const response = await api.get('/lista/despesas', { params });
  return response.data;
};

export const cadastrarDespesa = async (data) => {
  const response = await api.post('/despesas', data);
  return response.data;
};

export const atualizarDespesa = async (id, data) => {
  const response = await api.put(`/despesas/${id}`, data);
  return response.data;
};

export const excluirDespesa = async (id) => {
  const response = await api.delete(`/despesas/${id}`);
  return response.data;
};

export const getDespesasPorCategoria = async (categoriaId) => {
  const response = await api.get(`/categorias/${categoriaId}/despesas`);
  return response.data;
};

export const getTotaisDespesas = async () => {
  const response = await api.get('/despesas/totais');
  return response.data;
};

export const getTiposDespesa = async () => {
  const response = await api.get('/lista/tipos-despesa');
  return response.data;
};

export const getRelatorioDespesas = async (params) => {
  const response = await api.get('/relatorio/despesas', { params });
  return response.data;
};

