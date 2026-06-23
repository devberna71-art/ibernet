// src/api/axiosConfig.js
import axios from 'axios';

// Detecta automaticamente o ambiente
const baseURL = 'https://api.ibernet.online' // URL da API que configuraremos no Docploy
  
const api = axios.create({
  baseURL: baseURL,
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
