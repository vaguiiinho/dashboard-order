#!/bin/bash

# Script para configurar o ambiente do frontend
# Este script facilita a configuração das variáveis de ambiente

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
    echo -e "${BLUE}  Frontend Environment Setup${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para configurar ambiente de desenvolvimento
setup_dev() {
    print_message "Configurando ambiente de desenvolvimento..."
    
    if [ -f "frontend/env.local" ]; then
        cp frontend/env.local frontend/.env.local
        print_message "✅ Arquivo .env.local criado com configurações de desenvolvimento"
    else
        print_warning "Arquivo env.local não encontrado. Criando configuração padrão..."
        cat > frontend/.env.local << 'EOF'
# Frontend Environment Configuration for Development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IXC_API_URL=https://crm.tubaron.net/webservice/v1
NEXT_PUBLIC_IXC_TOKEN=44:82225522c68ce028c0652e38ccbade6ac43df33110853ec131ad1797aa1db656
NEXT_PUBLIC_APP_NAME=Dashboard de Ordens de Serviço
NEXT_PUBLIC_DEBUG_MODE=true
EOF
        print_message "✅ Arquivo .env.local criado com configuração padrão"
    fi
}

# Função para configurar ambiente de produção
setup_prod() {
    print_message "Configurando ambiente de produção..."
    
    if [ -f "frontend/env.production" ]; then
        cp frontend/env.production frontend/.env.local
        print_message "✅ Arquivo .env.local criado com configurações de produção"
        print_warning "⚠️  Lembre-se de atualizar o token do IXC para produção!"
    else
        print_warning "Arquivo env.production não encontrado. Criando configuração padrão..."
        cat > frontend/.env.local << 'EOF'
# Frontend Environment Configuration for Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_IXC_API_URL=https://crm.tubaron.net/webservice/v1
NEXT_PUBLIC_IXC_TOKEN=your_production_ixc_token_here
NEXT_PUBLIC_APP_NAME=Dashboard de Ordens de Serviço
NEXT_PUBLIC_DEBUG_MODE=false
EOF
        print_message "✅ Arquivo .env.local criado com configuração padrão de produção"
    fi
}

# Função para mostrar configuração atual
show_current() {
    print_message "Configuração atual do frontend:"
    if [ -f "frontend/.env.local" ]; then
        echo ""
        cat frontend/.env.local
        echo ""
    else
        print_warning "Arquivo .env.local não encontrado"
    fi
}

# Função para resetar configuração
reset_env() {
    print_warning "Isso irá remover o arquivo .env.local. Tem certeza? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -f frontend/.env.local
        print_message "✅ Arquivo .env.local removido"
    else
        print_message "Operação cancelada."
    fi
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev              - Configurar ambiente de desenvolvimento"
    echo "  prod             - Configurar ambiente de produção"
    echo "  current          - Mostrar configuração atual"
    echo "  reset            - Remover arquivo .env.local"
    echo "  help             - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 dev           # Configurar para desenvolvimento"
    echo "  $0 prod          # Configurar para produção"
    echo "  $0 current       # Ver configuração atual"
    echo ""
    echo "💡 Nota: O arquivo .env.local é ignorado pelo git por segurança"
}

# Função principal
main() {
    case "${1:-help}" in
        dev)
            setup_dev
            ;;
        prod)
            setup_prod
            ;;
        current)
            show_current
            ;;
        reset)
            reset_env
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
