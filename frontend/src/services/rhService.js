import api from '../api/axiosConfig';

// Subsidios
export const getSubsidios = async (params = {}) => {
  const response = await api.get('/subsidios', { params });
  return response.data;
};

export const deleteSubsidio = async (id) => {
  const response = await api.delete(`/subsidios/${id}`);
  return response.data;
};

export const createSubsidio = async (data) => {
  const response = await api.post('/subsidios', data);
  return response.data;
};

export const updateSubsidio = async (id, data) => {
  const response = await api.put(`/subsidios/${id}`, data);
  return response.data;
};

// Salarios
export const getSalarios = async (params = {}) => {
  const response = await api.get('/salarios/lista', { params });
  return response.data;
};

export const deleteSalario = async (id) => {
  const response = await api.delete(`/salarios/${id}`);
  return response.data;
};

export const createSalario = async (data) => {
  const response = await api.post('/salarios', data);
  return response.data;
};

export const updateSalario = async (id, data) => {
  const response = await api.put(`/salarios/${id}`, data);
  return response.data;
};

// Descontos
export const getDescontos = async (params = {}) => {
  const response = await api.get('/descontos', { params });
  return response.data;
};

export const deleteDesconto = async (id) => {
  const response = await api.delete(`/descontos/${id}`);
  return response.data;
};

export const createDesconto = async (data) => {
  const response = await api.post('/descontos', data);
  return response.data;
};

export const updateDesconto = async (id, data) => {
  const response = await api.put(`/descontos/${id}`, data);
  return response.data;
};
