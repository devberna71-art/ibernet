import api from '../api/axiosConfig';

// Status do Usuário
export const getUsuarioStatus = async () => {
  const response = await api.get('/usuario/status');
  return response.data;
};

// Perfil do Usuário
export const getMeuPerfil = async () => {
  const response = await api.get('/meu-perfil');
  return response.data;
};

export const updateMeuPerfil = async (data) => {
  const response = await api.put('/meu-perfil', data);
  return response.data;
};
