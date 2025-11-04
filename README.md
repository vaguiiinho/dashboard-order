# 🚀 Dashboard de Ordens de Serviço

Sistema de gerenciamento de ordens de serviço desenvolvido com **Clean Architecture** e preparado para projetos com IA.

## 📋 Stack Tecnológica

- **Backend:** NestJS + TypeScript + Prisma ORM + MySQL
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Autenticação:** JWT com guards Passport
- **Testes:** Jest + Supertest + Integration Tests
- **Containerização:** Docker + Docker Compose + Nginx
- **Arquitetura:** Clean Architecture (Use Cases + Repositories)

---

## 🚀 Deploy em Produção

### Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo (recomendado: 8GB)
- 40GB espaço em disco

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone <repository-url>
cd dashboard-order

# 2. Configure as variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações

# 3. Inicie os serviços
docker-compose up -d --build

# 4. Verifique os logs
docker-compose logs -f

# 5. Acesse a aplicação
# Frontend: http://localhost (ou IP do servidor)
# Healthcheck: http://localhost/health
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=senha_segura_aqui
MYSQL_DATABASE=dashboard_order_db

# JWT Configuration
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d

# Application URLs
FRONTEND_URL=http://localhost
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=Dashboard de Ordens de Serviço

# Ports (opcional)
HTTP_PORT=80
HTTPS_PORT=443
```

### Comandos Úteis

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f [servico]  # backend, frontend, mysql, nginx

# Reiniciar um serviço
docker-compose restart [servico]

# Rebuild após mudanças
docker-compose up -d --build

# Backup do banco de dados
docker-compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < backup.sql

# Acessar shell do container
docker-compose exec backend sh
docker-compose exec mysql mysql -u root -p
```

### Estrutura dos Serviços

- **Nginx (Porta 80)**: Reverse proxy, expõe frontend e backend
- **Frontend (Interno: 3000)**: Aplicação Next.js
- **Backend (Interno: 3001)**: API NestJS
- **MySQL (Porta 3306)**: Banco de dados (não exposto publicamente)

### Monitoramento

```bash
# Healthcheck
curl http://localhost/health

# Status dos containers
docker-compose ps

# Uso de recursos
docker stats
```

### Testar Localmente

Para testar o ambiente de produção localmente:

```bash
# 1. Configure o .env
cp .env.example .env

# 2. Inicie os serviços
docker-compose up -d --build

# 3. Acompanhe os logs
docker-compose logs -f

# 4. Acesse
# http://localhost (frontend)
# http://localhost/health (healthcheck)
# http://localhost/auth/login (api)
```

---

## 🎯 Desenvolvimento Local

### Setup Manual

```bash
# Backend
cd backend
npm install
cp env.example .env
npm run start:dev    # Porta 3001

# Frontend
cd frontend
npm install
cp env.example .env.local
npm run dev         # Porta 3000
```

### Testes

```bash
# Configurar ambiente de testes
chmod +x scripts/setup-test.sh
./scripts/setup-test.sh

# Executar testes
cd backend
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
npm run test:all         # Todos os testes
```

---

## 🏗️ Arquitetura do Projeto

```
dashboard_order/
├── 🔧 backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # 🔐 Autenticação JWT
│   │   │   └── usuarios/      # 👤 Módulo de Usuários (CRUD completo)
│   │   │       ├── controllers/     # HTTP endpoints
│   │   │       ├── use-cases/       # Lógica de negócio
│   │   │       ├── repositories/    # Acesso a dados
│   │   │       ├── entities/        # Entidades de domínio
│   │   │       └── dto/             # Data Transfer Objects
│   │   ├── config/            # Configurações (Prisma, etc.)
│   │   └── common/            # Utilitários compartilhados
│   ├── test/                  # 🧪 Configurações de teste
│   └── prisma/               # 📊 Schema e migrations
├── 🌐 frontend/                # App Next.js
│   ├── src/
│   │   ├── app/              # App Router do Next.js
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Context API (Auth)
│   │   └── services/         # Serviços de API
├── 🐳 Docker files            # Containerização
├── 📜 scripts/               # Scripts de automação
└── 📚 docs/                  # Documentação
```

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
./scripts/setup-dev.sh    # Configuração completa de desenvolvimento
./scripts/setup-test.sh   # Configuração de ambiente de testes
./scripts/clean-all.sh    # Limpeza completa (containers, volumes, dados)
```

### Backend
```bash
npm run start:dev         # Servidor de desenvolvimento
npm run test:unit         # Testes unitários
npm run test:integration  # Testes de integração
npm run test:all          # Todos os testes
npm run db:seed           # Popular banco com dados iniciais
```

### Docker
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d mysql-dev    # Banco dev
docker-compose -f docker-compose.dev.yml up -d mysql-test   # Banco teste
docker-compose -f docker-compose.dev.yml up -d adminer     # Interface admin

# Produção
docker-compose up -d      # Stack completa (frontend + backend + banco)
```

