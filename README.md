# Dashboard de Ordens de Serviço

Sistema completo para gerenciamento de ordens de serviço com dashboards interativos e integração com APIs externas.

## 🏗️ Arquitetura

- **Frontend**: Next.js 14 + TypeScript + Recharts
- **Backend**: NestJS + TypeORM + MySQL
- **Database**: MySQL 8.0
- **Proxy**: Nginx (produção)
- **Cache**: Redis (opcional)
- **Containerização**: Docker + Docker Compose

## 📁 Estrutura do Projeto

```
dashboard_order/
├── frontend/              # Aplicação Next.js
│   ├── Dockerfile
│   └── package.json
├── backend/               # API NestJS
│   ├── Dockerfile
│   └── package.json
├── database/              # Configurações do banco
│   └── init/             # Scripts de inicialização
├── nginx/                 # Configurações do Nginx
│   ├── nginx.conf
│   └── conf.d/
├── scripts/               # Scripts de automação
│   ├── start-dev.sh      # Iniciar desenvolvimento
│   ├── stop-dev.sh       # Parar desenvolvimento
│   ├── start-prod.sh     # Iniciar produção
│   ├── stop-prod.sh      # Parar produção
│   └── backup-db.sh      # Backup do banco
├── docker-compose.dev.yml # Docker Compose desenvolvimento
├── docker-compose.prod.yml # Docker Compose produção
└── env.example           # Exemplo de variáveis de ambiente
```

## 🚀 Início Rápido

### Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Desenvolvimento

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd dashboard_order
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Inicie o ambiente de desenvolvimento**:
   ```bash
   ./scripts/start-dev.sh
   ```

4. **Acesse as aplicações**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - phpMyAdmin: http://localhost:8080
   - MySQL: localhost:3306

### Produção

1. **Configure as variáveis de ambiente**:
   ```bash
   cp env.example .env
   # IMPORTANTE: Altere todas as senhas padrão!
   nano .env
   ```

2. **Inicie o ambiente de produção**:
   ```bash
   ./scripts/start-prod.sh
   ```

3. **Acesse a aplicação**:
   - Aplicação: http://localhost
   - Health Check: http://localhost/health

## ⚙️ Configuração

### Variáveis de Ambiente

Principais variáveis no arquivo `.env`:

```bash
# Database
MYSQL_ROOT_PASSWORD=sua-senha-root-segura
MYSQL_DATABASE=dashboard_orders
MYSQL_USER=dashboard_user
MYSQL_PASSWORD=sua-senha-usuario-segura

# Backend
JWT_SECRET=sua-chave-jwt-super-secreta-min-32-chars
EXTERNAL_API_URL=https://api.servico-externo.com

# Frontend
NEXT_PUBLIC_API_URL=http://localhost/api

# Redis (opcional)
REDIS_PASSWORD=sua-senha-redis-segura
```

### Usuário Padrão

- **Email**: admin@dashboard.com
- **Senha**: admin123
- **Role**: admin

> ⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro login!

## 🐳 Docker

### Imagens Disponíveis

O projeto utiliza builds multi-stage para otimização:

#### Frontend
- **development**: Imagem para desenvolvimento com hot reload
- **production**: Imagem otimizada para produção

#### Backend
- **development**: Imagem para desenvolvimento com watch mode
- **production**: Imagem otimizada para produção

### Comandos Docker Úteis

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Reconstruir containers
docker-compose -f docker-compose.dev.yml up --build

# Limpar volumes (apaga dados)
docker-compose -f docker-compose.dev.yml down -v

# Executar comandos no container
docker-compose -f docker-compose.dev.yml exec backend npm run migration:run
```

## 📊 Funcionalidades

### Dashboards
- Gráficos por assunto
- Gráficos por setor
- Gráficos por colaborador
- Gráficos por cidade
- Gráficos por estrutura
- Filtros dinâmicos

### Sistema de Ordens
- CRUD completo de ordens de serviço
- Status tracking
- Anexos de arquivos
- Comentários e histórico
- Integração com API externa

### Autenticação
- Login JWT
- Controle de roles (admin, manager, supervisor, user)
- Proteção de rotas
- Sessão persistente

## 🔒 Segurança

### Nginx (Produção)
- Rate limiting
- Headers de segurança
- Compressão GZIP
- Cache de assets estáticos

### Backend
- Validação de entrada
- Sanitização de dados
- JWT com refresh tokens
- CORS configurado

### Database
- Usuário não-root
- Senhas seguras
- Backup automatizado
- Índices otimizados

## 🔧 Manutenção

### Backup do Banco

```bash
# Backup manual
./scripts/backup-db.sh

# Os backups são salvos em: ./database/backup/
```

### Monitoramento

```bash
# Status dos containers
docker-compose -f docker-compose.prod.yml ps

# Health check
curl http://localhost/health

# Logs de erro
docker-compose -f docker-compose.prod.yml logs nginx
```

### Atualizações

```bash
# Parar aplicação
./scripts/stop-prod.sh

# Fazer backup
./scripts/backup-db.sh

# Atualizar código
git pull

# Reconstruir e iniciar
./scripts/start-prod.sh
```

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco**:
   - Verifique se o MySQL está rodando
   - Confirme as credenciais no `.env`

2. **Frontend não carrega**:
   - Verifique os logs: `docker-compose logs frontend`
   - Confirme se o backend está respondendo

3. **Erro 502 Bad Gateway**:
   - Verifique se os containers backend/frontend estão rodando
   - Verifique os logs do Nginx

### Debug

```bash
# Logs detalhados
docker-compose -f docker-compose.dev.yml logs -f --tail=100

# Entrar no container para debug
docker-compose -f docker-compose.dev.yml exec backend bash
docker-compose -f docker-compose.dev.yml exec frontend sh

# Verificar recursos do sistema
docker stats
```

## 📝 Desenvolvimento

### Estrutura do Frontend (Next.js)

```
frontend/src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── services/         # Serviços de API
├── hooks/            # Custom hooks
├── utils/            # Utilitários
└── styles/           # Estilos globais
```

### Estrutura do Backend (NestJS)

```
backend/src/
├── auth/             # Módulo de autenticação
├── users/            # Módulo de usuários
├── orders/           # Módulo de ordens
├── dashboard/        # Módulo de dashboard
├── common/           # Utilitários comuns
└── main.ts           # Entry point
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação técnica em `/docs`
- Contate a equipe de desenvolvimento
