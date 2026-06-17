const jwt = require("jsonwebtoken");
const JWT_SECRET = "berna12890i";
const Usuario = require("../modells/Usuarios"); // 👈 Certifique-se de que o caminho do seu model de Usuários está correto aqui (models ou modells)

module.exports = async (req, res, next) => {
  console.log("\n🔑 [AUTH] Middleware auth chamado");

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("❌ Token não fornecido");
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("❌ Token mal formatado");
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token JWT decodificado com sucesso:", { id: payload.id, nome: payload.nome });

    // 🔍 ESTRATÉGIA INFALÍVEL: Busca o MembroId atualizado direto do banco de dados
    console.log(`🗄️ [SQL] Buscando MembroId para o Usuário ID: ${payload.id}...`);
    const usuarioBanco = await Usuario.findByPk(payload.id, {
      attributes: ['MembroId'] // Puxa apenas a coluna que nos interessa para manter ultra rápido
    });

    let membroIdEncontrado = null;
    if (usuarioBanco) {
      membroIdEncontrado = usuarioBanco.MembroId;
      console.log(`👤 [SUCESSO AUTH] MembroId localizado no banco:`, membroIdEncontrado);
    } else {
      console.warn(`⚠️ [AVISO] Usuário ID ${payload.id} não foi achado na tabela Usuarios.`);
    }

    // Guardamos no req.usuario os dados originais + o MembroId injetado do banco
    req.usuario = {
      id: payload.id,
      nome: payload.nome,
      SedeId: payload.SedeId || null,
      FilhalId: payload.FilhalId || null,
      funcao: payload.funcao || null,
      MembroId: membroIdEncontrado // 🔥 AGORA DISPONÍVEL EM QUALQUER ROTA PROTEGIDA!
    };

    console.log("🚀 [AUTH] req.usuario populado com sucesso. Indo para a rota...");
    next();

  } catch (err) {
    console.log("❌ Erro ao verificar token:", err.message);
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};