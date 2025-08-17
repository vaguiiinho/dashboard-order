# 🚀 Ambiente de Desenvolvimento - Dashboard de Ordens de Serviço

Este documento explica como configurar e usar o ambiente de desenvolvimento.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ instalado
- npm ou yarn instalado

## 🐳 Configuração Rápida

### 1. Iniciar o Ambiente de Desenvolvimento

```bash
# Iniciar apenas o MySQL
./dev.sh start

# Verificar status
./dev.sh status

# Ver logs do MySQL
./dev.sh logs mysql
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar configurações de ambiente
cp env.example .env

# IMPORTANTE: Para evitar problemas com Prisma shadow database, use o usuário root para migrações
./switch-env.sh root

# Executar migrações do Prisma
npx prisma migrate dev --name init

# Voltar para usuário dashboard_user para desenvolvimento
./switch-env.sh user

# Executar seed do banco (opcional)
npm run db:seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
./frontend-setup.sh dev

# Iniciar em modo desenvolvimento
npm run dev
```

## 🔧 Comandos do Script de Desenvolvimento

```bash
./dev.sh start      # Iniciar ambiente (MySQL)
./dev.sh stop       # Parar ambiente
./dev.sh restart    # Reiniciar ambiente
./dev.sh status     # Ver status dos containers
./dev.sh logs mysql # Ver logs do MySQL
./dev.sh reset-db   # Resetar banco de dados
./dev.sh help       # Ver ajuda
```

## 🔄 Script de Troca de Ambiente

```bash
./switch-env.sh root    # Usar usuário ROOT (para migrações Prisma)
./switch-env.sh user    # Usar usuário DASHBOARD_USER (para desenvolvimento)
./switch-env.sh current # Ver configuração atual
./switch-env.sh help    # Ver ajuda
```

## 🎨 Script de Configuração do Frontend

```bash
./frontend-setup.sh dev     # Configurar ambiente de desenvolvimento
./frontend-setup.sh prod    # Configurar ambiente de produção
./frontend-setup.sh current # Ver configuração atual
./frontend-setup.sh reset   # Remover arquivo .env.local
./frontend-setup.sh help    # Ver ajuda
```

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **MySQL:** localhost:3306

## 🗄️ Configuração do Banco de Dados

### Credenciais MySQL
- **Host:** localhost
- **Porta:** 3306
- **Database:** dashboard_order_db
- **Usuário:** dashboard_user
- **Senha:** dashboard_password
- **Root Password:** rootpassword

### Conexão String
```
mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db
```

## 🔄 Hot Reload

- **Backend:** Alterações no código são refletidas automaticamente
- **Frontend:** Alterações no código são refletidas automaticamente
- **Banco:** Dados persistem entre reinicializações do container

## 🛠️ Desenvolvimento

### Estrutura de Arquivos
```
dashboard_order/
├── docker-compose.dev.yml    # Docker Compose para desenvolvimento
├── dev.sh                    # Script de gerenciamento do ambiente
├── backend/                  # API NestJS
├── frontend/                 # Aplicação Next.js
└── mysql/                    # Scripts de inicialização do MySQL
    └── init/
        └── 01-init.sql      # Script SQL de inicialização
```

### Variáveis de Ambiente

O arquivo `backend/.env` deve conter:

**Opção 1: Usuário dashboard_user (para aplicação)**
```env
DATABASE_URL="mysql://dashboard_user:dashboard_password@localhost:3306/dashboard_order_db"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
IXC_API_URL=https://crm.tubaron.net/webservice/v1
IXC_TOKEN=your-token
```

**Opção 2: Usuário root (para migrações Prisma)**
```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/dashboard_order_db"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
IXC_API_URL=https://crm.tubaron.net/webservice/v1
IXC_TOKEN=your-token
```

**💡 Recomendação:** Use o usuário root para executar migrações e depois mude para dashboard_user para desenvolvimento.

## 🌐 Variáveis de Ambiente do Frontend

O frontend usa as seguintes variáveis de ambiente (prefixadas com `NEXT_PUBLIC_`):

### **Configuração da API**
- `NEXT_PUBLIC_API_URL`: URL do backend (ex: http://localhost:3001)
- `NEXT_PUBLIC_IXC_API_URL`: URL da API do IXC CRM
- `NEXT_PUBLIC_IXC_TOKEN`: Token de autenticação do IXC CRM

### **Configuração da Aplicação**
- `NEXT_PUBLIC_APP_NAME`: Nome da aplicação
- `NEXT_PUBLIC_DEBUG_MODE`: Habilita/desabilita modo debug
- `NEXT_PUBLIC_LOG_LEVEL`: Nível de log (debug, info, warn, error)

### **Arquivos de Configuração**
- `frontend/env.example`: Configurações de exemplo
- `frontend/env.local`: Configurações de desenvolvimento
- `frontend/env.production`: Configurações de produção
- `frontend/.env.local`: Arquivo real usado pela aplicação (ignorado pelo git)

## 🐛 Troubleshooting

### Erro de Prisma Shadow Database
Se você encontrar o erro `P3014: Prisma Migrate could not create the shadow database`, use:

```bash
# Usar o arquivo env.dev que usa o usuário root
cp env.dev .env

# Ou manualmente, edite o .env para usar root:
DATABASE_URL="mysql://root:rootpassword@localhost:3306/dashboard_order_db"

# Depois execute as migrações
npx prisma migrate dev --name init
```

### MySQL não inicia
```bash
# Ver logs
./dev.sh logs mysql

# Resetar banco
./dev.sh reset-db
```

### Problemas de conexão
- Verifique se o MySQL está rodando: `./dev.sh status`
- Verifique se a porta 3306 não está sendo usada por outro processo
- Verifique as credenciais no arquivo `.env`

### Resetar ambiente completo
```bash
./dev.sh stop
./dev.sh reset-db
./dev.sh start
```

## 📝 Notas Importantes

1. **Desenvolvimento Local:** Backend e Frontend rodam localmente, apenas o MySQL roda no Docker
2. **Persistência:** Os dados do MySQL são mantidos entre reinicializações
3. **Portas:** Certifique-se de que as portas 3000, 3001 e 3306 estejam livres
4. **Hot Reload:** Funciona para desenvolvimento local, não para containers Docker

## 🚀 Próximos Passos

Após configurar o ambiente:

1. Execute as migrações do Prisma
2. Configure as variáveis de ambiente específicas do seu projeto
3. Execute o seed do banco se necessário
4. Inicie o desenvolvimento!

---

**💡 Dica:** Use `./dev.sh help` para ver todos os comandos disponíveis.
