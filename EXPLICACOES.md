# Explicações

## 1. HTML + CSS

O formulário está em `01-html-css/`, separado em dois arquivos: `index.html` com a estrutura e `style.css` com todo o estilo. Não usei estilo inline, para manter cada arquivo com uma responsabilidade só. O visual partiu de uma referência de design que gerei com o Claude (detalhes na seção de Uso de IA), e a implementação do HTML e do CSS foi feita por mim.

### HTML

- O `body` representa a página inteira, e o `<main>` é o cartão do formulário. Como a página tem só esse conteúdo, usei o próprio `<main>` como cartão. Num site maior, com menu e rodapé, o `<main>` seria uma área mais ampla e o cartão seria um elemento dentro dele.
- Dentro do `<main>` ficam um cabeçalho (`.form-header`, com o título e o subtítulo) e o `<form>`.
- Cada campo fica em um `.form-group`, com o `<label>` e o `<input>` juntos. Isso deixa o HTML mais organizado e facilita o CSS, porque consigo controlar separadamente o espaço entre label e campo e o espaço entre um campo e outro.
- Todo `<label>` está ligado ao seu `<input>` pelo `for`/`id`. Isso melhora a acessibilidade (o leitor de tela anuncia o nome do campo) e a usabilidade (clicar no texto do label coloca o foco no campo).
- O `lang="pt-BR"` e a meta `viewport` garantem o idioma correto e o funcionamento no celular.

### Validação

A validação usa só recursos nativos do HTML, sem JavaScript:

- `required` nos três campos, para que nenhum fique vazio.
- `type="email"`, que faz o navegador conferir o formato do e-mail.
- `minlength="8"` na senha, com um texto de dica abaixo do campo informando a regra.

Com isso, o navegador bloqueia o envio e mostra a mensagem dele quando algo está errado. Como não há backend nesse exercício, o `action` está vazio e a página só recarrega quando o formulário é válido.

### CSS

- **Variáveis no `:root`:** todas as cores ficam em variáveis nomeadas pela função (`--primary-color`, `--error-color`, `--text-secondary-color`), e não pelo tom. Se a cor de destaque mudar, altero em um lugar só.
- **Reset:** apliquei `box-sizing: border-box` em todos os elementos com o seletor `*`, para que o `padding` não some à largura. Sem isso, o cartão com `width: 100%` e `padding: 32px` passava da largura da tela no celular. Também zerei `margin` e `padding` padrão do navegador.
- **Layout:** o `body` usa flexbox com `min-height: 100vh` para centralizar o cartão na tela. Usei `min-height` em vez de `height` para que, em telas baixas, a página cresça em vez de cortar o conteúdo. O cartão tem `width: 100%` com `max-width: 400px`, então ocupa 400px no computador e se ajusta no celular. Os campos ficam empilhados com flexbox e `gap`.
- **Estados:** o botão tem `:hover` e `:focus-visible`, e os campos têm um anel de foco com `box-shadow`. O foco visível é importante para quem navega pelo teclado.
- **Estado de erro:** os campos inválidos ficam com borda vermelha e fundo rosado. Primeiro usei `:invalid`, mas como os campos `required` vazios já são inválidos ao carregar, a página abria com tudo vermelho. Troquei por `:user-invalid`, que só aplica o estilo depois que a pessoa interage com o campo.
- **CSS aninhado:** usei o aninhamento nativo do CSS (regras dentro de `.form` e `&:hover`, por exemplo), sem precisar de Sass. Ele é suportado pelos navegadores atuais e deixa claro o que pertence a cada bloco.
- **Fonte:** a Inter é carregada pelo Google Fonts, com `preconnect` antes do CSS para adiantar a conexão. Também coloquei `font-family: inherit` nos inputs e no botão, porque por padrão eles não herdam a fonte da página.

Testei no navegador o envio vazio, um e-mail inválido (`ana@`), uma senha curta, a navegação pelo teclado e a visualização em tela de celular pelas ferramentas de desenvolvedor.

## 2. Vue 3 (Composition API)

A to-do list está em `frontend/`, criada com o `create-vue` (Vite) em TypeScript, com ESLint e Prettier, os mesmos do backend. Não incluí Vue Router nem Pinia: a aplicação tem uma tela só, e o estado cabe em um componente. Também escolhi as versões estáveis das ferramentas em vez das experimentais que o instalador oferecia. O visual partiu de uma referência de design gerada com o Claude, e reaproveitei as cores e o estilo de cartão do formulário do item 1.

