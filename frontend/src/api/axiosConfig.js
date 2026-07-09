import axios from 'axios';

// Detecta automaticamente se conecta na nuvem ou no PC local usando variáveis de ambiente (suporta Vite e fallback CRA)
const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';
const URL = isProduction
  ? import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL_PROD || 'https://api.ibernet.online'
  : import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: URL,
  timeout: 30000, // 30 segundos timeout
});

// Interceptor para enviar o token automaticamente em todas as requisições
api.interceptors.request.use(
  config => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Adiciona o header Authorization no formato Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Qualquer erro na requisição
    return Promise.reject(error);
  }
);

// Interceptor de resposta - Error Handling Global
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Erro de rede
    if (!error.response) {
      console.error('Erro de rede:', error.message);
      return Promise.reject({
        message: 'Erro de conexão. Verifique sua internet.',
        originalError: error
      });
    }

    // Erros de resposta HTTP
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Não autorizado:', data);
        // Token expirado ou inválido - redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject({
          message: 'Sessão expirada. Por favor, faça login novamente.',
          status,
          originalError: error
        });

      case 403:
        console.error('Acesso negado:', data);
        return Promise.reject({
          message: 'Você não tem permissão para realizar esta ação.',
          status,
          originalError: error
        });

      case 404:
        console.error('Recurso não encontrado:', data);
        return Promise.reject({
          message: 'Recurso não encontrado.',
          status,
          originalError: error
        });

      case 422:
        console.error('Erro de validação:', data);
        return Promise.reject({
          message: data.message || 'Dados inválidos enviados.',
          status,
          originalError: error
        });

      case 500:
        console.error('Erro interno do servidor:', data);
        return Promise.reject({
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          status,
          originalError: error
        });

      default:
        console.error('Erro na requisição:', data);
        return Promise.reject({
          message: data.message || 'Ocorreu um erro na requisição.',
          status,
          originalError: error
        });
    }
  }
);

export default api;