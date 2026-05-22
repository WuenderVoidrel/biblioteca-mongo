class AppError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = this.constructor.name;
  }
}

class NaoEncontradoError extends AppError {}
class RegraNegocioError extends AppError {}
class ValidacaoError extends AppError {}

module.exports = {
  AppError,
  NaoEncontradoError,
  RegraNegocioError,
  ValidacaoError,
};
