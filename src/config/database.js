const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteca';

async function conectar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[DB] Conectado em ${MONGO_URI}`);
  } catch (erro) {
    console.error('[DB] Falha ao conectar:', erro.message);
    throw erro;
  }
}

async function desconectar() {
  await mongoose.disconnect();
  console.log('[DB] Conexao encerrada');
}

module.exports = { conectar, desconectar };
