interface User {
    id: number;
    name: string;
    age: number;
}

const users: User[] = [
    { id: 1, name: 'Ana', age: 25 },
    { id: 2, name: 'Pedro', age: 30 },
    { id: 3, name: 'Maria', age: 22 },
];

type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

const filterByNumericFieldOver = <T extends { name: string }, K extends NumericKeys<T>>(
    items: T[],
    field: K,
    min: number,
): string[] => {
    const filteredUsers = items.filter(item => (item[field] as number) > min);
    return filteredUsers.map(user => user.name);
};

console.log(filterByNumericFieldOver(users, 'age', 23));
console.log(filterByNumericFieldOver(users, 'id', 1));