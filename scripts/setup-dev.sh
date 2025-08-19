#!/bin/bash

# 🚀 Script de Setup para Desenvolvimento
# Este script configura todo o ambiente de desenvolvimento

set -e

echo "🎯 Dashboard de Ordens de Serviço - Setup Desenvolvimento"
echo "========================================================"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# Iniciar banco de desenvolvimento
echo "🗄️ Iniciando banco de dados MySQL para desenvolvimento..."
docker-compose -f docker-compose.dev.yml up -d mysql-dev

# Aguardar banco estar pronto
echo "⏳ Aguardando banco de dados estar pronto..."
sleep 15

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Configurar arquivo de ambiente se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.template .env
    echo "⚠️  ATENÇÃO: Configure o arquivo backend/.env com suas credenciais!"
fi

# Executar migrations
echo "🔄 Executando migrations do banco..."
npx prisma migrate dev --name "setup_inicial"

# Executar seed
echo "🌱 Populando banco com dados iniciais..."
npm run db:seed

cd ..

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Para iniciar o desenvolvimento:"
echo "   Backend:  cd backend && npm run start:dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 URLs de acesso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Adminer:  http://localhost:8080 (use docker-compose -f docker-compose.dev.yml up -d adminer)"
echo ""
echo "🔐 Credenciais padrão:"
echo "   Email: admin@exemplo.com"
echo "   Senha: admin123"
