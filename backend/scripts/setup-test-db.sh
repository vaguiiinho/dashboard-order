#!/bin/bash

# Script para configurar banco de teste usando container Docker
echo "🔧 Configurando banco de teste usando container Docker..."

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

echo "📊 Conectando ao banco de teste: $TEST_DB_NAME"

# Conectar ao MySQL do container e criar banco de teste
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "DROP DATABASE IF EXISTS $TEST_DB_NAME;"
docker exec dashboard_mysql_test mysql -u root -prootpassword -e "CREATE DATABASE $TEST_DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "✅ Banco de teste criado com sucesso!"

# Gerar cliente Prisma para teste
echo "🔨 Gerando cliente Prisma para teste..."
npx prisma generate --schema=./prisma/schema.test.prisma

# Executar migrations no banco de teste
echo "🚀 Executando migrations no banco de teste..."
npx prisma migrate deploy --schema=./prisma/schema.test.prisma

echo "🎉 Banco de teste configurado com sucesso!"
echo "📝 Para executar os testes, use: npm run test:repositories ou npm run test:e2e"
echo "🌐 Container MySQL de teste rodando na porta 3307"
