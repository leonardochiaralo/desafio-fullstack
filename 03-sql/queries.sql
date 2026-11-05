-- Listar todos os usuários ordenados pela data de criação (do mais recente para o mais antigo)
SELECT * FROM users ORDER BY created_at DESC;

-- Contar quantos usuários foram criados por mês
select 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS user_count
from users
group by month
order by month desc;