require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const http = require('http'); // 🚀 Módulo HTTP nativo
const { Server } = require('socket.io'); // 🚀 Server do socket.io

const app = express();
const PORT = process.env.PORT || 8000;
const auth = require('./middlewere/auth');

// 1. Criamos o servidor HTTP encapsulando o app do Express antes das rotas
const server = http.createServer(app);

// 2. Inicializamos o Socket.io anexado ao servidor HTTP com tratamento completo de CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// 3. Configuração global do CORS para o Express (Axios)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 🔥 MIDDLEWARE ESSENCIAL: Disponibiliza o 'io' em qualquer Controller através de 'req.io'
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. Configuração correta de Body Parsers (Evitando conflitos de processamento de JSON)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração de Sessão
const session = require('express-session');
app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Importação das Models principais do Chat
const Membros = require("./modells/Membros");
const ChatConversa = require("./modells/Chat/conversas");
const ChatParticipante = require("./modells/Chat/Participantes");
const ChatMensagem = require("./modells/Chat/Mensagem");
const ChatLeitura = require("./modells/Chat/ChatLeitura"); // 🌟 Sua nova tabela de controle de leitura

// Configuração de conexões em tempo real nas salas do Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 [SOCKET] Novo usuário conectado: ${socket.id}`);

  // Evento para o usuário entrar em uma sala específica da conversa
  socket.on('join_room', (room) => {
    socket.join(String(room));
    console.log(`🚪 [SOCKET] Usuário ${socket.id} entrou na sala/conversa: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ [SOCKET] Usuário desconectado: ${socket.id}`);
  });
});

// ROTAS DIRETAS DO SERVIDOR
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando perfeitamente com WebSockets!' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/usuario/me", auth, (req, res) => {
  console.log("🚀 [BACKEND] Respondendo /usuario/me com os dados do auth:", req.usuario);
  return res.status(200).json({ usuario: req.usuario });
});

// 🌟 NOVA ROTA: MARCAR CONVERSA COMO LIDA (Zerar notificações usando o ChatLeitura)
app.post("/conversas/ler", auth, async (req, res) => {
  try {
    const meuMembroId = req.usuario.MembroId;
    const { ChatConversaId } = req.body;

    if (!ChatConversaId) {
      return res.status(400).json({ message: "ChatConversaId é obrigatório" });
    }

    // Graças ao índice único que você criou, ele insere se for novo ou atualiza se já existir!
    await ChatLeitura.upsert({
      MembroId: meuMembroId,
      ChatConversaId: ChatConversaId,
      ultima_leitura_em: new Date()
    });

    return res.status(200).json({ success: true, message: "Conversa marcada como lida com sucesso." });
  } catch (error) {
    console.error("❌ Erro ao atualizar status de leitura:", error);
    return res.status(500).json({ message: "Erro ao atualizar leitura", error: error.message });
  }
});

// HISTÓRICO DE UMA CONVERSA
app.get("/conversa/:id", auth, async (req, res) => {
  console.log(`\n🔍 [GET] Rota /conversa/${req.params.id} acionada!`);
  try {
    const conversaId = req.params.id;

    if (isNaN(conversaId)) {
      return res.status(400).json({ message: "ID da conversa inválido." });
    }

    const conversa = await ChatConversa.findByPk(conversaId, {
      include: [
        {
          model: ChatMensagem,
          as: "ChatMensagems", 
          include: [
            {
              model: Membros,
              as: "Membro", 
              attributes: ["id", "nome", "foto", "email"]
            }
          ]
        }
      ],
      order: [
        [{ model: ChatMensagem, as: "ChatMensagems" }, "createdAt", "ASC"]
      ]
    });

    if (!conversa) {
      return res.status(404).json({ message: "Conversa não encontrada." });
    }

    const respostaFormatada = conversa.toJSON();
    respostaFormatada.mensagens = respostaFormatada.ChatMensagems || [];

    return res.status(200).json(respostaFormatada);

  } catch (error) {
    console.error("❌ [ERRO CRÍTICO] Falha ao carregar histórico no banco:", error);
    return res.status(500).json({ message: "Erro ao buscar conversa", error: error.message });
  }
});

// CONTROLLERS / ROTAS SECUNDÁRIAS
const DespesaController = require("./routes/DespesaController");
app.use("/", DespesaController);

const UsuarioController = require("./routes/UsuarioControllers");
app.use("/", UsuarioController);

const ChatController = require("./routes/ChatController");
app.use("/", ChatController);

const RelatoriosController = require("./routes/RelatoriosController");
app.use("/", RelatoriosController);

const GraficoController = require("./routes/GraficoController");
app.use("/", GraficoController);

// Demais Models carregados no escopo do Sequelize
const bcrypt = require("bcrypt");
const usuarios = require("./modells/Usuarios");
const TipoContribuicao = require("./modells/TipoContribuicao");
const Contribuicao = require("./modells/Contribuicoes");
const Despesas = require("./modells/Despesas");
const Cargo = require("./modells/Cargo");
const CargoMembro = require("./modells/CargoMembro");
const Cultos = require("./modells/Cultos");
const Presencas = require("./modells/Presencas");
const Departamentos = require("./modells/Departamentos");
const DepartamentoMembros = require("./modells/DptMembros");
const DadosAcademicos = require("./modells/DadosAcademicos");
const DadosCristaos = require("./modells/DadosCristaos");
const Diversos = require("./modells/Diversos");
const TipoCultos = require("./modells/TipoCulto");

// Inicializa conexão com o banco e sobe o servidor HTTP unificado
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados com sucesso.');
    await sequelize.sync({ force: false });

    // 🔥 IMPORTANTE: Iniciamos estritamente o 'server' para que rotas HTTP e Sockets andem juntos!
    server.listen(PORT, () => {
      console.log(`🚀 Servidor e WebSockets rodando em http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  }
})();