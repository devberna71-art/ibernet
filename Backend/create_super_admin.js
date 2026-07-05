const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const Usuario = require('./modells/Usuarios');

async function createSuperAdmin() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Conexão com a base de dados estabelecida com sucesso.');

    // Check if user already exists
    const existingUser = await Usuario.findOne({ where: { nome: 'pedro' } });
    if (existingUser) {
      console.log('O usuário "pedro" já existe. Atualizando para super_admin...');
      const hashedPassword = await bcrypt.hash('senha123', 10);
      existingUser.senha = hashedPassword;
      existingUser.funcao = 'super_admin';
      await existingUser.save();
      console.log('Usuário "pedro" atualizado com sucesso.');
    } else {
      console.log('Criando o super usuário "pedro"...');
      const hashedPassword = await bcrypt.hash('senha123', 10);
      const newUser = await Usuario.create({
        nome: 'pedro',
        senha: hashedPassword,
        funcao: 'super_admin'
      });
      console.log('Super usuário "pedro" criado com sucesso com ID:', newUser.id);
    }
  } catch (error) {
    console.error('Erro ao criar super usuário:', error);
  } finally {
    await sequelize.close();
  }
}

createSuperAdmin();
