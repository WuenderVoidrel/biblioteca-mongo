# Sistema de Gerenciamento de Biblioteca - MongoDB

Atividade da disciplina **BANCOS DE DADOS NOSQL** ([85091]-NA-ADS-IN45D).

Implementa um sistema simples de biblioteca usando **Node.js + Mongoose** com duas colecoes (`livros` e `emprestimos`), classes organizadas por responsabilidade e tratamento de erros.

## Estrutura de pastas

```
biblioteca-mongodb/
├── index.js                  -> ponto de entrada (demo dos casos de uso)
├── package.json
├── src/
│   ├── config/
│   │   └── database.js       -> conexao/desconexao com o MongoDB
│   ├── models/
│   │   ├── Livro.js          -> schema/classe Livro
│   │   └── Emprestimo.js     -> schema/classe Emprestimo
│   ├── services/
│   │   ├── LivroService.js   -> CRUD de livros
│   │   └── EmprestimoService.js -> regras de emprestimo/devolucao
│   └── utils/
│       └── errors.js         -> classes de erro customizadas
```

## Pre-requisitos

- Node.js 18+
- MongoDB rodando em `mongodb://localhost:27017` (Compass / mongod local ja serve)

## Como executar

```powershell
cd C:\Users\wuender.martins\biblioteca-mongodb
npm install
npm start
```

O script `index.js` roda uma demonstracao completa:
1. Limpa as colecoes
2. Cadastra 3 livros
3. Tenta cadastrar ISBN duplicado (erro tratado)
4. Lista livros
5. Cria emprestimos
6. Tenta emprestar livro indisponivel (erro tratado)
7. Devolve emprestimo
8. Tenta devolver duas vezes (erro tratado)
9. Lista emprestimos
10. Busca livro por ID inexistente (erro tratado)

## Conferindo no MongoDB Compass

Conecte em `mongodb://localhost:27017`, abra o banco **biblioteca** e veja as colecoes **livros** e **emprestimos** populadas.

## Conceitos NoSQL/MongoDB aplicados

- **Schema flexivel** com Mongoose (validacoes opcionais sem perder a liberdade do NoSQL).
- **Documentos** com campos aninhados e referencias (`ObjectId`) entre colecoes.
- **Indices unicos** via `unique: true` no ISBN.
- **Operacoes CRUD**: `create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, `updateMany`.
- **Populate** para "join" logico entre `emprestimos` e `livros`.
- **Separacao em camadas**: config -> model -> service -> entrypoint.
- **Tratamento de erros** com classes customizadas (`NaoEncontradoError`, `RegraNegocioError`, `ValidacaoError`).
