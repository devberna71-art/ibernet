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

// 🌟 LISTA DE ORIGENS PERMITIDAS (Local e Produção)
const origensPermitidas = [
  'https://ibernet.online',
  'http://localhost:3000',
  'https://www.ibernet.online',
  'https://api.ibernet.online'
];

// 2. Inicializamos o Socket.io anexado ao servidor HTTP com tratamento completo de CORS dinâmico
const io = new Server(server, {
  cors: {
    origin: origensPermitidas,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// 3. Configuração global do CORS para o Express (Axios)
app.use(cors({
  origin: origensPermitidas,
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
const Usuario = require('./modells/Usuarios');
const router = require('./routes/UsuarioControllers');


// GET - Listar usuários com Filtros Avançados, Busca e Paginação + Métricas Gerais
router.get('/gestao-usuarios', auth, async (req, res) => {
  try {
    const { SedeId, FilhalId } = req.usuario;
    
    // Captura os parâmetros de paginação e filtros da URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const busca = req.query.busca || '';
    const filtroFuncao = req.query.funcao || '';

    if (!SedeId && !FilhalId) {
      return res.status(400).json({ message: 'Usuário não está associado a nenhuma Sede ou Filhal.' });
    }

    // --- 1. MÉTRICAS GERAIS (De todos os usuários da Sede/Filial, sem paginação/filtros de busca) ---
    const todosUsuariosMétricas = await Usuario.findAll({
      where: {
        ...(SedeId && { SedeId }),
        ...(FilhalId && { FilhalId }),
      },
      attributes: ['id', 'funcao', 'createdAt']
    });

    const totalUsuariosGeral = todosUsuariosMétricas.length;
    const agora = new Date();
    const seteDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

    let usuariosNovosSemana = 0;
    let usuariosNovosMes = 0;
    const usuariosPorFuncao = {};

    todosUsuariosMétricas.forEach(u => {
      const dataCriacao = new Date(u.createdAt);
      if (dataCriacao >= seteDiasAtras) usuariosNovosSemana++;
      if (dataCriacao >= trintaDiasAtras) usuariosNovosMes++;

      const funcao = u.funcao || 'Não Definido';
      usuariosPorFuncao[funcao] = (usuariosPorFuncao[funcao] || 0) + 1;
    });

    // --- 2. FILTROS E PAGINAÇÃO PARA A LISTA DA TABELA ---
    const whereClausula = {
      ...(SedeId && { SedeId }),
      ...(FilhalId && { FilhalId }),
    };

    // Filtro de busca por nome (case-insensitive)
    if (busca) {
      whereClausula.nome = { [Op.like]: `%${busca}%` };
    }

    // Filtro por nível de acesso exato
    if (filtroFuncao) {
      whereClausula.funcao = filtroFuncao;
    }

    const offset = (page - 1) * limit;

    // Busca os usuários com paginação e filtros aplicados (REMOVIDO 'ultimoAcesso' daqui)
    const { count: totalFiltrados, rows: listaUsuarios } = await Usuario.findAndCountAll({
      where: whereClausula,
      attributes: ['id', 'nome', 'funcao', 'SedeId', 'FilhalId', 'MembroId', 'createdAt', 'updatedAt'], 
      order: [['nome', 'ASC']],
      limit: limit,
      offset: offset
    });

    // --- 3. MAPEAMENTO DOS DETALHES (MEMBRO, FOTO, CARGOS) ---
    const usuarios = await Promise.all(
      listaUsuarios.map(async (u) => {
        const usuarioJson = u.toJSON();
        let membro = null;

        if (usuarioJson.MembroId) {
          const membroData = await Membros.findOne({
            where: { id: usuarioJson.MembroId },
            attributes: ['id', 'nome', 'foto', 'genero'],
          });

          if (membroData) {
            const cargosIds = await CargoMembro.findAll({
              where: { MembroId: membroData.id },
              attributes: ['CargoId']
            });

            const cargos = await Cargo.findAll({
              where: { id: cargosIds.map(c => c.CargoId) },
              attributes: ['id', 'nome']
            });

            membro = {
              ...membroData.toJSON(),
              foto: membroData.foto ? `${req.protocol}://${req.get('host')}${membroData.foto}` : null,
              cargos: cargos || []
            };
          }
        }

        return {
          ...usuarioJson,
          Membro: membro
        };
      })
    );

    return res.json({ 
      totalUsuarios: totalUsuariosGeral,
      totalFiltrados,
      paginasTotais: Math.ceil(totalFiltrados / limit),
      paginaAtual: page,
      usuariosNovosSemana,
      usuariosNovosMes,
      usuariosPorFuncao,
      usuarios 
    });

  } catch (error) {
    console.error('!!! [ERRO NA ROTA GESTÃO USUÁRIOS]:', error);
    return res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});





// Rota - Listar tipos de contribuição filtrados pelo usuário logado com dados para os Cards e Gráficos
app.get('/lista/tipos-contribuicao', auth, async (req, res) => {
  try {
    console.log(`Usuário logado: ID=${req.usuario.id}, Nome=${req.usuario.nome}`);

    const { SedeId, FilhalId } = req.usuario;

    // Define o filtro inicial com base na hierarquia
    let filtro = {};
    if (FilhalId) {
      filtro.FilhalId = FilhalId;
    } else if (SedeId) {
      filtro.SedeId = SedeId;
    }

    // Buscar tipos de contribuição filtrados
    const tipos = await TipoContribuicao.findAll({
      where: filtro,
      attributes: ['id', 'nome', 'ativo', 'createdAt'],
    });

    // Criamos um Set global para armazenar IDs únicos de membros que contribuíram no contexto filtrado
    const membrosUnicosGerais = new Set();
    
    let receitaTotalGeral = 0;
    let maiorContribuicaoGeral = 0;
    let totalContribuicoesGeral = 0;
    let tiposAtivos = 0;
    let tiposInativos = 0;

    // Para cada tipo, buscamos os dados financeiros agregados
    const tiposComTotais = await Promise.all(
      tipos.map(async (tipo) => {
        const resultado = await Contribuicao.findOne({
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalContribuicoes'],
            [Sequelize.fn('SUM', Sequelize.col('valor')), 'receitaTotal'],
            [Sequelize.fn('AVG', Sequelize.col('valor')), 'receitaMedia'],
            [Sequelize.fn('MAX', Sequelize.col('valor')), 'maiorContribuicao'],
          ],
          where: {
            TipoContribuicaoId: tipo.id,
            ...(FilhalId && { FilhalId }),
            ...(!FilhalId && SedeId && { SedeId })
          },
          raw: true,
        });

        // Buscar todos os MembroId que participaram deste tipo de contribuição específico para consolidar no Set geral
        const contribuicoesMembros = await Contribuicao.findAll({
          attributes: ['MembroId'],
          where: {
            TipoContribuicaoId: tipo.id,
            MembroId: { [Sequelize.Op.ne]: null }, // Evita contar registros nulos/anônimos se existirem
            ...(FilhalId && { FilhalId }),
            ...(!FilhalId && SedeId && { SedeId })
          },
          raw: true
        });

        // Adiciona os IDs encontrados ao Set global para contagem sem duplicados
        contribuicoesMembros.forEach(c => membrosUnicosGerais.add(c.MembroId));

        const rTotal = parseFloat(resultado.receitaTotal) || 0;
        const mContr = parseFloat(resultado.maiorContribuicao) || 0;
        const tContr = parseInt(resultado.totalContribuicoes, 10) || 0;

        // Acumuladores para os cards globais
        receitaTotalGeral += rTotal;
        totalContribuicoesGeral += tContr;
        if (mContr > maiorContribuicaoGeral) maiorContribuicaoGeral = mContr;
        
        if (tipo.ativo) tiposAtivos++;
        else tiposInativos++;

        return {
          ...tipo.toJSON(),
          totalContribuicoes: tContr,
          receitaTotal: rTotal,
          receitaMedia: parseFloat(resultado.receitaMedia) || 0,
          maiorContribuicao: mContr,
        };
      })
    );

    // Ordenar a lista de tipos por receita total (Decrescente) para facilitar a visualização do gráfico no front
    tiposComTotais.sort((a, b) => b.receitaTotal - a.receitaTotal);

    // Cálculo de contribuição média geral
    const contribuicaoMediaGeral = totalContribuicoesGeral > 0 ? (receitaTotalGeral / totalContribuicoesGeral) : 0;

    // Resposta estruturada com os dados da lista + dados de resumo do Dashboard
    res.status(200).json({
      tipos: tiposComTotais,
      dashboard: {
        receitaTotal: receitaTotalGeral,
        crescimentoMensal: 12, // +12% fixo solicitado
        totalTipos: tipos.length,
        tiposAtivos,
        tiposInativos,
        numeroMembros: membrosUnicosGerais.size, // Quantidade real de membros únicos que contribuíram
        maiorContribuicao: maiorContribuicaoGeral,
        contribuicaoMedia: contribuicaoMediaGeral
      }
    });

  } catch (error) {
    console.error('Erro ao listar tipos de contribuição:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de contribuição' });
  }
});



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