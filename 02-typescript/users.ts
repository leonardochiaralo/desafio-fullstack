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

const getNamesOfUsersOver23 = (usersList: User[]): string[] => {
    const usersOver23 = usersList.filter(user => user.age > 23);
    return usersOver23.map(user => user.name);
};


console.log(getNamesOfUsersOver23(users));