### Componentes

- **`App.vue`:** é o dono do estado. Guarda a lista de tarefas e o filtro ativo, calcula a lista filtrada e as contagens, e é o único que adiciona, marca e remove tarefas.
- **`TodoForm.vue`:** controla só o texto digitado. Ao enviar, avisa o `App` com o título e limpa o campo.
- **`TodoItem.vue`:** mostra uma tarefa, com checkbox, título e botão de remover.
- **`TodoFilter.vue`:** mostra os três filtros com as contagens e destaca o ativo.

A comunicação segue o padrão do Vue: **os dados descem por props e os eventos sobem por emits**. O `TodoItem` recebe a tarefa por prop, mas não a altera: quando a pessoa marca ou remove, ele emite `toggle` ou `remove` com o `id`, e o `App` faz a alteração. Props são somente leitura, e concentrar as mudanças em um lugar deixa claro quem altera o estado. Os componentes usam `defineProps` e `defineEmits` na forma tipada, então o TypeScript confere o que é passado e emitido.

O tipo `Task` e o tipo `TaskFilter` (`'all' | 'pending' | 'done'`) ficam em `src/types/task.ts`, porque são usados por mais de um componente.

### Primitivas da Composition API

- **`ref`:** usei para a lista (`tasks`), o filtro ativo (`activeFilter`) e o texto do formulário (`newTaskTitle`). O filtro e o texto são strings, e o `reactive` não aceita tipos primitivos. Na lista, o motivo é outro: ao remover uma tarefa, eu crio um array novo com `filter` e substituo o antigo (`tasks.value = ...`). Com `ref`, a variável é um container que não muda, e o Vue percebe a troca do valor. Com `reactive`, a reatividade fica presa ao objeto original, e substituí-lo quebraria a ligação com o template.
- **`computed`:** usei para a lista filtrada (`filteredTasks`) e para as contagens (`completedCount` e `pendingCount`). São valores derivados da lista: o `computed` recalcula sozinho quando a lista ou o filtro mudam e guarda o resultado em cache até lá. A lista filtrada é só uma visão de `tasks`, e não uma segunda lista, então não preciso manter dois estados sincronizados.
- **`v-model`:** liga o campo de texto do `TodoForm` ao `ref`, nos dois sentidos.

No `TodoFilter`, mantive o par prop + evento para ficar igual aos outros componentes. Sei que o Vue tem o `defineModel`, que simplifica esse padrão em um `v-model` no componente, mas preferi a consistência.

### Outros detalhes

- O `v-for` usa o `id` como `:key`, gerado com `crypto.randomUUID()`. Com o índice, ao remover uma tarefa, os índices das seguintes mudariam, e o Vue poderia reaproveitar o elemento errado.
- O formulário usa `@submit.prevent`, que impede o recarregamento da página e permite adicionar com Enter. Tarefas vazias ou só com espaços são ignoradas com `trim()`.
- Há duas mensagens de lista vazia: uma quando não há tarefas e outra quando o filtro escolhido não tem nenhuma.
- Os estilos globais (variáveis, reset e `body`) ficam em `src/assets/main.css`, e o resto fica em cada componente com `<style scoped>`, que limita o CSS ao componente.
- Acessibilidade: cada checkbox tem um `<label>` com `for`/`id` dinâmicos, o botão de remover tem `aria-label`, os filtros usam `aria-pressed`, e todos os botões têm foco visível.
- Títulos muito longos quebram a linha (`overflow-wrap: anywhere`) em vez de estourar o cartão.

### Problemas que encontrei

- O cartão ficava estreito: o Vue monta a aplicação dentro de uma `<div id="app">`, e era ela, não o `<main>`, que o flex do `body` centralizava. Resolvi dando largura à `#app` no CSS global.
- O VS Code acusava erro ao importar o `App.vue` até eu instalar a extensão Vue (Official), que ensina o editor a entender arquivos `.vue`.
- No começo, usei `{{ }}` dentro de atributos, o que não funciona no Vue. Para atributos dinâmicos é preciso o `:` (como em `:id`), com uma expressão JavaScript.

## 3. TypeScript

