# Desafio Técnico: Pessoa Desenvolvedora Fullstack Júnior

Solução do desafio técnico com exercícios de HTML e CSS, TypeScript, SQL, uma API em NestJS e uma to-do list em Vue 3.

As explicações de cada item, as respostas de arquitetura e o uso de ferramentas de IA estão em [EXPLICACOES.md](./EXPLICACOES.md).

## Estrutura

├── 01-html-css/ # formulário de cadastro com validação (item 1)
├── 02-typescript/ # função de filtro tipada e genérica (item 3)
├── 03-sql/ # schema e queries em MySQL (item 4)
├── backend/ # API em NestJS (item 5)
├── frontend/ # to-do list em Vue 3 (item 2)
├── EXPLICACOES.md
└── README.md

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior, com npm
- Um navegador
- MySQL 8, ou um playground online como o [DB Fiddle](https://www.db-fiddle.com/), para o exercício de SQL

## Como rodar

Todos os comandos partem da raiz do repositório.

### 1. HTML + CSS

Abra o arquivo `01-html-css/index.html` no navegador. Não precisa de instalação.

### 3. TypeScript

```bash
npx tsx 02-typescript/users.ts
```

O resultado aparece no terminal. Para conferir só a tipagem, sem executar:

```bash
npx -p typescript tsc --noEmit --strict 02-typescript/users.ts
```

### 4. SQL

Execute `03-sql/schema.sql` para criar a tabela `users` e inserir os dados, e depois as queries de `03-sql/queries.sql`. Os scripts foram testados no MySQL 8, pelo DB Fiddle: basta colar o schema no painel da esquerda e as queries no da direita.

### 5. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`, com os dados em memória.

Listar os usuários:

```bash
curl http://localhost:3000/users
```

Criar um usuário:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria", "email": "maria@email.com"}'
```

Como os dados ficam em memória, os usuários criados somem quando o servidor reinicia.

### 2. Frontend (Vue 3)

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço que aparecer no terminal, normalmente `http://localhost:5173`. As tarefas também ficam só em memória e somem ao recarregar a página.

Outros comandos disponíveis no frontend:

```bash
npm run lint         # ESLint e Oxlint
npm run format       # Prettier
npm run type-check   # checagem de tipos com vue-tsc
```

## Tecnologias

- HTML5 e CSS3, com validação nativa de formulário e CSS aninhado
- TypeScript
- MySQL 8
- NestJS
- Vue 3 com Composition API, Vite, TypeScript, ESLint e Prettier