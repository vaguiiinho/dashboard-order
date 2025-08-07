#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando do exemplo..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente conforme necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.dev.yml up --build -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Ambiente de desenvolvimento iniciado!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   phpMyAdmin: http://localhost:8080"
echo "   Banco MySQL: localhost:3306"
echo ""
echo "📝 Para ver os logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 Para parar:"
echo "   ./scripts/stop-dev.sh"