Criei uma interface `User` para definir o formato de um usuário e tipei `users` como `User[]`, para que o TypeScript aponte erro caso seja adicionado um usuário fora do padrão. Usei `interface` porque ela descreve bem o formato de um objeto e pode ser estendida depois, se o modelo crescer.

Eu já sabia que a função precisaria de um `filter` sobre a lista recebida por parâmetro. Na versão básica, ela recebe `User[]`, mantém quem tem mais de 23 anos e devolve apenas os nomes (`string[]`). Para o bônus, usei o Claude Code para gerar a tipagem genérica que permite filtrar por qualquer campo numérico, o que resultou no tipo `NumericKeys<T>`. Depois estudei como ele funciona, e explico abaixo. O código completo está em `02-typescript/users.ts`.

### O tipo `NumericKeys<T>`

```ts
type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
```

- `keyof T` gera a união das chaves do tipo. Para `User`: `'id' | 'name' | 'age'`.
- `[K in keyof T]` percorre cada uma dessas chaves e monta um novo tipo-objeto (um *mapped type*).
- `T[K]` é o tipo do valor daquela chave (`User['age']` é `number`).
- `T[K] extends number ? K : never` é um *conditional type*, o "if/else" dos tipos. Se o valor da propriedade for `number`, o resultado é o próprio nome da chave. Se não for, o resultado é `never`, um tipo que não tem nenhum valor possível.

Para `User`, o objeto intermediário fica `{ id: 'id'; name: never; age: 'age' }`. O `[keyof T]` do final pega os valores desse objeto, resultando em `'id' | never | 'age'`. Como o `never` some de uma união, sobra apenas `'id' | 'age'`.

### A função `filterByNumericFieldOver`

```ts
const filterByNumericFieldOver = <T extends { name: string }, K extends NumericKeys<T>>(
    items: T[],
    field: K,
    min: number,
): string[] => { ... }
```

- `T extends { name: string }` diz que `T` pode ser qualquer objeto que tenha pelo menos uma propriedade `name` do tipo string. Essa restrição é necessária porque, no final, a função retorna os nomes.
- `K extends NumericKeys<T>` diz que o campo informado precisa ser uma das chaves numéricas de `T`. Com `User`, só são aceitos `'id'` ou `'age'`.
- `items` é a lista a ser filtrada, `field` é o campo usado na comparação, `min` é o valor mínimo e o retorno `string[]` é a lista de nomes.

Na chamada, não preciso informar os tipos manualmente, porque o TypeScript os infere: ao passar `users`, ele entende que `T = User`, e ao passar `'age'`, entende que `K = 'age'`. Se eu tentar passar `'name'` ou um campo que não existe, o TypeScript aponta o erro antes mesmo de executar, e o editor sugere apenas os campos válidos no autocomplete.

No corpo da função, o `filter` mantém só os itens cujo campo é maior que `min`, e o `map` transforma cada item no seu `name`. Precisei usar `item[field] as number` porque, dentro da função, `T` e `K` ainda são genéricos, e o TypeScript não consegue provar sozinho que `T[K]` é um número. O `as number` informa isso ao compilador. Nesse caso é seguro, já que o `NumericKeys` garante que o campo é numérico.

### Resultado

```ts
filterByNumericFieldOver(users, 'age', 23); // ['Ana', 'Pedro']
filterByNumericFieldOver(users, 'id', 1);   // ['Pedro', 'Maria']
```

Em vez de uma função fixa que só filtrava usuários com mais de 23 anos, passei a ter uma função reutilizável para qualquer campo numérico, qualquer valor mínimo e até outros tipos de objeto que tenham `name`.

## 4. Banco de Dados (SQL)

Separei o exercício em dois arquivos: `schema.sql`, com a criação da tabela e a inserção dos dados, e `queries.sql`, com as consultas pedidas. Padronizei as palavras-chave em maiúsculas e os nomes que eu criei (tabela, colunas e apelidos) em minúsculas, para separar visualmente o que é da linguagem do que é meu.

### `schema.sql`

