# 🔧 Guia de Configuração de Ambiente

## Arquivos .env necessários

### 1. Arquivo `.env` na raiz do projeto (opcional)

```bash
# Docker Compose Environment Variables
HTTP_PORT=80
HTTPS_PORT=443
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=dashboard_order_db
FRONTEND_URL=*
```

### 2. Arquivo `backend/.env`

```bash
# Database Configuration
# IMPORTANTE: Use 'mysql' como host (nome do serviço Docker)
DATABASE_URL="mysql://root:rootpassword@mysql:3306/dashboard_order_db"

# Application Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=*

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:** 
- O host do `DATABASE_URL` deve ser `mysql` (nome do serviço no docker-compose)
- Não use `localhost` quando rodando dentro do Docker

### 3. Arquivo `frontend/.env.local`

```bash
# API Configuration
# IMPORTANTE: Deixe vazio para usar Nginx como proxy
# O frontend vai fazer requisições relativas que o Nginx vai rotear para o backend
NEXT_PUBLIC_API_URL=

# Application Configuration
NEXT_PUBLIC_APP_NAME=Dashboard de Ordens de Serviço
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**⚠️ IMPORTANTE:**
- Deixe `NEXT_PUBLIC_API_URL` vazio para produção com Docker
- O Nginx vai rotear as requisições `/auth`, `/usuarios`, etc. para o backend
- O frontend faz requisições relativas (ex: `/auth/login`) que o Nginx redireciona

## Como criar os arquivos

```bash
# 1. Criar .env na raiz (opcional, tem valores padrão)
cp .env.example .env

# 2. Criar backend/.env
cd backend
cp env.example .env
# Edite o .env e certifique-se de usar 'mysql' como host

# 3. Criar frontend/.env.local
cd ../frontend
cp env.example .env.local
# Deixe NEXT_PUBLIC_API_URL vazio
```

## Nomes dos Serviços Docker

Dentro da rede Docker, os serviços são acessíveis pelos seguintes nomes:

- `mysql` - Banco de dados MySQL (porta 3306)
- `backend` - API NestJS (porta 3001)
- `frontend` - Aplicação Next.js (porta 3000)
- `nginx` - Reverse Proxy (porta 80/443)

## Fluxo de Requisições

1. **Cliente** → `nginx:80` (pública)
2. **Nginx** → `frontend:3000` ou `backend:3001` (rede interna)
3. **Backend** → `mysql:3306` (rede interna)

## Verificação

```bash
# Verificar se os arquivos .env existem
ls -la backend/.env frontend/.env.local

# Verificar variáveis de ambiente nos containers
docker compose exec backend env | grep DATABASE_URL
docker compose exec frontend env | grep NEXT_PUBLIC_API_URL

# Testar conectividade entre serviços
docker compose exec nginx ping backend
docker compose exec nginx ping frontend
docker compose exec backend ping mysql
```

