#!/bin/bash

# Script de backup do banco de dados
BACKUP_DIR="./database/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="dashboard_orders_backup_${DATE}.sql"

echo "💾 Iniciando backup do banco de dados..."

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Realizar backup
if docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump \
    -u root -p$MYSQL_ROOT_PASSWORD \
    --single-transaction \
    --routines \
    --triggers \
    dashboard_orders > "${BACKUP_DIR}/${BACKUP_FILE}"; then
    
    echo "✅ Backup realizado com sucesso!"
    echo "📁 Arquivo: ${BACKUP_DIR}/${BACKUP_FILE}"
    
    # Comprimir backup
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"
    echo "🗜️  Backup comprimido: ${BACKUP_DIR}/${BACKUP_FILE}.gz"
    
    # Limpar backups antigos (manter últimos 7 dias)
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
    echo "🧹 Backups antigos removidos (>7 dias)"
    
else
    echo "❌ Erro ao realizar backup!"
    exit 1
fi