- A coluna `id` é a chave primária e usa `AUTO_INCREMENT`, então não preciso informar o `id` a cada inserção: o próprio banco gera 1, 2 e 3.
- A coluna `name` não aceita valor nulo (`NOT NULL`), porque todo usuário precisa ter um nome.
- A coluna `email` também é `NOT NULL` e, além disso, `UNIQUE`, porque o mesmo e-mail não pode pertencer a dois usuários diferentes.
- A coluna `created_at` é do tipo `DATE`, já que a tabela do enunciado guarda só a data, sem horário. Ela tem a data atual como valor padrão: se nenhuma data for informada, o banco preenche com a data do dia. No MySQL 8, usar uma função como valor padrão numa coluna `DATE` exige colocar a expressão entre parênteses, por isso ficou `DEFAULT (CURRENT_DATE)`.

Nos `INSERT`, omiti o `id` justamente para que o `AUTO_INCREMENT` o gere.

### `queries.sql`

**Listagem do mais recente para o mais antigo**

O `SELECT * FROM users` retorna todas as linhas da tabela, e o `ORDER BY created_at DESC` as ordena pela data de criação de forma decrescente. Como a ordem padrão do `ORDER BY` é crescente, o `DESC` é o que inverte e coloca o usuário mais recente primeiro.

**Contagem de usuários por mês (bônus)**

- `DATE_FORMAT(created_at, '%Y-%m')` transforma cada data no formato ano-mês (`2024-02-15` vira `2024-02`), e o apelido `month` deixa a coluna mais legível.
- `GROUP BY month` junta em um mesmo grupo todas as linhas com o mesmo ano-mês.
- `COUNT(*)` conta quantas linhas existem em cada grupo, com o apelido `user_count`. É essa combinação que gera o resultado: `2024-02` com 2 usuários e `2024-01` com 1.
- `ORDER BY month DESC` ordena do mês mais recente para o mais antigo, no mesmo sentido da primeira query. Como o formato é `ano-mês` com dois dígitos no mês, a ordem alfabética do texto coincide com a ordem cronológica.

Um cuidado importante foi incluir o ano no agrupamento, e não só o mês. Se eu agrupasse apenas pelo mês, um usuário de janeiro de 2024 e outro de janeiro de 2025 cairiam no mesmo grupo, e a contagem ficaria errada sem gerar nenhum erro. Nos dados do enunciado isso não aparece, porque todos são de 2024, mas a query precisa funcionar para dados futuros.

### Como testei

Testei os dois arquivos no DB Fiddle, com MySQL 8. No caminho, encontrei três erros:

- Uma vírgula sobrando depois da última coluna do `CREATE TABLE`.
- O `DEFAULT CURRENT_DATE()` sem parênteses, que o MySQL não aceita em coluna `DATE`.
- A tabela criada como `Users` e consultada como `users`. O DB Fiddle roda em Linux, onde o MySQL diferencia maiúsculas de minúsculas nos nomes de tabela, então ele dizia que `users` não existia. Foi isso que me levou a padronizar o nome em minúsculas.

## 5. Backend (NestJS)

A API está em `backend/`. Criei o projeto com o Nest CLI e gerei o módulo de usuários com `nest g module users`, `nest g controller users` e `nest g service users`, que já criam os arquivos no padrão do framework e registram o `UsersModule` no `AppModule`. Os dados ficam em memória, como o enunciado permite.

### Estrutura

backend/src/
├── main.ts                       # ponto de entrada: cria a aplicação e sobe o servidor
├── app.module.ts                 # módulo raiz, importa o UsersModule
└── users/
├── users.module.ts           # agrupa o controller e o service de usuários
├── users.controller.ts       # rotas HTTP (GET e POST /users)
├── users.service.ts          # regra de negócio e armazenamento em memória
├── dto/
│   └── create-user.dto.ts    # formato do corpo do POST
└── interfaces/
└── user.interface.ts     # formato de um usuário


Organizei por funcionalidade: tudo que é de usuários fica dentro de `users/`. Os arquivos principais do módulo ficam na raiz da pasta, e os de apoio (DTO e interface) ficam em subpastas por tipo. Se a API ganhar outro recurso, como produtos, ele vira uma pasta `products/` com a mesma estrutura, sem misturar com a de usuários.

### Responsabilidade de cada parte

