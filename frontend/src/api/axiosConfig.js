import axios from 'axios';

// Detecta automaticamente se conecta na nuvem ou no PC local
const URL = process.env.NODE_ENV === 'production'
  ? 'https://api.ibernet.online' // Endereço do seu Back-end no Docploy
  : 'http://localhost:8000';      // Endereço local

const api = axios.create({
  baseURL: URL, // 💡 Corrigido aqui: mudamos de baseURL para URL
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

export default api;