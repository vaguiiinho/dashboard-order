#!/bin/bash

# 🧪 Script de Setup para Ambiente de Teste
# Este script configura o ambiente de testes integrados

set -e

echo "🧪 Dashboard de Ordens de Serviço - Setup Testes"
echo "==============================================="

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

echo "✅ Docker encontrado"

# Parar container de teste existente
echo "🛑 Parando container de teste existente..."
docker-compose -f docker-compose.dev.yml down mysql-test 2>/dev/null || true

# Iniciar banco de teste
echo "🗄️ Iniciando banco de dados MySQL para testes..."
docker-compose -f docker-compose.dev.yml up -d mysql-test

# Aguardar banco estar pronto
echo "⏳ Aguardando banco de teste estar pronto..."
sleep 15

# Verificar se o banco está respondendo
echo "🔍 Verificando conexão com banco de teste..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec dashboard_mysql_test mysqladmin ping -h localhost --silent; then
        echo "✅ Banco de teste está respondendo!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Timeout: Banco de teste não respondeu após $max_attempts tentativas"
        exit 1
    fi
    
    echo "⏳ Tentativa $attempt/$max_attempts - Aguardando banco..."
    sleep 2
    ((attempt++))
done

# Configurar banco de teste
echo "🔧 Configurando banco de teste..."

# Criar usuário de teste se não existir
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "CREATE USER IF NOT EXISTS 'test_user'@'%' IDENTIFIED BY 'test_password';" 2>/dev/null || true

# Configurar banco e permissões
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "DROP DATABASE IF EXISTS dashboard_order_test;"
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "CREATE DATABASE dashboard_order_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON dashboard_order_test.* TO 'test_user'@'%';"
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "FLUSH PRIVILEGES;"

echo "✅ Banco de teste configurado!"

# Executar migrations no banco de teste
echo "🚀 Executando migrations no banco de teste..."
cd backend

# Definir URL do banco de teste
export DATABASE_URL="mysql://test_user:test_password@localhost:3307/dashboard_order_test"

# Executar migrations
npx prisma migrate deploy

echo "✅ Migrations executadas com sucesso!"

cd ..

echo ""
echo "🎉 Ambiente de teste configurado com sucesso!"
echo ""
echo "🧪 Para executar os testes:"
echo "   Todos os testes:    cd backend && npm run test:all"
echo "   Testes unitários:   cd backend && npm run test:unit"
echo "   Testes integração:  cd backend && npm run test:integration"
echo "   Testes repositório: cd backend && npm run test:repositories"
echo ""
echo "🌐 Banco de teste rodando em:"
echo "   Host: localhost"
echo "   Porta: 3307"
echo "   Database: dashboard_order_test"
echo "   Usuário: test_user"
echo "   Senha: test_password"
