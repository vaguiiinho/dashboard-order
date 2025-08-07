#!/bin/bash

echo "🚀 Iniciando ambiente de produção..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Por favor, copie env.example para .env e configure as variáveis:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Verificar variáveis críticas
echo "🔍 Verificando configurações..."
if grep -q "change-me" .env; then
    echo "⚠️  ATENÇÃO: Encontradas senhas padrão no arquivo .env!"
    echo "Por favor, altere todas as senhas que contêm 'change-me'"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers de produção..."
docker-compose -f docker-compose.prod.yml up --build -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 15

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

# Verificar health checks
echo ""
echo "🏥 Verificando saúde dos serviços..."
sleep 5

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx: OK"
else
    echo "❌ Nginx: Falha"
fi

echo ""
echo "✅ Ambiente de produção iniciado!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Aplicação: http://localhost"
echo "   Health Check: http://localhost/health"
echo ""
echo "📝 Para ver os logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Para parar:"
echo "   ./scripts/stop-prod.sh"
