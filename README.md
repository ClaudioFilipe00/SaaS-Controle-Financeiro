# Controle Financeiro

## Visão Geral

Controle Financeiro é uma aplicação web desenvolvida para gerenciamento de finanças pessoais. O sistema permite registrar, organizar e visualizar receitas e despesas, fornecendo ao usuário uma visão clara da sua situação financeira.

A aplicação foi construída utilizando uma arquitetura moderna baseada na separação entre frontend, backend e banco de dados, com comunicação realizada através de uma API REST. Essa abordagem permite melhor organização do código, maior escalabilidade e facilidade de manutenção.

O projeto demonstra a implementação de uma aplicação SaaS completa, incluindo interface de usuário, lógica de negócio, persistência de dados e infraestrutura em cloud.

---

# Tecnologias Utilizadas

## Frontend

* React
* TypeScript
* Vite
* Material UI
* Axios

O frontend foi desenvolvido como uma **Single Page Application (SPA)** utilizando React e TypeScript. A interface é construída com componentes reutilizáveis utilizando Material UI, permitindo maior consistência visual e facilidade de manutenção.

O gerenciamento de estado da interface é realizado com React Hooks, enquanto a comunicação com a API é feita através da biblioteca Axios.

O Vite foi utilizado como ferramenta de build e servidor de desenvolvimento, proporcionando inicialização rápida e melhor performance durante o desenvolvimento.

---

## Backend

* Node.js
* Express.js
* Sequelize (ORM)
* bcrypt
* cors
* dotenv

O backend é responsável por fornecer uma **API REST** que gerencia toda a lógica da aplicação, incluindo autenticação de usuários, gerenciamento de transações financeiras e comunicação com o banco de dados.

A aplicação foi estruturada seguindo uma arquitetura modular, separando responsabilidades entre rotas, controladores e modelos.

O Sequelize é utilizado como ORM para mapear tabelas do banco de dados em objetos JavaScript, facilitando a manipulação de dados dentro da aplicação.

---

## Banco de Dados

* PostgreSQL

O banco de dados relacional armazena todas as informações da aplicação, incluindo usuários, transações financeiras e categorias.

O uso de PostgreSQL permite consultas eficientes, integridade de dados e suporte a operações complexas.

---

# Infraestrutura e Deploy

A aplicação está totalmente hospedada em serviços de cloud, com cada camada do sistema distribuída em uma plataforma específica.

## Frontend

Hospedado na plataforma **Vercel**, responsável pela entrega da aplicação React com alta performance e CDN global.

## Backend

A API foi implantada na plataforma **Render**, responsável por executar o servidor Node.js e processar as requisições da aplicação. Devido ao plano gratuito estar sendo utilizado, existe uma destaivação do servidor após 15 minutos de inatividade, por esse motivo, existe a probabilidade de demorar até um minuto para que o acesso via login ou cadastro seja efetuado.

## Banco de Dados

O banco de dados PostgreSQL está hospedado no **Supabase**, que fornece infraestrutura gerenciada para armazenamento e acesso aos dados.

Essa separação entre serviços permite maior escalabilidade, confiabilidade e facilidade de manutenção da aplicação.

---

# Arquitetura do Sistema

O projeto segue uma arquitetura cliente-servidor com separação clara entre interface, lógica de negócio e persistência de dados.

Fluxo da aplicação:

Frontend (React)
↓
API REST (Node.js + Express)
↓
ORM (Sequelize)
↓
Banco de Dados (PostgreSQL)

Essa arquitetura permite que o frontend e o backend evoluam de forma independente, além de facilitar futuras integrações com outros clientes, como aplicações mobile.

---

# Estrutura do Backend

O backend foi organizado utilizando uma arquitetura modular, separando responsabilidades em diferentes camadas.

Exemplo de estrutura:

src
controllers
models
routes
config
middleware

Controllers
Responsáveis por processar as requisições recebidas pela API e aplicar a lógica da aplicação.

Models
Definem as estruturas das tabelas do banco de dados e seus relacionamentos utilizando Sequelize.

Routes
Definem os endpoints da API e direcionam as requisições para os controllers correspondentes.

Config
Contém configurações da aplicação, como conexão com banco de dados.

Essa separação melhora a organização do projeto e facilita sua manutenção.

---

# Sistema de Autenticação

O sistema possui um mecanismo de autenticação responsável por garantir que cada usuário tenha acesso apenas aos seus próprios dados financeiros.

Durante o cadastro, o usuário informa nome, email e senha. Antes de serem armazenadas no banco de dados, as senhas passam por um processo de criptografia utilizando a biblioteca bcrypt.

Esse processo gera um hash da senha, que é armazenado no banco de dados em vez da senha original, aumentando significativamente a segurança da aplicação.

Fluxo de cadastro:

Usuário envia dados de registro
↓
API valida informações
↓
Senha é criptografada com bcrypt
↓
Dados são armazenados no banco de dados

Fluxo de login:

Usuário envia email e senha
↓
API busca o usuário no banco
↓
Senha informada é comparada com o hash armazenado
↓
Se válida, acesso é autorizado

Esse processo garante que credenciais sensíveis nunca sejam armazenadas em texto simples.

---

# Comunicação entre Frontend e API

A comunicação entre o frontend e o backend ocorre através de requisições HTTP para uma API REST.

Sempre que o usuário executa uma ação na interface, o frontend envia uma requisição para a API. O backend processa essa requisição, executa a lógica necessária e retorna uma resposta em formato JSON.

Fluxo de comunicação:

Usuário interage com a interface
↓
Frontend envia requisição HTTP para a API
↓
Backend processa a lógica da requisição
↓
Se necessário, consulta ou altera dados no banco
↓
Backend retorna resposta em JSON
↓
Frontend atualiza a interface

Essa arquitetura permite que o frontend e o backend sejam desenvolvidos e mantidos de forma independente.

---

# Funcionalidades

O sistema oferece as seguintes funcionalidades principais:

* Cadastro de usuários
* Autenticação de usuários
* Registro de receitas e despesas
* Organização de transações por categoria
* Visualização de dados financeiros por período
* Dashboard financeiro para acompanhamento das movimentações

Essas funcionalidades permitem que o usuário tenha maior controle sobre sua organização financeira.

---

# Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de demonstrar conhecimentos em desenvolvimento web full stack, incluindo:

* desenvolvimento de interfaces modernas com React
* construção de APIs REST com Node.js e Express
* modelagem de banco de dados relacional
* uso de ORM para manipulação de dados
* autenticação de usuários
* deploy de aplicações em infraestrutura cloud

---

# [Acessar Sistema](https://saa-s-controle-financeiro-lac.vercel.app)

