import axios from "axios";

console.log("AXIOS CARREGADO - PRODUCAO");

const api = axios.create({
  baseURL: "https://api.ibernet.online",
});

api.interceptors.request.use((config) => {
  console.log("REQUISICAO:", config.baseURL, config.url);

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;