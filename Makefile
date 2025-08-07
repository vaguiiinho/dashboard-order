# Makefile para Dashboard de Ordens de Serviço

.PHONY: help dev dev-build prod prod-build stop stop-dev stop-prod clean logs backup install

# Variáveis
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
COMPOSE_DEFAULT = docker-compose

# Help
help: ## Mostra este help
	@echo "Dashboard de Ordens de Serviço - Comandos disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Desenvolvimento
dev: ## Inicia ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	@if [ ! -f .env ]; then cp env.example .env; echo "✅ Arquivo .env criado"; fi
	$(COMPOSE_DEV) up -d
	@echo "✅ Ambiente iniciado!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001"
	@echo "phpMyAdmin: http://localhost:8080"

dev-build: ## Reconstroi e inicia ambiente de desenvolvimento
	@echo "🔨 Reconstruindo ambiente de desenvolvimento..."
	$(COMPOSE_DEV) up --build -d

dev-install: ## Instala dependências no ambiente de desenvolvimento
	@echo "📦 Instalando dependências..."
	$(COMPOSE_DEV) exec backend npm install
	$(COMPOSE_DEV) exec frontend npm install

frontend-only: ## Inicia apenas o frontend para teste (com dados mock)
	@echo "🎨 Iniciando apenas o frontend..."
	./scripts/start-frontend-only.sh

# Produção
prod: ## Inicia ambiente de produção
	@echo "🚀 Iniciando ambiente de produção..."
	@if [ ! -f .env ]; then echo "❌ Arquivo .env não encontrado! Copie env.example"; exit 1; fi
	@if grep -q "change-me" .env; then echo "⚠️  Senhas padrão detectadas! Altere o arquivo .env"; fi
	$(COMPOSE_PROD) up -d
	@echo "✅ Ambiente de produção iniciado!"
	@echo "Aplicação: http://localhost"

prod-build: ## Reconstroi e inicia ambiente de produção
	@echo "🔨 Reconstruindo ambiente de produção..."
	$(COMPOSE_PROD) up --build -d

# Parar serviços
stop: stop-dev ## Para ambiente de desenvolvimento

stop-dev: ## Para ambiente de desenvolvimento
	@echo "🛑 Parando ambiente de desenvolvimento..."
	$(COMPOSE_DEV) down

stop-prod: ## Para ambiente de produção
	@echo "🛑 Parando ambiente de produção..."
	$(COMPOSE_PROD) down

# Limpeza
clean: ## Remove containers, networks e volumes
	@echo "🧹 Limpando containers e volumes..."
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_PROD) down -v --remove-orphans
	docker system prune -f

clean-dev: ## Remove apenas volumes de desenvolvimento
	$(COMPOSE_DEV) down -v

clean-prod: ## Remove apenas volumes de produção
	$(COMPOSE_PROD) down -v

# Logs
logs: ## Mostra logs do ambiente de desenvolvimento
	$(COMPOSE_DEV) logs -f

logs-prod: ## Mostra logs do ambiente de produção
	$(COMPOSE_PROD) logs -f

logs-backend: ## Mostra logs apenas do backend
	$(COMPOSE_DEV) logs -f backend

logs-frontend: ## Mostra logs apenas do frontend
	$(COMPOSE_DEV) logs -f frontend

# Status
status: ## Mostra status dos containers
	@echo "📊 Status dos containers:"
	$(COMPOSE_DEV) ps

status-prod: ## Mostra status dos containers de produção
	$(COMPOSE_PROD) ps

# Backup
backup: ## Realiza backup do banco de dados
	@echo "💾 Realizando backup..."
	./scripts/backup-db.sh

# Utilitários
shell-backend: ## Acessa shell do container backend
	$(COMPOSE_DEV) exec backend bash

shell-frontend: ## Acessa shell do container frontend
	$(COMPOSE_DEV) exec frontend sh

shell-mysql: ## Acessa shell do MySQL
	$(COMPOSE_DEV) exec mysql mysql -u root -p

# Testes
test-backend: ## Executa testes do backend
	$(COMPOSE_DEV) exec backend npm run test

test-frontend: ## Executa testes do frontend
	$(COMPOSE_DEV) exec frontend npm run test

# Build específicos
build-backend: ## Reconstroi apenas o backend
	$(COMPOSE_DEV) build backend

build-frontend: ## Reconstroi apenas o frontend
	$(COMPOSE_DEV) build frontend

# Inicialização completa
setup: ## Setup inicial completo do projeto
	@echo "🏗️  Setup inicial do projeto..."
	@if [ ! -f .env ]; then cp env.example .env; echo "✅ Arquivo .env criado"; fi
	@echo "📝 Configure o arquivo .env antes de continuar"
	@echo "📦 Para instalar dependências: make dev-install"
	@echo "🚀 Para iniciar desenvolvimento: make dev"

# Comandos avançados
migrate: ## Executa migrations do banco
	$(COMPOSE_DEV) exec backend npm run migration:run

seed: ## Executa seeds do banco
	$(COMPOSE_DEV) exec backend npm run seed

reset-db: ## Reseta banco de dados (desenvolvimento)
	@echo "⚠️  Isso irá apagar todos os dados!"
	@read -p "Continuar? (y/N): " confirm && [ "$$confirm" = "y" ]
	$(COMPOSE_DEV) down -v
	$(COMPOSE_DEV) up -d mysql
	@sleep 10
	$(COMPOSE_DEV) up -d

# Default target
.DEFAULT_GOAL := help
