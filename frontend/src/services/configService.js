import api from '../api/axiosConfig';

// Departamentos
export const getDepartamentos = async () => {
  const response = await api.get('/departamentos');
  return response.data;
};

export const getDepartamentosMembros = async () => {
  const response = await api.get('/departamentos-membros');
  return response.data;
};

export const deleteDepartamento = async (id) => {
  const response = await api.delete(`/departamentos/${id}`);
  return response.data;
};

export const updateDepartamento = async (id, data) => {
  const response = await api.put(`/departamentos/${id}`, data);
  return response.data;
};

export const createDepartamento = async (data) => {
  const response = await api.post('/departamentos', data);
  return response.data;
};

// Tipos de Contribuição
export const getTiposContribuicao = async () => {
  const response = await api.get('/lista/tipos-contribuicao');
  return response.data;
};

export const deleteTipoContribuicao = async (id) => {
  const response = await api.delete(`/tipos-contribuicao/${id}`);
  return response.data;
};

export const updateTipoContribuicao = async (id, data) => {
  const response = await api.put(`/tipos-contribuicao/${id}`, data);
  return response.data;
};

export const createTipoContribuicao = async (data) => {
  const response = await api.post('/tipos-contribuicao', data);
  return response.data;
};

// Cargos e Atribuições
export const getCargos = async () => {
  const response = await api.get('/cargos');
  return response.data;
};

export const getMembrosParaAtribuicao = async () => {
  const response = await api.get('/membros');
  return response.data;
};

export const atribuirCargoMembro = async (data) => {
  const response = await api.post('/atribuir-cargos', data);
  return response.data;
};
