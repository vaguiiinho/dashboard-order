# Dashboard de Ordens de Serviço

Sistema de gerenciamento de ordens de serviço desenvolvido com arquitetura separada entre frontend e backend.

## 📋 Arquitetura

- **Frontend:** Next.js 15 com TypeScript, Tailwind CSS e App Router
- **Backend:** NestJS com TypeScript, Prisma ORM e MySQL
- **Autenticação:** JWT com guards e estratégias Passport
- **Arquitetura:** Clean Architecture com Use Cases e Repositories

## 🚀 Como executar o projeto

### Opção 1: Setup Automático (Recomendado)

```bash
# Executar o script de setup automático
./setup.sh
```

Este script irá:
- Configurar o banco MySQL via Docker
- Instalar dependências
- Executar migrações
- Popular banco com dados iniciais

### Opção 2: Setup Manual

#### Pré-requisitos

- Node.js 20+ 
- MySQL 8+ (ou Docker)
- npm ou yarn

#### 1. Backend (NestJS)

```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
# Certifique-se de que o MySQL está rodando e crie o banco:
# CREATE DATABASE dashboard_order_db;

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco

# Executar migrações do Prisma
npx prisma migrate dev --name init

# Executar seed do banco (criar grupos e usuário admin)
npm run db:seed

# Iniciar o servidor de desenvolvimento
npm run start:dev
```

#### 2. Frontend (Next.js)

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Opção 3: Docker (Produção)

```bash
# Executar toda a aplicação com Docker
docker-compose up -d

# Para parar
docker-compose down
```

## 📍 URLs de Acesso

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **MySQL:** localhost:3306

## 🔐 Credenciais de Teste

Após executar o seed do banco, use estas credenciais para fazer login:

- **Email:** admin@exemplo.com
- **Senha:** admin123

## 📁 Estrutura do Projeto

```
dashboard_order/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Módulo de autenticação
│   │   │   └── usuarios/      # Módulo de usuários
│   │   ├── config/            # Configurações (Prisma, etc.)
│   │   └── common/            # Utilitários compartilhados
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── seed.ts           # Dados iniciais
│   └── package.json
├── frontend/                   # Aplicação Next.js
│   ├── src/
│   │   ├── app/              # App Router do Next.js
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Context API (Auth)
│   │   ├── hooks/            # Hooks customizados
│   │   ├── services/         # Serviços de API
│   │   ├── types/            # Tipos TypeScript
│   │   └── lib/              # Utilitários
│   └── package.json
└── docs/
    └── plan_action.md         # Plano de ação do projeto
```

## 🛠 Funcionalidades Implementadas

### ✅ Concluído

- [x] Configuração inicial do projeto (frontend + backend)
- [x] Backend NestJS com TypeScript
- [x] Configuração Prisma + MySQL
- [x] Módulo de autenticação com JWT
- [x] Módulo de usuários com CRUD
- [x] Clean Architecture (Use Cases + Repositories)
- [x] Frontend Next.js com TypeScript
- [x] Sistema de autenticação no frontend
- [x] Proteção de rotas
- [x] Seed inicial com grupos e usuário admin

### 🔄 Em Desenvolvimento

- [ ] Página de gerenciamento de usuários
- [ ] Dashboards com gráficos interativos
- [ ] Sistema de filtros
- [ ] Dockerização da aplicação
- [ ] Testes unitários e de integração

## 🎯 Próximos Passos

1. **Implementar CRUD de usuários** no frontend
2. **Criar dashboards** com gráficos mockados (Recharts)
3. **Adicionar sistema de filtros** dinâmicos
4. **Dockerizar** a aplicação
5. **Implementar testes** unitários e de integração
6. **Deploy** em ambiente on-premise

## 📊 Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário

### Usuários  
- `GET /usuarios` - Listar usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `POST /usuarios` - Criar usuário
- `PATCH /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Remover usuário

## 🔧 Scripts Disponíveis

### Backend
- `npm run start:dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run db:seed` - Executar seed do banco
- `npm run test` - Executar testes

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Linter ESLint

## 🤝 Contribuição

Este projeto segue o plano de ação documentado em `docs/plan_action.md`. Para contribuir:

1. Consulte o plano de ação
2. Siga a arquitetura Clean estabelecida
3. Mantenha a separação entre frontend e backend
4. Documente alterações importantes

## 📝 Licença

Este projeto é privado e destinado ao aprendizado e desenvolvimento.
