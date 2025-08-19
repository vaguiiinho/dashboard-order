# 📋 Comandos Úteis

Referência rápida de comandos para desenvolvimento.

## 🚀 Setup e Inicialização

```bash
# Setup completo de desenvolvimento
./scripts/setup-dev.sh

# Setup ambiente de testes
./scripts/setup-test.sh

# Limpeza completa
./scripts/clean-all.sh

# Iniciar desenvolvimento
cd backend && npm run start:dev    # Backend
cd frontend && npm run dev         # Frontend
```

## 🧪 Testes

```bash
cd backend

# Testes unitários
npm run test:unit                  # Todos unitários
npm run test:entities             # Apenas entidades
npm run test:usecases             # Apenas use cases

# Testes de integração
npm run test:integration          # Todos integração
npm run test:repositories         # Apenas repositories

# Testes combinados
npm run test:all                  # Unit + Integration
npm run test:cov                  # Com cobertura

# Modo watch
npm run test:watch                # Unit em watch
npm run test:integration:watch    # Integration em watch
```

## 🐳 Docker

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d mysql-dev     # Banco dev
docker-compose -f docker-compose.dev.yml up -d mysql-test    # Banco teste
docker-compose -f docker-compose.dev.yml up -d adminer      # Interface admin

# Produção
docker-compose up -d              # Stack completa
docker-compose down               # Parar tudo

# Manutenção
docker-compose logs -f backend    # Logs backend
docker-compose logs -f mysql     # Logs banco
docker system prune -f           # Limpar Docker
```

## 📊 Banco de Dados

```bash
cd backend

# Migrations
npx prisma migrate dev --name nome_migration   # Criar migration
npx prisma migrate deploy                      # Aplicar migrations
npx prisma migrate reset                       # Reset completo

# Prisma Studio
npx prisma studio                # Interface visual

# Seed
npm run db:seed                  # Popular com dados iniciais

# Schema
npx prisma generate              # Regenerar cliente
npx prisma db push               # Sync schema sem migration
```

## 🔍 Debug e Inspeção

```bash
# Logs containers
docker logs dashboard_mysql_dev
docker logs dashboard_mysql_test
docker logs dashboard_backend_prod

# Status containers
docker ps -a                     # Todos containers
docker stats                     # Uso de recursos

# Conectar ao banco
docker exec -it dashboard_mysql_dev mysql -u root -p
docker exec -it dashboard_mysql_test mysql -u root -p

# Inspecionar volumes
docker volume ls
docker volume inspect dashboard_order_mysql_dev_data
```

## 🧹 Limpeza

```bash
# Limpeza seletiva
docker-compose -f docker-compose.dev.yml down mysql-dev
docker-compose -f docker-compose.dev.yml down mysql-test

# Remover volumes específicos
docker volume rm dashboard_order_mysql_dev_data
docker volume rm dashboard_order_mysql_test_data

# Limpeza completa
./scripts/clean-all.sh

# Node modules
rm -rf backend/node_modules frontend/node_modules
rm -rf backend/dist frontend/.next
```

## 📦 Dependências

```bash
# Backend
cd backend
npm install                      # Instalar deps
npm update                       # Atualizar deps
npm audit fix                    # Corrigir vulnerabilidades

# Frontend  
cd frontend
npm install
npm update
npm audit fix
```

## 🔧 Utilitários

```bash
# Code quality
cd backend
npm run lint                     # ESLint
npm run lint:fix                 # Fix automático
npm run format                   # Prettier
npm run build                    # Build TypeScript

# Git hooks (opcional)
npx husky install                # Git hooks
npx husky add .husky/pre-commit "npm run lint"
```

## 🌐 URLs de Desenvolvimento

```bash
# Aplicação
http://localhost:3000            # Frontend
http://localhost:3001            # Backend API
http://localhost:3001/health     # Health check

# Ferramentas
http://localhost:8080            # Adminer (admin banco)
http://localhost:5555            # Prisma Studio (se rodando)

# Banco direto
localhost:3306                   # MySQL dev
localhost:3307                   # MySQL test
```

## 📋 Checklist Diário

### Início do dia
```bash
git pull origin main
./scripts/setup-dev.sh           # Se houver mudanças
npm run test:all                 # Verificar se tudo ok
```

### Durante desenvolvimento
```bash
npm run test:watch               # Em terminal separado
npm run start:dev                # Backend em watch
npm run dev                      # Frontend em watch
```

### Fim do dia / antes do commit
```bash
npm run test:all                 # Todos os testes
npm run lint                     # Verificar code style
npm run build                    # Verificar build
git add . && git commit -m "..."  # Commit das mudanças
```

## 🆘 Resolução de Problemas

### Erro de porta em uso
```bash
# Descobrir processo na porta
lsof -i :3001                   # Backend
lsof -i :3306                   # MySQL dev
lsof -i :3307                   # MySQL test

# Matar processo
kill -9 <PID>

# Ou resetar containers
./scripts/clean-all.sh
```

### Banco de dados corrompido
```bash
# Recriar banco de desenvolvimento
./scripts/clean-all.sh
./scripts/setup-dev.sh

# Recriar banco de teste
./scripts/setup-test.sh
```

### Dependências problemáticas
```bash
# Reset completo node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf backend/package-lock.json
rm -rf frontend/package-lock.json

# Reinstalar
cd backend && npm install
cd frontend && npm install
```

### Docker com problemas
```bash
# Reset completo Docker
docker system prune -a -f
docker volume prune -f
./scripts/setup-dev.sh
```

## 🎯 Aliases Úteis

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
# Aliases para o projeto
alias ddev='./scripts/setup-dev.sh'
alias dtest='./scripts/setup-test.sh'
alias dclean='./scripts/clean-all.sh'
alias dback='cd backend && npm run start:dev'
alias dfront='cd frontend && npm run dev'
alias dtests='cd backend && npm run test:all'
alias dlogs='docker-compose -f docker-compose.dev.yml logs -f'
```

---

**💡 Dica:** Mantenha este arquivo aberto em uma aba para referência rápida durante o desenvolvimento!
