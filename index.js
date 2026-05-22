const { conectar, desconectar } = require('./src/config/database');
const livroService = require('./src/services/LivroService');
const emprestimoService = require('./src/services/EmprestimoService');
const { AppError } = require('./src/utils/errors');

function linha(titulo) {
  console.log('\n' + '='.repeat(60));
  console.log(titulo);
  console.log('='.repeat(60));
}

async function main() {
  await conectar();

  try {
    linha('1) Limpando dados de execucoes anteriores');
    const Livro = require('./src/models/Livro');
    const Emprestimo = require('./src/models/Emprestimo');
    await Emprestimo.deleteMany({});
    await Livro.deleteMany({});
    await Livro.init();
    await Emprestimo.init();
    console.log('Colecoes limpas e indices criados.');

    linha('2) Cadastrando livros');
    const livro1 = await livroService.cadastrar({
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      isbn: '978-85-359-0277-5',
      ano: 1899,
      genero: 'Romance',
      exemplaresTotais: 2,
    });
    const livro2 = await livroService.cadastrar({
      titulo: 'O Senhor dos Aneis',
      autor: 'J.R.R. Tolkien',
      isbn: '978-85-333-0227-3',
      ano: 1954,
      genero: 'Fantasia',
      exemplaresTotais: 1,
    });
    const livro3 = await livroService.cadastrar({
      titulo: 'NoSQL Distilled',
      autor: 'Pramod Sadalage / Martin Fowler',
      isbn: '978-03-218-2662-6',
      ano: 2012,
      genero: 'Tecnologia',
      exemplaresTotais: 3,
    });
    console.log(`Cadastrados: ${livro1.resumo()}`);
    console.log(`Cadastrados: ${livro2.resumo()}`);
    console.log(`Cadastrados: ${livro3.resumo()}`);

    linha('3) Tentando cadastrar ISBN duplicado (erro esperado)');
    try {
      await livroService.cadastrar({
        titulo: 'Outro Dom Casmurro',
        autor: 'Outro Autor',
        isbn: '978-85-359-0277-5',
      });
    } catch (erro) {
      console.log(`Erro tratado: ${erro.name} -> ${erro.message}`);
    }

    linha('4) Listando todos os livros');
    const livros = await livroService.listar();
    livros.forEach((l) =>
      console.log(`- ${l.resumo()} | disponiveis: ${l.exemplaresDisponiveis}/${l.exemplaresTotais}`)
    );

    linha('5) Realizando emprestimos');
    const emp1 = await emprestimoService.emprestar({
      livroId: livro2._id,
      usuario: 'Ana Souza',
      dias: 5,
    });
    console.log(`Emprestimo OK: "${emp1.livro.titulo}" para ${emp1.usuario}`);

    const emp2 = await emprestimoService.emprestar({
      livroId: livro3._id,
      usuario: 'Bruno Lima',
      dias: 10,
    });
    console.log(`Emprestimo OK: "${emp2.livro.titulo}" para ${emp2.usuario}`);

    linha('6) Tentando emprestar livro indisponivel (erro esperado)');
    try {
      await emprestimoService.emprestar({ livroId: livro2._id, usuario: 'Carla Mendes' });
    } catch (erro) {
      console.log(`Erro tratado: ${erro.name} -> ${erro.message}`);
    }

    linha('7) Devolvendo emprestimo');
    const devolvido = await emprestimoService.devolver(emp1._id);
    console.log(
      `Devolvido: "${devolvido.livro.titulo}" em ${devolvido.dataDevolucao.toLocaleString('pt-BR')}`
    );

    linha('8) Tentando devolver duas vezes (erro esperado)');
    try {
      await emprestimoService.devolver(emp1._id);
    } catch (erro) {
      console.log(`Erro tratado: ${erro.name} -> ${erro.message}`);
    }

    linha('9) Listando emprestimos atuais');
    const emprestimos = await emprestimoService.listar();
    emprestimos.forEach((e) =>
      console.log(
        `- [${e.status}] ${e.livro.titulo} | ${e.usuario} | prev: ${e.dataPrevistaDevolucao.toLocaleDateString('pt-BR')}`
      )
    );

    linha('10) Buscando livro por ID inexistente (erro esperado)');
    try {
      await livroService.buscarPorId('000000000000000000000000');
    } catch (erro) {
      console.log(`Erro tratado: ${erro.name} -> ${erro.message}`);
    }

    linha('Demo finalizada com sucesso');
  } catch (erro) {
    if (erro instanceof AppError) {
      console.error(`[Erro de aplicacao] ${erro.name}: ${erro.message}`);
    } else {
      console.error('[Erro inesperado]', erro);
    }
    process.exitCode = 1;
  } finally {
    await desconectar();
  }
}

main();
