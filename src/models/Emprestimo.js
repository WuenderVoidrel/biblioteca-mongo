const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema(
  {
    livro: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
    usuario: { type: String, required: true, trim: true },
    dataEmprestimo: { type: Date, default: Date.now },
    dataPrevistaDevolucao: { type: Date, required: true },
    dataDevolucao: { type: Date, default: null },
    status: {
      type: String,
      enum: ['ATIVO', 'DEVOLVIDO', 'ATRASADO'],
      default: 'ATIVO',
    },
  },
  { timestamps: true, collection: 'emprestimos' }
);

emprestimoSchema.methods.estaAtrasado = function () {
  if (this.status === 'DEVOLVIDO') return false;
  return new Date() > this.dataPrevistaDevolucao;
};

module.exports = mongoose.model('Emprestimo', emprestimoSchema);
