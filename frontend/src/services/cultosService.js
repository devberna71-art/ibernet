import api from '../api/axiosConfig';

// Listar cultos agrupados por tipo
export const getCultosAgrupados = async () => {
  const response = await api.get('/cultos');
  return response.data;
};

// Obter detalhes de um culto específico (com presenças e contribuições)
export const getCultoDetalhes = async (id) => {
  const response = await api.get(`/detalhes-cultos/${id}`);
  return response.data;
};

// Cadastrar um novo culto + contribuições + presenças
export const criarCulto = async (data) => {
  const response = await api.post('/detalhes-cultos', data);
  return response.data;
};

// Atualizar um culto existente + contribuições + presenças
export const atualizarCulto = async (id, data) => {
  const response = await api.put(`/detalhes-cultos/${id}`, data);
  return response.data;
};

// Excluir um culto + contribuições + presenças
export const deletarCulto = async (id) => {
  const response = await api.delete(`/detalhes-cultos/${id}`);
  return response.data;
};

// Excluir contribuição de um membro específico no contexto de um culto
export const deletarMembroContribuicao = async (cultoId, { tipoId, membroId }) => {
  const response = await api.delete(`/detalhes-cultos/${cultoId}/contribuicao`, {
    data: { tipoId, membroId }
  });
  return response.data;
};

// Obter próximos cultos agendados
export const getProximosCultos = async () => {
  const response = await api.get('/cultos/proximos');
  return response.data;
};

// Listar tipos de culto disponíveis para formulários
export const getListaTiposCulto = async () => {
  const response = await api.get('/lista/tipos-culto');
  return response.data;
};

// Obter tabela detalhada de tipos de cultos para gestão
export const getTabelaTiposCultos = async () => {
  const response = await api.get('/tabela-cultos1');
  return response.data;
};

// Cadastrar um novo tipo de culto
export const criarTipoCulto = async (data) => {
  const response = await api.post('/tipocultos', data);
  return response.data;
};

// Atualizar um tipo de culto existente
export const atualizarTipoCulto = async (id, data) => {
  const response = await api.put(`/tipocultos/${id}`, data);
  return response.data;
};

// Excluir um tipo de culto
export const deletarTipoCulto = async (id) => {
  const response = await api.delete(`/tipocultos/${id}`);
  return response.data;
};

// Obter presenças de um culto específico
export const getPresencasCulto = async (id) => {
  const response = await api.get(`/cultos/${id}/presencas`);
  return response.data;
};

// Registrar presenças em um culto específico
export const registrarPresencas = async (id, data) => {
  const response = await api.post(`/cultos/${id}/presencas`, data);
  return response.data;
};

// Atualizar status de um culto
export const atualizarStatusCulto = async (id, status) => {
  const response = await api.put(`/cultos/${id}/status`, { status });
  return response.data;
};
