#!/bin/bash

# 🧹 Script de Limpeza Completa
# Remove todos os containers, volumes e dados do projeto

set -e

echo "🧹 Dashboard de Ordens de Serviço - Limpeza Completa"
echo "===================================================="

# Confirmar ação
echo "⚠️  ATENÇÃO: Este script irá remover:"
echo "   • Todos os containers do projeto"
echo "   • Todos os volumes de dados (incluindo dados do banco)"
echo "   • Dependências instaladas (node_modules)"
echo ""
read -p "Tem certeza que deseja continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada"
    exit 1
fi

echo "🛑 Parando todos os containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

echo "🗑️ Removendo containers do projeto..."
docker container rm -f dashboard_mysql_dev dashboard_mysql_test dashboard_adminer 2>/dev/null || true
docker container rm -f dashboard_mysql_prod dashboard_backend_prod dashboard_frontend_prod 2>/dev/null || true

echo "💾 Removendo volumes de dados..."
docker volume rm -f dashboard_order_mysql_dev_data dashboard_order_mysql_test_data 2>/dev/null || true
docker volume rm -f dashboard_order_mysql_data 2>/dev/null || true

echo "🧹 Removendo dependências do backend..."
rm -rf backend/node_modules 2>/dev/null || true
rm -rf backend/dist 2>/dev/null || true

echo "🧹 Removendo dependências do frontend..."
rm -rf frontend/node_modules 2>/dev/null || true
rm -rf frontend/.next 2>/dev/null || true

echo "🧹 Removendo arquivos temporários..."
rm -rf backend/coverage 2>/dev/null || true
rm -rf backend/.env 2>/dev/null || true

echo "🧹 Limpando imagens órfãs do Docker..."
docker image prune -f 2>/dev/null || true

echo ""
echo "✅ Limpeza concluída com sucesso!"
echo ""
echo "📋 Para reconfigurar o ambiente:"
echo "   ./scripts/setup-dev.sh   - Para desenvolvimento"
echo "   ./scripts/setup-test.sh  - Para testes"
