# chronos-validation-api

Api de serviços chronos

# requisitos

instlaar o mongoDB: https://docs.mongodb.com/manual/administration/install-community/
instalar o nodeJS: https://nodejs.org
instalar o yarn: https://yarnpkg.com/getting-started/install

# Como executar

Criar um arquivo .env na raiz com o seguinte conteudo, prrenchendo os dados vazios pelos já constantes nas variaveis de ambiente do heroku:

DATA_MODE=!adsfadsfkljfe324
CLIENTS=http://localhost:3001
DB_URI=mongodb://localhost:27017/chronos
PORT=3006
MAIL_USER=
MAIL_PASS=

## variavel de ambiente

Comando:

export NPM_TOKEN pegar_NPM_TOKEN_no_heroku

## iniciar o projeto

Execute o comando:

yarn start:dev

# Comandos diversos

Atualizar as libs do projeto

yarn up:nm

# STARTER PROJECT
https://khalilstemmler.com/blogs/typescript/node-starter-project/


# CODE FORMAT - ESLINT e PRETTIER
https://eslint.org/docs/user-guide/getting-started
https://prettier.io/docs/en/install.html
https://khalilstemmler.com/blogs/typescript/node-starter-project/
https://www.aleksandrhovhannisyan.com/blog/format-code-on-save-vs-code-eslint/