- **Module:** o `UsersModule` declara quais controllers e providers pertencem a ele. O `AppModule` só importa o `UsersModule`, sem precisar conhecer o que tem dentro.
- **Controller:** cuida apenas da camada HTTP. O `@Controller('users')` define o prefixo da rota, o `@Get()` e o `@Post()` mapeiam os métodos, e o `@Body()` lê o corpo da requisição. Ele não tem lógica própria, só repassa a chamada para o service e devolve o resultado. O Nest converte o retorno para JSON e responde com status 200 no GET e 201 no POST.
- **Service:** concentra a regra de negócio. Guarda a lista de usuários num array privado, já iniciado com a Ana e o Pedro do enunciado, e controla o próximo `id` com um contador que começa em 3. O `findAll()` retorna a lista, e o `create()` monta o novo usuário, adiciona na lista e o retorna. O service não sabe nada de HTTP.
- **Interface `User`:** descreve o formato de um usuário (`id`, `name`, `email`) e tipa os retornos do service e do controller.
- **DTO `CreateUserDto`:** descreve o que o cliente envia no POST, só `name` e `email`. Ele não tem `id` porque quem gera o `id` é o servidor. Usei classe, e não interface, porque classes continuam existindo depois da compilação para JavaScript, e o Nest usa essa informação em tempo de execução. Isso também permite adicionar validação com `class-validator` no futuro.

Separar controller e service faz com que trocar o array por um banco de dados real exija mudança apenas no service. O controller continua igual, porque só chama `findAll()` e `create()` sem saber onde os dados ficam.

### Injeção de dependência

O controller recebe o service pelo construtor (`constructor(private readonly usersService: UsersService)`), sem nenhum `new UsersService()` no código. O Nest lê o tipo do parâmetro e entrega a instância pronta. Por padrão, ele cria uma única instância do service e a compartilha. É por isso que a lista em memória se mantém entre uma requisição e outra: todas usam o mesmo objeto.

Isso também facilita os testes, porque num teste é possível fornecer um service falso para o controller sem alterar o código dele.

### Decisões no `create()`

Inicialmente usei o spread (`{ id: this.nextId++, ...createUserDto }`) para montar o novo usuário. Depois percebi um problema: o DTO só existe para o TypeScript, e em tempo de execução o Nest não remove os campos extras do corpo da requisição. Se o cliente enviasse `"id": 1`, esse valor sobrescreveria o `id` gerado, porque o spread vem depois, e haveria dois usuários com o mesmo `id`. Campos que nem existem no modelo, como `"admin": true`, também seriam salvos.

Troquei por uma atribuição explícita de `name` e `email`, então qualquer outro campo é ignorado. Num projeto real, eu usaria o `ValidationPipe` com `whitelist: true`, que remove automaticamente os campos que não estão no DTO.

### `import type` no controller

No controller, a interface `User` é importada com `import type`. O projeto usa `isolatedModules` e `emitDecoratorMetadata`, e com essa combinação o TypeScript exige que um tipo usado na assinatura de um método decorado seja importado como tipo (erro TS1272). Isso acontece porque o Nest lê os tipos desses métodos em tempo de execução, e interfaces não existem depois da compilação. O `CreateUserDto` e o `UsersService` são classes, então o import normal funciona para eles.

Também precisei adicionar `"rootDir": "./"` ao `tsconfig.json`, porque o TypeScript 6 passou a exigir essa opção explicitamente.

### Limitação do armazenamento em memória

Como os dados ficam num array na memória do processo, os usuários criados pelo POST somem quando o servidor reinicia. A Ana e o Pedro voltam porque estão no código como valor inicial do array, e o contador de `id` volta para 3. Com o `npm run start:dev`, que reinicia o servidor a cada arquivo salvo, isso também acontece durante o desenvolvimento. Para persistir os dados, bastaria substituir o array por um banco dentro do `UsersService`.

### Como testei

Subi o servidor com `npm run start:dev` e testei as rotas com o Bruno. A collection está em `backend/users-api/`, com três requisições:

- **List users:** GET que retorna a Ana e o Pedro, no formato do enunciado.
- **Create user:** POST com a Maria, que retorna o usuário criado com `id` 3. Rodando o GET em seguida, ela aparece na lista.
- **Create user - ignore extra fields:** POST com `id` e `admin` no corpo, que retorna o usuário com o próximo `id` gerado pelo servidor e sem o campo `admin`.

Para rodar: `npm install` e `npm run start:dev` dentro de `backend/`, e a API fica disponível em `http://localhost:3000/users`.

