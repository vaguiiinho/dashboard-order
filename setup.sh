#!/bin/bash

echo "🚀 Configurando o Dashboard de Ordens de Serviço..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose antes de continuar."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados!"

# Criar arquivos .env se não existirem
echo "📝 Configurando variáveis de ambiente..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Criando backend/.env..."
    cat > backend/.env << EOF
# Database
DATABASE_URL="mysql://root:password@localhost:3306/dashboard_order_db"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"
JWT_EXPIRES_IN="24h"

# Application
PORT=3001
NODE_ENV="development"
EOF
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo "Criando frontend/.env.local..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
fi

echo "✅ Variáveis de ambiente configuradas!"

# Iniciar apenas o banco de dados
echo "🐳 Iniciando banco de dados MySQL..."
docker-compose -f docker-compose.dev.yml up -d mysql-dev

echo "⏳ Aguardando MySQL inicializar..."
sleep 10

# Instalar dependências e configurar backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

echo "🔄 Executando migrações do Prisma..."
npx prisma migrate dev --name init

echo "🌱 Executando seed do banco..."
npm run db:seed

echo "✅ Backend configurado!"

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

echo "✅ Frontend configurado!"

cd ..

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Para executar o projeto:"
echo "   1. Backend: cd backend && npm run start:dev"
echo "   2. Frontend: cd frontend && npm run dev"
echo ""
echo "🔐 Credenciais de teste:"
echo "   Email: admin@exemplo.com"
echo "   Senha: admin123"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo ""
echo "🐳 Para parar o banco: docker-compose -f docker-compose.dev.yml down"

