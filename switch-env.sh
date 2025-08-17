#!/bin/bash

# Script para alternar entre configurações de ambiente
# Útil para trocar entre usuário root (migrações) e dashboard_user (desenvolvimento)

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Environment Switcher${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para usar configuração root (migrações)
use_root() {
    print_message "Configurando para usar usuário ROOT (migrações Prisma)..."
    
    if [ -f "backend/env.dev" ]; then
        cp backend/env.dev backend/.env
        print_message "✅ Configuração ROOT ativada!"
        print_message "DATABASE_URL agora usa: mysql://root:rootpassword@localhost:3306/dashboard_order_db"
        print_message "Use esta configuração para executar migrações do Prisma"
    else
        print_warning "Arquivo env.dev não encontrado. Criando configuração manualmente..."
        echo 'DATABASE_URL="mysql://root:rootpassword@localhost:3306/dashboard_order_db"' >> backend/.env
        print_message "✅ Configuração ROOT adicionada ao .env"
    fi
}

# Função para usar configuração dashboard_user (desenvolvimento)
use_dashboard_user() {
    print_message "Configurando para usar usuário DASHBOARD_USER (desenvolvimento)..."
    
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        print_message "✅ Configuração DASHBOARD_USER ativada!"
        print_message "DATABASE_URL agora usa: mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db"
        print_message "Use esta configuração para desenvolvimento da aplicação"
    else
        print_warning "Arquivo env.example não encontrado. Criando configuração manualmente..."
        echo 'DATABASE_URL="mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db"' >> backend/.env
        print_message "✅ Configuração DASHBOARD_USER adicionada ao .env"
    fi
}

# Função para mostrar configuração atual
show_current() {
    print_message "Configuração atual do DATABASE_URL:"
    if grep -q "DATABASE_URL" backend/.env; then
        grep "DATABASE_URL" backend/.env
    else
        print_warning "DATABASE_URL não encontrado no arquivo .env"
    fi
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  root              - Usar usuário ROOT (para migrações Prisma)"
    echo "  user              - Usar usuário DASHBOARD_USER (para desenvolvimento)"
    echo "  current           - Mostrar configuração atual"
    echo "  help              - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 root           # Para executar migrações"
    echo "  $0 user           # Para desenvolvimento"
    echo "  $0 current        # Ver configuração atual"
    echo ""
    echo "💡 Fluxo recomendado:"
    echo "  1. $0 root       # Para executar migrações"
    echo "  2. npx prisma migrate dev"
    echo "  3. $0 user       # Para voltar ao desenvolvimento"
}

# Função principal
main() {
    case "${1:-help}" in
        root)
            use_root
            ;;
        user)
            use_dashboard_user
            ;;
        current)
            show_current
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_warning "Comando inválido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
