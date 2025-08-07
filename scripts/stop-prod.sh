#!/bin/bash

echo "🛑 Parando ambiente de produção..."

# Parar containers
docker-compose -f docker-compose.prod.yml down

echo "✅ Ambiente de produção parado!"
echo ""
echo "💡 Para backup antes de remover dados:"
echo "   ./scripts/backup-db.sh"
echo ""
echo "🗑️  Para remover volumes (apagar dados permanentemente):"
echo "   docker-compose -f docker-compose.prod.yml down -v"
