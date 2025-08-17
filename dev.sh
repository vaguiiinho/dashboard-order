#!/bin/bash

# Script de desenvolvimento para Dashboard de Ordens de Serviço
# Este script facilita o gerenciamento do ambiente de desenvolvimento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Dashboard Dev Environment${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para verificar se o Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    fi
}

# Função para iniciar o ambiente de desenvolvimento
start_dev() {
    print_message "Iniciando ambiente de desenvolvimento..."
    
    check_docker
    
    # Parar containers existentes se houver
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    # Iniciar apenas o MySQL
    print_message "Iniciando MySQL..."
    docker-compose -f docker-compose.dev.yml up -d mysql-dev
    
    # Aguardar MySQL inicializar
    print_message "Aguardando MySQL inicializar..."
    sleep 15
    
    # Verificar se MySQL está rodando
    if docker-compose -f docker-compose.dev.yml ps mysql-dev | grep -q "Up"; then
        print_message "MySQL iniciado com sucesso!"
    else
        print_error "Falha ao iniciar MySQL. Verifique os logs:"
        docker-compose -f docker-compose.dev.yml logs mysql-dev
        exit 1
    fi
    
    print_message "Ambiente de desenvolvimento iniciado!"
    print_message "MySQL rodando na porta 3306"
    print_message "Execute 'cd backend && npm run start:dev' para iniciar o backend"
    print_message "Execute 'cd frontend && npm run dev' para iniciar o frontend"
}

# Função para parar o ambiente de desenvolvimento
stop_dev() {
    print_message "Parando ambiente de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml down
    print_message "Ambiente de desenvolvimento parado!"
}

# Função para mostrar status
status() {
    print_message "Status do ambiente de desenvolvimento:"
    docker-compose -f docker-compose.dev.yml ps
}

# Função para mostrar logs
logs() {
    if [ "$1" = "mysql" ]; then
        docker-compose -f docker-compose.dev.yml logs -f mysql-dev
    else
        print_message "Uso: $0 logs [mysql]"
        print_message "Exemplo: $0 logs mysql"
    fi
}

# Função para resetar o banco
reset_db() {
    print_warning "Isso irá remover todos os dados do banco. Tem certeza? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_message "Resetando banco de dados..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.yml up -d mysql-dev
        sleep 15
        print_message "Banco de dados resetado!"
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
    echo "  start     - Iniciar ambiente de desenvolvimento (MySQL)"
    echo "  stop      - Parar ambiente de desenvolvimento"
    echo "  restart   - Reiniciar ambiente de desenvolvimento"
    echo "  status    - Mostrar status dos containers"
    echo "  logs      - Mostrar logs (mysql)"
    echo "  reset-db  - Resetar banco de dados (remove todos os dados)"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start"
    echo "  $0 logs mysql"
    echo "  $0 reset-db"
}

# Função principal
main() {
    case "${1:-help}" in
        start)
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            stop_dev
            sleep 2
            start_dev
            ;;
        status)
            status
            ;;
        logs)
            logs "$2"
            ;;
        reset-db)
            reset_db
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Comando inválido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
