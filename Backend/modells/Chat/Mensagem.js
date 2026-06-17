const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ChatConversa = require("./conversas");
const Membro = require("../Membros");

const ChatMensagem = sequelize.define(
  "ChatMensagem",
  {
    texto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tipo: {
      type: DataTypes.ENUM(
        "texto",
        "imagem",
        "video",
        "audio",
        "arquivo"
      ),
      defaultValue: "texto",
    },

    arquivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    editada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    apagada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "chat_mensagens",
    timestamps: true,
  }
);

/* =========================
   ASSOCIAÇÕES
========================= */
ChatConversa.hasMany(ChatMensagem);

ChatMensagem.belongsTo(ChatConversa);


Membro.hasMany(ChatMensagem);

ChatMensagem.belongsTo(Membro);

module.exports = ChatMensagem;