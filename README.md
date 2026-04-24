# 🚀 Dashboard de Ordens de Serviço

Sistema de gerenciamento de ordens de serviço desenvolvido com **Clean Architecture** e preparado para projetos com IA.

## 📋 Stack Tecnológica

- **Backend:** NestJS + TypeScript + Prisma ORM + MySQL
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Containerização:** Docker + Docker Compose + Nginx


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
```

## 🏗️ Arquitetura do Projeto

```
dashboard_order/
├── 🔧 backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/
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
│   │   └── services/         # Serviços de API
├── 🐳 Docker files            # Containerização
├── 📜 scripts/               # Scripts de automação
└── 📚 docs/                  # Documentação
```

---

## 🛠️ Scripts Disponíveis


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

**Backend (`.env`):**
```env
DATABASE_URL="mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db"
TEST_DATABASE_URL="mysql://test_user:test_password@localhost:3307/dashboard_order_test"

NODE_ENV=development
```


