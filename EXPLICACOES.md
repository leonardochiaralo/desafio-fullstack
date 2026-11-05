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
## 5. Backend (NestJS)
## 6. Git (estratégia de commits)
## 7. Organização de Projeto
## 8. Cenário de Problema
## Uso de Ferramentas de IA