## 6. Git (estratégia de commits)

## 7. Organização de Projeto

Neste desafio usei versões simplificadas das estruturas abaixo, porque os exercícios eram pequenos. Num projeto fullstack real, começando do zero, eu organizaria assim.

### Frontend (Vue 3)

src/
├── assets/ # CSS global, fontes e imagens
├── components/ # componentes reutilizáveis
│ └── ui/ # componentes base (botão, input, modal)
├── views/ # uma página por rota (LoginView, DashboardView)
├── router/ # definição das rotas (Vue Router)
├── stores/ # estado global (Pinia), como o usuário logado
├── composables/ # lógica reutilizável com a Composition API (useAuth, useFetch)
├── services/ # chamadas à API, separadas dos componentes
├── types/ # interfaces e tipos compartilhados
├── utils/ # funções puras (formatar data, validar e-mail)
├── App.vue
└── main.ts


A ideia é separar por responsabilidade. Os componentes cuidam da interface, os `services` concentram as chamadas HTTP (se a URL da API mudar, altero em um lugar só), e os `composables` guardam a lógica que mais de um componente usa. Separo `views` de `components` para distinguir o que é uma página inteira do que é uma peça reutilizável. Além disso, teria `.env` para a URL da API, ESLint e Prettier desde o começo, e uma pasta de testes.

Se o projeto crescesse muito, eu migraria para uma organização por funcionalidade (`features/auth/`, `features/tasks/`, cada uma com seus componentes, store e services), para não ter pastas gigantes misturando assuntos diferentes.

### Backend (NestJS)

src/
├── main.ts
├── app.module.ts
├── modules/
│ ├── users/
│ │ ├── dto/ # create-user.dto.ts, update-user.dto.ts
│ │ ├── entities/ # user.entity.ts
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ └── users.module.ts
│ └── auth/
├── common/ # guards, pipes, filters, interceptors e decorators compartilhados
├── config/ # leitura das variáveis de ambiente
└── database/ # conexão e migrations
test/ # testes e2e


O NestJS já incentiva a organização por módulos, e eu sigo isso: um módulo por domínio (`users`, `auth`), cada um com seu controller, service, DTOs e entidades. O controller só recebe a requisição e devolve a resposta, o service tem a regra de negócio, e os DTOs definem o formato dos dados que entram. Assim, cada domínio fica isolado e fácil de encontrar. O que é usado por vários módulos (como um guard de autenticação ou um filtro de erros) vai para `common`, e as configurações ficam em variáveis de ambiente, fora do código.

## 8. Cenário de Problema

### Primeiras verificações

1. **Reproduzir e medir.** Antes de mudar qualquer coisa, abriria a aba Network das ferramentas de desenvolvedor para ver o que demora: se é o carregamento da página (arquivos JavaScript e CSS grandes, imagens, fontes) ou uma requisição para a API. A cascata de requisições mostra também se há chamadas em sequência que poderiam ser feitas em paralelo. O Lighthouse ajuda a ter uma visão geral.
2. **Separar frontend de backend.** Se a lentidão estiver na resposta da API, olharia o tempo do endpoint nos logs do backend e chamaria ele direto (com curl ou Postman) para isolar o problema da interface.
3. **No backend,** verificaria a consulta ao banco (se a busca do usuário por e-mail tem índice, usando `EXPLAIN`), chamadas a serviços externos e o custo do hash de senha, que se estiver configurado alto demais deixa o login lento.
4. **O contexto:** se acontece em todo ambiente ou só em produção, para todos os usuários ou só alguns, e se começou depois de algum deploy.

### Duas possíveis soluções

1. **Carregar só o necessário na tela de login.** Usar lazy loading nas rotas, para que a tela de login baixe só o código dela e não o da aplicação inteira, além de comprimir imagens e carregar apenas os pesos de fonte usados. Arquivos estáticos podem ir para cache ou CDN.
2. **Otimizar o backend do login.** Criar um índice na coluna de e-mail da tabela de usuários, para a busca não percorrer a tabela inteira, e revisar o que a rota faz: se ela carrega dados que não são necessários no login, ou chama serviços que poderiam ser feitos depois.

Além disso, independente da causa, mostraria um estado de carregamento no botão de entrar, para a pessoa saber que algo está acontecendo enquanto espera.

## Uso de Ferramentas de IA