#!/bin/bash

# Script para limpar banco de teste usando container Docker
echo "🧹 Limpando banco de teste usando container Docker..."

# Carregar variáveis de ambiente de teste
export $(cat env.test | xargs)

# Nome do banco de teste
TEST_DB_NAME="dashboard_order_test"

echo "📊 Verificando se o container MySQL de teste está rodando..."

# Verificar se o container está rodando
if ! docker ps | grep -q "dashboard_mysql_test"; then
    echo "❌ Container MySQL de teste não está rodando!"
    echo "🚀 Iniciando container..."
    docker-compose -f ../docker-compose.dev.yml up -d mysql-test
    
    # Aguardar container estar pronto
    echo "⏳ Aguardando container estar pronto..."
    sleep 10
fi

echo "✅ Container MySQL de teste está rodando!"

echo "📊 Limpando dados do banco: $TEST_DB_NAME"

# Conectar ao MySQL do container e limpar dados (manter estrutura)
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "USE $TEST_DB_NAME; DELETE FROM usuarios; DELETE FROM grupos;"

echo "✅ Banco de teste limpo com sucesso!"
echo "📝 Dados removidos, estrutura mantida"
echo "🌐 Container MySQL de teste rodando na porta 3307"
