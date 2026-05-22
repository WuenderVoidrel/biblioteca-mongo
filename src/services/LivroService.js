const Livro = require('../models/Livro');
const { NaoEncontradoError, ValidacaoError } = require('../utils/errors');

class LivroService {
  async cadastrar(dados) {
    if (!dados.titulo || !dados.autor || !dados.isbn) {
      throw new ValidacaoError('titulo, autor e isbn sao obrigatorios');
    }
    try {
      const livro = await Livro.create({
        ...dados,
        exemplaresDisponiveis: dados.exemplaresDisponiveis ?? dados.exemplaresTotais ?? 1,
      });
      return livro;
    } catch (erro) {
      if (erro.code === 11000) {
        throw new ValidacaoError(`Ja existe livro com ISBN ${dados.isbn}`);
      }
      throw erro;
    }
  }

  async listar(filtro = {}) {
    return Livro.find(filtro).sort({ titulo: 1 });
  }

  async buscarPorId(id) {
    const livro = await Livro.findById(id);
    if (!livro) throw new NaoEncontradoError(`Livro ${id} nao encontrado`);
    return livro;
  }

  async buscarPorIsbn(isbn) {
    const livro = await Livro.findOne({ isbn });
    if (!livro) throw new NaoEncontradoError(`Livro com ISBN ${isbn} nao encontrado`);
    return livro;
  }

  async atualizar(id, dados) {
    const livro = await Livro.findByIdAndUpdate(id, dados, { new: true, runValidators: true });
    if (!livro) throw new NaoEncontradoError(`Livro ${id} nao encontrado`);
    return livro;
  }

  async remover(id) {
    const livro = await Livro.findByIdAndDelete(id);
    if (!livro) throw new NaoEncontradoError(`Livro ${id} nao encontrado`);
    return livro;
  }
}

module.exports = new LivroService();
