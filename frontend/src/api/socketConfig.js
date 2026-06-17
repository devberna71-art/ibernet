import { io } from "socket.io-client";

const URL = "http://localhost:8000"; 

const socket = io(URL, {
  autoConnect: false, // Conecte manualmente no seu useEffect do ChatPage
  reconnection: true,
  reconnectionAttempts: 5,
  // Remova a linha 'transports' para permitir a negociação correta
});

socket.on("connect", () => {
  console.log("Conectado ao servidor! ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Erro de conexão Socket:", err.message);
});

export default socket;