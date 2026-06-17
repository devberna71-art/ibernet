const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const Membros = require("../modells/Membros"); 
const ChatConversa = require("../modells/Chat/conversas");
const ChatParticipante = require("../modells/Chat/Participantes");
const ChatMensagem = require("../modells/Chat/Mensagem");
const auth = require("../middlewere/auth");

const ChatLeitura = require('../modells/Chat/ChatLeitura')









// =========================================================================
// 🏢 1. CRIAR OU RETORNAR CONVERSA PRIVADA EXISTENTE (CORRIGIDO)
// =========================================================================

// =========================================================================
// 🏢 1. CRIAR OU RETORNAR CONVERSA PRIVADA EXISTENTE (COM LOGS DE TESTE)
// =========================================================================
router.post("/conversas", auth, async (req, res) => {
  console.log("\n=======================================================");
  console.log("📥 [CHAT] Rota POST /conversas foi acionada!");
  
  try {
    const meuMembroId = req.usuario.MembroId;
    const { mBembros, membros } = req.body; 
    
    console.log("👤 [LOG] meuMembroId (Logado):", meuMembroId);
    console.log("📦 [LOG] Corpo da requisição (req.body):", req.body);

    // Suporte tanto para array enviado como 'membros' ou qualquer variação
    const listaMembros = membros || mBembros;
    console.log("📋 [LOG] Lista de membros extraída:", listaMembros);

    if (!listaMembros || listaMembros.length === 0) {
      console.warn("⚠️ [AVISO] Falha: Nenhuma lista de membros foi enviada.");
      return res.status(400).json({ message: "Nenhum membro informado." });
    }

    const outroMembroId = listaMembros[0];
    console.log("👉 [LOG] outroMembroId (Destinatário):", outroMembroId);

    if (Number(meuMembroId) === Number(outroMembroId)) {
      console.warn("⚠️ [AVISO] Falha: Tentativa de abrir chat consigo mesmo.");
      return res.status(400).json({ message: "Você não pode iniciar um chat consigo mesmo." });
    }

    console.log("🔍 [SQL] Buscando participantes em conversas privadas comuns...");
    const conversasEmComum = await ChatParticipante.findAll({
      attributes: ['ChatConversaId', 'MembroId'], // Adicionado MembroId para facilitar visualização no log
      where: {
        MembroId: [meuMembroId, outroMembroId]
      },
      include: [{
        model: ChatConversa,
        where: { tipo: 'privada' },
        required: true,
        attributes: []
      }],
      raw: true
    });

    console.log("📊 [LOG] Registros encontrados no banco (conversasEmComum):", conversasEmComum);

    // Filtra no Javascript qual ChatConversaId apareceu DUAS vezes
    const contagemIds = {};
    let conversaIdExistente = null;

    conversasEmComum.forEach(p => {
      contagemIds[p.ChatConversaId] = (contagemIds[p.ChatConversaId] || 0) + 1;
      if (contagemIds[p.ChatConversaId] === 2) {
        conversaIdExistente = p.ChatConversaId;
      }
    });

    console.log("🧮 [LOG] Objeto de contagem de IDs:", contagemIds);
    console.log("📍 [LOG] ID de conversa privada já existente encontrado:", conversaIdExistente);

    // Se achou, busca ela completa e retorna imediatamente
    if (conversaIdExistente) {
      console.log(`✨ [SUCESSO] Chat existente encontrado (ID: ${conversaIdExistente}). Retornando dados...`);
      const conversaExistente = await ChatConversa.findByPk(conversaIdExistente);
      
      console.log("📤 [LOG] Resposta enviada ao front (Existente):", conversaExistente.toJSON());
      return res.status(200).json(conversaExistente);
    }

    // Se não existir, criamos uma nova conversa
    console.log("🆕 [LOG] Nenhuma conversa existente. Criando um novo chat privado no banco...");
    const novaConversa = await ChatConversa.create({
      tipo: "privada",
      ultima_mensagem: "Conversa iniciada",
      ultima_mensagem_em: new Date()
    });

    console.log("🆔 [LOG] Nova conversa criada com ID:", novaConversa.id);

    console.log("➕ [SQL] Inserindo os dois membros na tabela de participantes...");
    await ChatParticipante.bulkCreate([
      { ChatConversaId: novaConversa.id, MembroId: meuMembroId, administrador: 1 },
      { ChatConversaId: novaConversa.id, MembroId: outroMembroId, administrador: 0 }
    ]);

    console.log("🚀 [SUCESSO] Nova conversa e participantes criados perfeitamente!");
    console.log("📤 [LOG] Resposta enviada ao front (Nova):", novaConversa.toJSON());
    
    return res.status(201).json(novaConversa);

  } catch (error) {
    console.error("❌ [ERRO CRÍTICO] Falha na rota /conversas:", error);
    return res.status(500).json({ message: "Erro ao iniciar conversa", error: error.message });
  } finally {
    console.log("=======================================================\n");
  }
});

