-- Script de inicialização do banco de dados para desenvolvimento
-- Este script é executado automaticamente quando o container MySQL é criado

-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS dashboard_order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE dashboard_order_db;

-- Garantir que o usuário dashboard_user tenha todas as permissões
GRANT ALL PRIVILEGES ON dashboard_order_db.* TO 'dashboard_user'@'%';
GRANT ALL PRIVILEGES ON dashboard_order_db.* TO 'dashboard_user'@'localhost';

-- Dar permissão para criar bancos de dados (necessário para Prisma shadow database)
GRANT CREATE ON *.* TO 'dashboard_user'@'%';
GRANT CREATE ON *.* TO 'dashboard_user'@'localhost';

-- Aplicar as permissões
FLUSH PRIVILEGES;

-- Mostrar os bancos de dados criados
SHOW DATABASES;
