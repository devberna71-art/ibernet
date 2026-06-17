const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Membro = require("../Membros");

const ChatConversa = sequelize.define(
  "ChatConversa",
  {
    tipo: {
      type: DataTypes.ENUM("privada", "grupo"),
      allowNull: false,
      defaultValue: "privada",
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    ultima_mensagem: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ultima_mensagem_em: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "chat_conversas",
    timestamps: true,
  }
);



module.exports = ChatConversa;