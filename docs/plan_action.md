# Plano de Ação: Aplicação de Gerenciamento de Ordens de Serviço

O plano de ação será dividido em fases, garantindo um desenvolvimento progressivo, escalável e bem estruturado.

---

## Fase 1: Preparação e Arquitetura Inicial

### Definição da Arquitetura
- A arquitetura será **separada em dois projetos**:
  - **Frontend:** Aplicação **Next.js** para interface do usuário.
  - **Backend:** API **NestJS** para lógica de negócios e comunicação com banco/API externa.
- Comunicação entre frontend e backend será feita via **HTTP REST**.

### Configuração dos Projetos

#### Frontend (Next.js + TypeScript)
- Criação do projeto com `create-next-app` utilizando TypeScript.
- Estruturação da aplicação com páginas e componentes reutilizáveis.
- Configuração de variáveis de ambiente para a URL da API (NestJS).

#### Backend (NestJS + TypeORM)
- Criação do projeto NestJS com `@nestjs/cli`.
- Instalação e configuração do **TypeORM** com **MySQL**.
- Criação de módulos para:
  - Autenticação
  - Usuários
  - Dashboards
  - Ordens de Serviço

#### Repositório e Versionamento
- Criação de repositórios no **GitHub** (um para frontend, outro para backend ou monorepo com Nx opcional).
- Definição de branches (main/dev) e estratégia de versionamento.

---

## Fase 2: Integração e Funcionalidades Principais

### Conexão com API Externa (No Backend - NestJS)
- Criação de um **serviço HTTP** no NestJS para consumir a API externa.
- Definição de DTOs e interfaces para garantir tipagem dos dados.
- Armazenamento ou cache local (Redis ou banco) se necessário.

### Autenticação e Autorização
- Backend (NestJS):
  - Autenticação com **JWT**.
  - Integração com a API externa para validar usuários.
  - Criação de Guards e Roles para níveis de acesso (gerente, supervisor, etc.).
- Frontend (Next.js):
  - Implementação de fluxo de login.
  - Armazenamento do token (cookies seguros ou localStorage).
  - Proteção de rotas com verificação de autenticação.

### Visualização com Dashboards (Frontend - Next.js)
- Criação de painéis com **gráficos interativos**.
- Integração com bibliotecas como `Recharts`, `Chart.js` ou `ApexCharts`.
- Consumo de dados do backend via chamadas HTTP (axios ou fetch).
- Tipos de gráficos:
  - Por assunto
  - Por setor
  - Por colaborador
  - Por cidade
  - Por estrutura

### Sistema de Filtros
- Backend:
  - Criação de endpoints com suporte a filtros por parâmetros de query.
- Frontend:
  - Interface com campos de seleção (dropdowns, checkboxes etc.)
  - Atualização dos gráficos de forma dinâmica com base nos filtros aplicados.

---

## Fase 3: Dockerização, Deploy e Testes

### Dockerização da Aplicação
- **Frontend (Next.js):**
  - Criação de um `Dockerfile` para build e execução da aplicação.
- **Backend (NestJS):**
  - Criação de `Dockerfile` para API com Node.js.
  - Configuração de variáveis de ambiente para conexão com banco e APIs.
- **Infraestrutura:**
  - `docker-compose.yml` com serviços:
    - frontend
    - backend
    - banco de dados (MySQL)
    - opcional: Redis

### Deploy em Ambiente On-Premise
- Instalação do Docker e Docker Compose no servidor on-premise.
- Deploy com:
  ```bash
  docker-compose up -d