// =========================================================================
// 📂 2. CARREGAR HISTÓRICO DE UMA CONVERSA (GARANTIDO)
// =========================================================================
router.get("/conversa/:id", auth, async (req, res) => {
  try {
    const conversaId = req.params.id;

    const conversa = await ChatConversa.findByPk(conversaId, {
      include: [
        {
          model: ChatMensagem,
          as: "mensagens", 
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
        // Ordenação segura direto na raiz do include
        [{ model: ChatMensagem, as: 'mensagens' }, 'createdAt', 'ASC']
      ]
    });

    if (!conversa) {
      return res.status(404).json({ message: "Conversa não encontrada." });
    }

    return res.status(200).json(conversa);
  } catch (error) {
    console.error("Erro ao carregar conversa:", error);
    return res.status(500).json({ message: "Erro ao buscar conversa", error: error.message });
  }
});

// =========================================================================
// ✉️ 3. ENVIAR MENSAGEM
// =========================================================================



// =========================================================================
// 1. ROTA DE STREAM (SSE) - VERSÃO BLINDADA ANTI-BUFFER
// =========================================================================
router.get("/conversa/:id/stream", auth, (req, res) => {
  const conversaId = String(req.params.id);

  // Garante que o mapa global de conexões exista
  if (!req.app.locals.clientesConectados) {
    req.app.locals.clientesConectados = {};
  }

  // 🔥 CABEÇALHOS CRUCIAIS PARA EVITAR QUE O NAVEGADOR OU SERVIDOR SEGUREM OS DADOS
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Essencial para travar buffers de proxy/Nginx
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Envia duas quebras de linha iniciais para abrir o canal imediatamente
  res.write(': ping\n\n'); 
  if (typeof res.flush === 'function') res.flush(); // Se usar compression, isso força o envio

  // Adiciona este cliente na sala
  if (!req.app.locals.clientesConectados[conversaId]) {
    req.app.locals.clientesConectados[conversaId] = [];
  }
  
  // Guardamos o objeto 'res' inteiro para podermos escrever nele depois
  req.app.locals.clientesConectados[conversaId].push(res);
  console.log(`\n🔌 [SSE] Usuário conectado na sala: ${conversaId}. Total nesta sala: ${req.app.locals.clientesConectados[conversaId].length}`);

  // Configura um intervalo de Keep-Alive (ping) a cada 15 segundos para a conexão não cair sozinha
  const keepAliveInterval = setInterval(() => {
    res.write(': ping\n\n');
    if (typeof res.flush === 'function') res.flush();
  }, 15000);

  // Se o cliente fechar o chat ou atualizar a página, limpa tudo
  req.on('close', () => {
    clearInterval(keepAliveInterval);
    if (req.app.locals.clientesConectados[conversaId]) {
      req.app.locals.clientesConectados[conversaId] = req.app.locals.clientesConectados[conversaId].filter(client => client !== res);
      console.log(`❌ [SSE] Usuário desconectou da sala: ${conversaId}. Restantes: ${req.app.locals.clientesConectados[conversaId].length}`);
      if (req.app.locals.clientesConectados[conversaId].length === 0) {
        delete req.app.locals.clientesConectados[conversaId];
      }
    }
  });
});

// =========================================================================
// 2. ROTA DE ENVIAR MENSAGEM - DISPARANDO VIA APP LOCALS
// =========================================================================



// =========================================================================
// 2. ROTA DE ENVIAR MENSAGEM - DISPARANDO COM FLUSH FORÇADO
// =========================================================================

router.post("/mensagens", auth, async (req, res) => {
  try {
    const meuMembroId = req.usuario.MembroId;
    const { ChatConversaId, texto } = req.body;

    // 1. Cria a nova mensagem no banco de dados
    const novaMensagem = await ChatMensagem.create({
      ChatConversaId,
      MembroId: meuMembroId,
      texto,
      tipo: "texto"
    });

    // 2. Busca a mensagem recém-criada incluindo os dados do autor (Membro)
    const mensagemComAutor = await ChatMensagem.findByPk(novaMensagem.id, {
      include: [{ model: Membros, as: "Membro", attributes: ["id", "nome", "foto"] }]
    });

    // 3. Update dos dados de pré-visualização da conversa principal (Última Mensagem)
    await ChatConversa.update(
      { ultima_mensagem: texto, ultima_mensagem_em: new Date() },
      { where: { id: ChatConversaId } }
    );

    // 🔥 AQUI ESTÁ A MÁGICA DO SOCKET.IO ATUALIZADA:
    const room = String(ChatConversaId);
    
    if (req.io) {
      console.log(`🚀 [SOCKET.IO] Emitindo mensagem instantânea para a sala: ${room}`);
      
      // 1. Envia para quem está dentro da sala de chat específica (Atualiza a janela do chat ativo)
      req.io.to(room).emit("receive_message", mensagemComAutor);

      // 2. 🌟 EMISSÃO GLOBAL PARA O CONTADOR DA NAVBAR 🌟
      // Envia para TODOS os usuários conectados no sistema saberem que há uma nova mensagem no ar
      req.io.emit("global_new_message", {
        ChatConversaId,
        MembroId: meuMembroId, // Útil para o front filtrar e não contar as próprias mensagens
        texto
      });

    } else {
      console.warn("⚠️ [SOCKET.IO] Instância do Socket não encontrada em req.io. Verifique o middleware no index.js.");
    }

    // 4. Retorna a resposta HTTP normal de sucesso para quem enviou
    return res.status(201).json(mensagemComAutor);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
    return res.status(500).json({ message: "Erro ao enviar mensagem", error: error.message });
  }
});





// Rota acionada quando o usuário entra na sala de chat
router.post("/conversas/ler", auth, async (req, res) => {
  try {
    const meuMembroId = req.usuario.MembroId;
    const { ChatConversaId } = req.body;

    if (!ChatConversaId) {
      return res.status(400).json({ message: "ChatConversaId é obrigatório" });
    }

    // Atualiza se já existir, cria se não existir (graças ao seu índice único!)
    await ChatLeitura.upsert({
      MembroId: meuMembroId,
      ChatConversaId: ChatConversaId,
      ultima_leitura_em: new Date()
    });

    return res.status(200).json({ success: true, message: "Conversa marcada como lida." });
  } catch (error) {
    console.error("❌ Erro ao atualizar status de leitura:", error);
    return res.status(500).json({ message: "Erro ao atualizar leitura", error: error.message });
  }
});





router.post("/conversa/:id/marcar-lidas", auth, async (req, res) => {
  try {
    const conversaId = req.params.id;
    const meuMembroId = req.usuario.MembroId;

    // A mágica: O "upsert" verifica se já existe uma leitura para esse membro 
    // nesta conversa. Se existir, ele ATUALIZA o horário. 
    // Se não existir, ele CRIA o registro.
    await ChatLeitura.upsert({
      MembroId: meuMembroId,
      ChatConversaId: conversaId,
      ultima_leitura_em: new Date()
    });

    return res.status(200).json({ message: "Conversa marcada como lida." });
  } catch (error) {
    console.error("Erro ao marcar como lida:", error);
    return res.status(500).json({ message: "Erro ao atualizar leitura", error: error.message });
  }
});



module.exports = router;