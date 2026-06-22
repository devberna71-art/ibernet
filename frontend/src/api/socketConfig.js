import { io } from "socket.io-client";



// Detecta automaticamente se conecta na nuvem ou no PC local
const URL = process.env.NODE_ENV === 'production'
  ? 'https://api.ibernet.online' // Endereço do seu Back-end no Docploy
  : 'http://localhost:8000';      // Endereço local

const socket = io(URL, {
  autoConnect: false, // Conecte manualmente no seu useEffect do ChatPage
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("Conectado ao servidor! ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Erro de conexão Socket:", err.message);
});

export default socket;