#!/bin/bash

echo "🛑 Parando ambiente de desenvolvimento..."

# Parar containers
docker-compose -f docker-compose.dev.yml down

echo "✅ Ambiente de desenvolvimento parado!"
echo ""
echo "💡 Para remover volumes (apagar dados do banco):"
echo "   docker-compose -f docker-compose.dev.yml down -v"
