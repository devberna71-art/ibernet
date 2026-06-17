const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Membro = require("../Membros"); // Ajuste o caminho conforme seu projeto
const ChatConversa = require("./conversas"); // Importe o modelo de Conversa

const ChatLeitura = sequelize.define(
  "ChatLeitura",
  {
    // Chave composta lógica (MembroId + ChatConversaId) será definida abaixo
    ultima_leitura_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chat_leituras",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["MembroId", "ChatConversaId"], // Garante que só existe 1 registro por pessoa/conversa
      },
    ],
  }
);

// Associações
Membro.hasMany(ChatLeitura, { foreignKey: "MembroId" });
ChatLeitura.belongsTo(Membro, { foreignKey: "MembroId" });

ChatConversa.hasMany(ChatLeitura, { foreignKey: "ChatConversaId" });
ChatLeitura.belongsTo(ChatConversa, { foreignKey: "ChatConversaId" });

module.exports = ChatLeitura;