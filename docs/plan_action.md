# Plano de Ação: Aplicação de Gerenciamento de Ordens de Serviço

O plano de ação será dividido em fases, garantindo um desenvolvimento progressivo, escalável e bem estruturado.

---

## Fase 1: Preparação e Arquitetura Inicial

### Definição da Arquitetura
- A arquitetura será **separada em dois projetos**:
  - **Frontend:** Aplicação **Next.js** para interface do usuário, ultilizar a estrutura nova de rotas do Next.js.
  - **Backend:** API **NestJS** para autenticação de usuario.
- Comunicação entre frontend e backend será feita via **HTTP REST**.

### Configuração dos Projetos

#### Frontend (Next.js + TypeScript)
- Criação do projeto com `create-next-app` utilizando TypeScript.
- Estruturação da aplicação com páginas e componentes reutilizáveis.
- Configuração de variáveis de ambiente para a URL da API (NestJS).

#### Backend (NestJS + Prisma)
- Criação do projeto NestJS com `@nestjs/cli`.
- Instalação e configuração do **Prisma** com **MySQL**.
- **Arquitetura Interna (Clean Architecture):** A estrutura interna dos módulos seguirá os princípios da Clean Architecture, separando as responsabilidades:
  - **Use Cases:** Classes que contêm a lógica de negócio pura e específica de uma funcionalidade (ex: `CriarUsuarioUseCase`). Elas orquestram o fluxo de dados e não conhecem detalhes de HTTP ou do framework.
  - **Repositories:** Camada de abstração para acesso a dados. Os repositórios definirão interfaces para operações de banco de dados (ex: `findUserByEmail`), e suas implementações utilizarão o Prisma.
- Criação de módulos para:
  - Autenticação
  - Usuários

#### Schema do Banco de Dados (Prisma)
- Definição inicial dos modelos de dados no arquivo `schema.prisma`.

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  senha     String
  grupoId   Int
  grupo     Grupo    @relation(fields: [grupoId], references: [id])
}

model Grupo {
  id        Int       @id @default(autoincrement())
  nome      String    @unique // Ex: "gerente", "supervisor", "colaborador"
  usuarios  Usuario[]
}
```

#### Repositório e Versionamento
- Criação de repositórios no **GitHub** (um para frontend, outro para backend ou monorepo com Nx opcional).
- Definição de branches (main/dev) e estratégia de versionamento.

---

## Fase 2: Integração e Funcionalidades Principais


### Autenticação e Autorização
- Backend (NestJS):
  - Autenticação com **JWT**.
  - Criação de endpoint `/auth/login` para validar credenciais (email e senha) contra o banco de dados.
  - Criação de Guards e Roles para níveis de acesso (gerente, supervisor, etc.).
- Frontend (Next.js):
  - Implementação de fluxo de login.
  - Armazenamento do token (cookies seguros ou localStorage).
  - Proteção de rotas com verificação de autenticação.

### Visualização com Dashboards (Frontend - Next.js)
- Criação de painéis com **gráficos interativos**.
- Criação de um painel para crição, edição e lista de usuarios.
- Integração com bibliotecas como `Recharts`, `Chart.js` ou `ApexCharts`.
- Consumo de dados do backend via chamadas HTTP (axios ou fetch).
- **Nota:** Inicialmente, os dados para os gráficos (Ordens de Serviço) serão **mockados** no frontend para permitir o desenvolvimento da UI sem depender da API externa.
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

### Testes (Backend - NestJS)
- **Testes Unitários:**
  - Utilização do **Jest** (padrão do NestJS).
  - Foco em testar a lógica de negócio nos **Use Cases** de forma isolada, utilizando mocks para dependências (ex: **Repositories**).
  - Meta de garantir que cada unidade de código funcione como esperado.
- **Testes de Integração:**
  - Utilização do **Jest** e **Supertest**.
  - Foco em testar os `Controllers` e a interação entre as camadas (Controller -> Use Case -> Repository).
  - Execução contra um banco de dados de teste para validar o fluxo completo de uma requisição HTTP, incluindo a persistência de dados.
