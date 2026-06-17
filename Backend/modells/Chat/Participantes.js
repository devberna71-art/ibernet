const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ChatConversa = require("./conversas");
const Membro = require("../Membros");

const ChatParticipante = sequelize.define(
  "ChatParticipante",
  {
    administrador: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    silenciado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    ultimo_acesso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "chat_participantes",
    timestamps: true,
  }
);

/* =========================
   ASSOCIAÇÕES
========================= */

Membro.hasMany(ChatParticipante)
ChatParticipante.belongsTo(Membro)



ChatConversa.hasMany(ChatParticipante)
ChatParticipante.belongsTo(ChatConversa)


module.exports = ChatParticipante;