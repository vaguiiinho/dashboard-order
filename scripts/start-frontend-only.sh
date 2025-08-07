#!/bin/bash

echo "🚀 Iniciando apenas o Frontend para teste..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes do frontend
echo "🛑 Parando containers existentes do frontend..."
docker-compose -f docker-compose.frontend.yml down 2>/dev/null || true

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "⚙️  Criando arquivo .env para desenvolvimento..."
    cat > .env << EOF
# Frontend Environment Variables - Development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
NODE_ENV=development

# Database (não usado no modo frontend-only)
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=dashboard_orders
MYSQL_USER=dashboard_user
MYSQL_PASSWORD=dashboard_pass123

# Backend (não usado no modo frontend-only)
JWT_SECRET=dev-jwt-secret-key-change-in-production
EXTERNAL_API_URL=http://localhost:8000
EOF
    echo "✅ Arquivo .env criado"
fi

# Construir e iniciar apenas o frontend
echo "🔨 Construindo e iniciando o frontend..."
docker-compose -f docker-compose.frontend.yml up --build -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização do frontend..."
sleep 15

# Verificar status
echo "📊 Status do container:"
docker-compose -f docker-compose.frontend.yml ps

echo ""
echo "✅ Frontend iniciado em modo de teste!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📝 Dados para login (modo mock):"
echo "   Email: admin@dashboard.com"
echo "   Senha: admin123"
echo ""
echo "📝 Para ver os logs:"
echo "   docker-compose -f docker-compose.frontend.yml logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose -f docker-compose.frontend.yml down"
echo ""
echo "💡 O frontend está rodando com dados mock (simulados)"
echo "   Para conectar com backend real, inicie o ambiente completo com ./scripts/start-dev.sh"
