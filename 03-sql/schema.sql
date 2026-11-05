CREATE TABLE users (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATE DEFAULT CURRENT_DATE()
);

INSERT INTO users (name, email, created_at) VALUES
('Ana', 'ana@email.com', '2024-01-01'),
('Pedro', 'pedro@email.com', '2024-02-01'),
('Maria', 'maria@email.com', '2024-02-15');