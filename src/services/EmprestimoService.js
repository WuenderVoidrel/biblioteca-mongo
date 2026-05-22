const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const {
  NaoEncontradoError,
  RegraNegocioError,
  ValidacaoError,
} = require('../utils/errors');

const DIAS_PADRAO_EMPRESTIMO = 7;

class EmprestimoService {
  async emprestar({ livroId, usuario, dias = DIAS_PADRAO_EMPRESTIMO }) {
    if (!livroId || !usuario) {
      throw new ValidacaoError('livroId e usuario sao obrigatorios');
    }

    const livro = await Livro.findById(livroId);
    if (!livro) throw new NaoEncontradoError(`Livro ${livroId} nao encontrado`);

    if (!livro.disponivel()) {
      throw new RegraNegocioError(`Nao ha exemplares disponiveis de "${livro.titulo}"`);
    }

    const dataPrevistaDevolucao = new Date();
    dataPrevistaDevolucao.setDate(dataPrevistaDevolucao.getDate() + dias);

    livro.exemplaresDisponiveis -= 1;
    await livro.save();

    const emprestimo = await Emprestimo.create({
      livro: livro._id,
      usuario,
      dataPrevistaDevolucao,
    });

    return emprestimo.populate('livro');
  }

  async devolver(emprestimoId) {
    const emprestimo = await Emprestimo.findById(emprestimoId);
    if (!emprestimo) throw new NaoEncontradoError(`Emprestimo ${emprestimoId} nao encontrado`);

    if (emprestimo.status === 'DEVOLVIDO') {
      throw new RegraNegocioError('Este emprestimo ja foi devolvido');
    }

    const livro = await Livro.findById(emprestimo.livro);
    if (livro) {
      livro.exemplaresDisponiveis += 1;
      await livro.save();
    }

    emprestimo.dataDevolucao = new Date();
    emprestimo.status = 'DEVOLVIDO';
    await emprestimo.save();

    return emprestimo.populate('livro');
  }

  async listar(filtro = {}) {
    return Emprestimo.find(filtro).populate('livro').sort({ createdAt: -1 });
  }

  async listarAtrasados() {
    const agora = new Date();
    return Emprestimo.find({
      status: 'ATIVO',
      dataPrevistaDevolucao: { $lt: agora },
    }).populate('livro');
  }

  async marcarAtrasados() {
    const agora = new Date();
    const resultado = await Emprestimo.updateMany(
      { status: 'ATIVO', dataPrevistaDevolucao: { $lt: agora } },
      { $set: { status: 'ATRASADO' } }
    );
    return resultado.modifiedCount;
  }
}

module.exports = new EmprestimoService();
