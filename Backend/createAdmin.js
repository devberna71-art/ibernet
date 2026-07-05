const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const Usuario = require('./modells/Usuarios');

async function createAdmin() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Conexão com a base de dados estabelecida com sucesso.');

    // Check if user already exists
    const existingUser = await Usuario.findOne({ where: { nome: 'pedron' } });
    if (existingUser) {
      console.log('O usuário "pedron" já existe. Atualizando para admin...');
      const hashedPassword = await bcrypt.hash('senha123n', 10);
      existingUser.senha = hashedPassword;
      existingUser.funcao = 'admin';
      await existingUser.save();
      console.log('Usuário "pedron" atualizado com sucesso.');
    } else {
      console.log('Criando o usuário admin "pedron"...');
      const hashedPassword = await bcrypt.hash('senha123n', 10);
      const newUser = await Usuario.create({
        nome: 'pedron',
        senha: hashedPassword,
        funcao: 'admin'
      });
      console.log('Usuário admin "pedron" criado com sucesso com ID:', newUser.id);
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin();