---

## 🔐 Configuração

### Variáveis de Ambiente

**Backend (`backend/env.template` → `backend/.env`):**
```env
DATABASE_URL="mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db"
TEST_DATABASE_URL="mysql://test_user:test_password@localhost:3307/dashboard_order_test"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV=development
```

### Credenciais Padrão
- **Email:** admin@exemplo.com
- **Senha:** admin123

---

## 🧪 Estratégia de Testes

### Tipos de Testes

1. **🔬 Testes Unitários** (`*.spec.ts`)
   - Use Cases isolados com mocks
   - Entidades de domínio
   - Validações e regras de negócio

2. **🔗 Testes de Integração** (`*.integration.spec.ts`)
   - Repositories com banco real
   - Fluxos completos de dados
   - Constraints e relacionamentos

3. **🌐 Testes E2E** (`*.e2e-spec.ts`)
   - APIs completas
   - Fluxos de usuário
   - Autenticação

### Cobertura Atual
```
✅ Entities: 100% (42/42 testes)
✅ Use Cases: 100% (79/79 testes)  
✅ Repositories: 100% (40+ testes integração)
📊 Coverage: 80%+ statements, branches, functions
```

---

## 🌐 Endpoints API

### Autenticação
```http
POST /auth/login           # Login JWT
```

### Usuários (CRUD Completo)
```http
GET    /usuarios           # Listar usuários
GET    /usuarios/:id       # Buscar por ID
POST   /usuarios           # Criar usuário
PATCH  /usuarios/:id       # Atualizar usuário
DELETE /usuarios/:id       # Remover usuário
```

**Headers obrigatórios:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🎯 Template para Projetos IA

Esta estrutura foi otimizada para desenvolvimento assistido por IA:

### ✅ Características
- **Clean Architecture** bem definida
- **Separação clara** de responsabilidades
- **Testes abrangentes** e automáticos
- **Docker** para consistência de ambiente
- **Scripts automatizados** para setup
- **Documentação consolidada**
- **Padrões consistentes** de código

### 🚀 Para Novos Projetos
1. Clone este template
2. Execute `./scripts/setup-dev.sh`
3. Adapte os módulos existentes
4. Use a estrutura de `usuarios/` como referência
5. Mantenha os padrões de testes

### 🤖 Prompts Recomendados para IA
```
"Crie um módulo seguindo a estrutura do módulo usuarios, incluindo:
- Controller com CRUD completo
- Use cases com validações
- Repository com interface
- Entidades de domínio
- DTOs de entrada e saída
- Testes unitários e de integração"
```

---

## 📚 Recursos Adicionais

### Documentação Técnica
- [Prisma Schema](./backend/prisma/schema.prisma)
- [Plano de Ação](./docs/plan_action.md)
- [Integração IXC](./INTEGRACAO_IXC.md)

### Ferramentas de Debug
- **Adminer:** http://localhost:8080 (administração do banco)
- **API Testing:** Use arquivo [api.http](./api.http)

### Monitoramento
- **Backend:** http://localhost:3001/health (health check)
- **Logs:** `docker-compose logs -f backend`

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Execute os testes: `npm run test:all`
4. Faça commit das mudanças
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

**🎉 Projeto pronto para desenvolvimento e facilmente adaptável para novos projetos com IA!**