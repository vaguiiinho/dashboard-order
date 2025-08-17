# Guia de Testes - Módulo de Usuários

## 🧪 Visão Geral dos Testes

Este projeto inclui uma cobertura completa de testes para o módulo de usuários, seguindo as melhores práticas de testing:

- **Testes Unitários**: Para entities e use cases
- **Testes de Integração**: Para repositories
- **Testes E2E**: Para endpoints HTTP
- **Mocks**: Para isolamento de dependências

## 📁 Estrutura dos Testes

```
backend/
├── src/
│   └── modules/
│       └── usuarios/
│           ├── entities/
│           │   ├── usuario.entity.spec.ts      # Testes unitários da entidade
│           │   └── grupo.entity.spec.ts        # Testes unitários da entidade
│           ├── use-cases/
│           │   ├── criar-usuario.use-case.spec.ts  # Testes unitários com mocks
│           │   └── criar-grupo.use-case.spec.ts    # Testes unitários com mocks
│           └── repositories/
│               └── usuario.repository.spec.ts  # Testes de integração
├── test/
│   ├── usuarios.e2e-spec.ts                   # Testes e2e dos endpoints
│   ├── jest-e2e.json                          # Configuração Jest e2e
│   └── setup.ts                               # Setup global dos testes
├── jest.config.js                             # Configuração Jest principal
└── package.json                               # Scripts de teste
```

## 🚀 Como Executar os Testes

### 1. **Todos os Testes**
```bash
npm test
```

### 2. **Testes Unitários (Entities e Use Cases)**
```bash
npm run test:unit
```

### 3. **Testes de Integração (Repositories)**
```bash
npm run test:integration
```

### 4. **Testes Específicos por Categoria**
```bash
# Apenas entities
npm run test:entities

# Apenas use cases
npm run test:usecases

# Apenas repositories
npm run test:repositories
```

### 5. **Testes E2E (Endpoints)**
```bash
npm run test:e2e
```

### 6. **Testes com Coverage**
```bash
npm run test:cov
```

### 7. **Testes em Modo Watch**
```bash
npm run test:watch
```

## 🎯 Tipos de Teste

### **Testes Unitários (Entities)**

#### Usuario Entity
- ✅ Criação com parâmetros válidos
- ✅ Validações de email, senha e grupo
- ✅ Setters com validação
- ✅ Métodos de negócio (alterarSenha, alterarGrupo, etc.)
- ✅ Serialização para JSON
- ✅ Criação a partir de dados

#### Grupo Entity
- ✅ Criação com parâmetros válidos
- ✅ Validações de nome
- ✅ Gerenciamento de usuários
- ✅ Ativação/desativação
- ✅ Serialização para JSON

### **Testes Unitários (Use Cases)**

#### CriarUsuarioUseCase
- ✅ Criação bem-sucedida
- ✅ Validação de email duplicado
- ✅ Validação de grupo inexistente
- ✅ Tratamento de erros do repositório
- ✅ Preservação de exceções específicas

#### CriarGrupoUseCase
- ✅ Criação bem-sucedida
- ✅ Validação de nome duplicado
- ✅ Tratamento de erros do repositório
- ✅ Validações de entrada

### **Testes de Integração (Repositories)**

#### UsuarioRepository
- ✅ Operações CRUD para usuários
- ✅ Operações CRUD para grupos
- ✅ Relacionamentos entre entidades
- ✅ Tratamento de constraints do banco
- ✅ Tratamento de erros de conexão

### **Testes E2E (Endpoints)**

#### POST /usuarios
- ✅ Criação bem-sucedida
- ✅ Validações de entrada
- ✅ Tratamento de campos obrigatórios
- ✅ Validação de formato de email
- ✅ Validação de tamanho de senha
- ✅ Validação de grupo existente
- ✅ Prevenção de email duplicado

#### GET /usuarios
- ✅ Listagem de usuários
- ✅ Informações de grupo incluídas
- ✅ Senhas não expostas

#### GET /usuarios/:id
- ✅ Busca por ID
- ✅ Tratamento de usuário inexistente
- ✅ Validação de formato de ID

## 🔧 Configuração dos Testes

### **Jest Principal (jest.config.js)**
- Root directory: `src/`
- Coverage mínimo: 80%
- Timeout: 30 segundos
- Transformação TypeScript

### **Jest E2E (test/jest-e2e.json)**
- Root directory: `.`
- Padrão: `.e2e-spec.ts`
- Timeout: 30 segundos
- Setup global

### **Setup Global (test/setup.ts)**
- Configuração de ambiente de teste
- Mock de console
- Timeout global

## 📊 Cobertura de Testes

### **Métricas de Cobertura**
- **Branches**: 80% mínimo
- **Functions**: 80% mínimo
- **Lines**: 80% mínimo
- **Statements**: 80% mínimo

### **Relatórios de Cobertura**
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`
- **Texto**: Console output

## 🐛 Debugging dos Testes

### **Teste Individual**
```bash
npm run test:debug
```

### **Teste Específico**
```bash
npm test -- --testNamePattern="should create a usuario successfully"
```

### **Teste com Logs**
```bash
npm test -- --verbose
```

## 🚨 Troubleshooting

### **Problemas Comuns**

#### 1. **Timeout nos Testes**
- Verificar conexão com banco de dados
- Aumentar timeout no jest.config.js
- Verificar se o banco está rodando

#### 2. **Erros de Conexão**
- Verificar variáveis de ambiente
- Verificar se o Prisma está configurado
- Verificar se o banco está acessível

#### 3. **Falhas de Validação**
- Verificar se as entidades estão sendo criadas corretamente
- Verificar se os DTOs estão validando
- Verificar se as regras de negócio estão funcionando

### **Soluções**

#### **Reset do Banco de Teste**
```bash
# Limpar dados de teste
npx prisma migrate reset --force

# Executar seed se necessário
npm run db:seed
```

#### **Verificar Configuração**
```bash
# Verificar se o Jest está configurado
npx jest --showConfig

# Verificar se o TypeScript está compilando
npx tsc --noEmit
```

## 📈 Melhorias Futuras

### **Testes Pendentes**
- [ ] Testes para outros use cases (atualizar, deletar)
- [ ] Testes de performance
- [ ] Testes de stress
- [ ] Testes de segurança

### **Ferramentas Adicionais**
- [ ] TestContainers para banco de dados
- [ ] Faker.js para dados de teste
- [ ] Test coverage badges
- [ ] Integração com CI/CD

---

**Todos os testes devem passar para garantir a qualidade do código! 🚀**
