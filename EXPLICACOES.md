# Explicações

## 1. HTML + CSS
## 2. Vue 3 (Composition API)
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
## 6. Git (estratégia de commits)
## 7. Organização de Projeto
## 8. Cenário de Problema
## Uso de Ferramentas de IA