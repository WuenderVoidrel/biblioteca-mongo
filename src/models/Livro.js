const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    autor: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    ano: { type: Number, min: 0 },
    genero: { type: String, trim: true },
    exemplaresTotais: { type: Number, default: 1, min: 0 },
    exemplaresDisponiveis: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true, collection: 'livros' }
);

livroSchema.methods.disponivel = function () {
  return this.exemplaresDisponiveis > 0;
};

class LivroClass {
  resumo() {
    return `${this.titulo} - ${this.autor} (${this.ano || 's/d'})`;
  }
}

livroSchema.loadClass(LivroClass);

module.exports = mongoose.model('Livro', livroSchema);
