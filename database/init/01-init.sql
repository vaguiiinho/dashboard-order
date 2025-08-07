-- Inicialização do banco de dados Dashboard Orders
USE dashboard_orders;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'supervisor', 'user') DEFAULT 'user',
    department VARCHAR(100),
    city VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias/assuntos
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de setores
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Tabela de estruturas
CREATE TABLE IF NOT EXISTS structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    location VARCHAR(255),
    department_id INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS service_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    category_id INT,
    department_id INT,
    structure_id INT,
    assigned_to INT,
    created_by INT,
    city VARCHAR(100),
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    completion_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (structure_id) REFERENCES structures(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de comentários/histórico
CREATE TABLE IF NOT EXISTS service_order_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_order_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de anexos
CREATE TABLE IF NOT EXISTS service_order_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_order_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Inserir dados iniciais
INSERT IGNORE INTO categories (id, name, description, color) VALUES
(1, 'Manutenção', 'Serviços de manutenção preventiva e corretiva', '#28a745'),
(2, 'Instalação', 'Instalação de novos equipamentos e estruturas', '#007bff'),
(3, 'Reparo', 'Reparos urgentes e emergenciais', '#dc3545'),
(4, 'Inspeção', 'Inspeções técnicas e de segurança', '#ffc107'),
(5, 'Limpeza', 'Serviços de limpeza e conservação', '#6f42c1');

INSERT IGNORE INTO departments (id, name, description) VALUES
(1, 'Técnico', 'Departamento técnico responsável por manutenções'),
(2, 'Operações', 'Departamento de operações e logística'),
(3, 'Qualidade', 'Controle de qualidade e inspeções'),
(4, 'Segurança', 'Segurança do trabalho e patrimonial'),
(5, 'Administrativo', 'Departamento administrativo');

-- Inserir usuário administrador padrão (senha: admin123)
INSERT IGNORE INTO users (id, email, password, name, role, department, city) VALUES
(1, 'admin@dashboard.com', '$2b$10$CwTycUXWue0Thq9StjUM0uBubJxYH2O9JW1FGFXS9W7e3PGNaIz6a', 'Administrador', 'admin', 'Administrativo', 'São Paulo');

-- Criar índices para performance
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_service_orders_category ON service_orders(category_id);
CREATE INDEX idx_service_orders_department ON service_orders(department_id);
CREATE INDEX idx_service_orders_assigned ON service_orders(assigned_to);
CREATE INDEX idx_service_orders_created_at ON service_orders(created_at);
CREATE INDEX idx_service_orders_city ON service_orders(city);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
