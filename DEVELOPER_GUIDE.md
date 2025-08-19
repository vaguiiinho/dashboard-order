# 🧑‍💻 Guia do Desenvolvedor

Guia prático para desenvolvimento com este template, otimizado para projetos assistidos por IA.

## 🚀 Setup Inicial (1 minuto)

```bash
# 1. Clone e entre no diretório
git clone <repo>
cd dashboard_order

# 2. Execute o setup automático
./scripts/setup-dev.sh

# 3. Pronto! Serviços rodando:
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Adminer:  http://localhost:8080
```

## 🏗️ Criando um Novo Módulo

Use o módulo `usuarios` como template. Estrutura padrão:

```typescript
src/modules/seu-modulo/
├── controllers/
│   ├── seu-modulo.controller.ts      # Endpoints HTTP
│   └── seu-modulo.controller.spec.ts # Testes do controller
├── use-cases/
│   ├── criar-item.use-case.ts        # Lógica de negócio
│   ├── criar-item.use-case.spec.ts   # Testes unitários
│   ├── listar-itens.use-case.ts
│   ├── buscar-item-por-id.use-case.ts
│   ├── atualizar-item.use-case.ts
│   └── remover-item.use-case.ts
├── repositories/
│   ├── item.repository.ts            # Implementação Prisma
│   ├── item.repository.interface.ts  # Interface do repository
│   └── item.repository.integration.spec.ts # Testes integração
├── entities/
│   ├── item.entity.ts                # Entidade de domínio
│   └── item.entity.spec.ts           # Testes da entidade
├── dto/
│   ├── create-item.dto.ts            # DTOs de entrada
│   └── item-response.dto.ts          # DTOs de saída
└── seu-modulo.module.ts              # Configuração do módulo
```

## 🧪 Estratégia de Testes

### 1. Entidades (Domain)
```typescript
// item.entity.spec.ts
describe('Item Entity', () => {
  it('should create valid item', () => {
    const item = new Item('Nome', 'Descrição');
    expect(item.nome).toBe('Nome');
  });
  
  it('should validate required fields', () => {
    expect(() => new Item('')).toThrow();
  });
});
```

### 2. Use Cases (Business Logic)
```typescript
// criar-item.use-case.spec.ts
describe('CriarItemUseCase', () => {
  let useCase: CriarItemUseCase;
  let mockRepository: jest.Mocked<IItemRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByNome: jest.fn(),
      // ... outros métodos
    };
    useCase = new CriarItemUseCase(mockRepository);
  });

  it('should create item successfully', async () => {
    // Arrange
    mockRepository.findByNome.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockItem);

    // Act
    const result = await useCase.execute(createDto);

    // Assert
    expect(result).toBeInstanceOf(ItemResponseDto);
  });
});
```

### 3. Repositories (Integration)
```typescript
// item.repository.integration.spec.ts
describe('ItemRepository Integration', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
    testData = await createTestData();
  });

  it('should create item with database', async () => {
    const dto = { nome: 'Test', descricao: 'Description' };
    const result = await repository.create(dto);
    
    expect(result.id).toBeDefined();
    expect(result.nome).toBe('Test');
  });
});
```

## 🔄 Fluxo de Desenvolvimento

### 1. TDD Approach
```bash
# 1. Escreva o teste primeiro
npm run test:watch  # Terminal 1

# 2. Implemente o código
# 3. Refatore se necessário
# 4. Commit quando verde
```

### 2. Validação Completa
```bash
# Antes de fazer commit
npm run test:all           # Todos os testes
npm run lint               # Linting
npm run build              # Build check
```

## 🐳 Docker para Desenvolvimento

### Comandos Essenciais
```bash
# Bancos de dados
docker-compose -f docker-compose.dev.yml up -d mysql-dev
docker-compose -f docker-compose.dev.yml up -d mysql-test

# Administração
docker-compose -f docker-compose.dev.yml up -d adminer

# Limpar tudo
./scripts/clean-all.sh
```

### Portas Padrão
- **3000:** Frontend Next.js
- **3001:** Backend NestJS  
- **3306:** MySQL Development
- **3307:** MySQL Test
- **8080:** Adminer

## 🔧 Configurações Importantes

### 1. Prisma Schema
```prisma
// Sempre incluir timestamps
model Item {
  id        Int      @id @default(autoincrement())
  nome      String   @unique
  descricao String?
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("itens")
}
```

### 2. Module Configuration
```typescript
@Module({
  controllers: [ItemController],
  providers: [
    PrismaService,
    {
      provide: 'IItemRepository',
      useClass: ItemRepository,
    },
    {
      provide: CriarItemUseCase,
      useFactory: (repository: IItemRepository) => 
        new CriarItemUseCase(repository),
      inject: ['IItemRepository'],
    },
    // ... outros use cases
  ],
  exports: ['IItemRepository'],
})
export class ItemModule {}
```

## 🤖 Prompts para IA

### Criação de Módulo Completo
```
Crie um módulo completo seguindo o padrão do módulo usuarios:

1. Entidade de domínio com validações
2. Repository com interface e implementação Prisma  
3. Use cases para CRUD completo
4. Controller com todos os endpoints
5. DTOs de entrada e saída
6. Testes unitários para entidades e use cases
7. Testes de integração para repository
8. Configuração do módulo

Nome do módulo: [SEU_MODULO]
Campos da entidade: [CAMPOS]
Validações específicas: [VALIDACOES]
```

### Criação de Testes
```
Crie testes abrangentes para o use case [NOME_USE_CASE]:

1. Cenários de sucesso
2. Validações de entrada
3. Tratamento de erros
4. Casos extremos
5. Mocks apropriados
6. Cobertura de 100%

Inclua testes para:
- Dados válidos
- Dados inválidos  
- Conflitos (ex: email duplicado)
- Recursos não encontrados
- Erros de repositório
```

## 📊 Métricas de Qualidade

### Metas
- **Cobertura de testes:** ≥ 80%
- **Complexidade ciclomática:** ≤ 10 por função
- **Linhas por função:** ≤ 20
- **Classes por arquivo:** 1

### Comandos de Verificação
```bash
npm run test:cov           # Cobertura de testes
npm run lint               # ESLint
npm run build              # TypeScript check
```

## 🚨 Troubleshooting

### Problemas Comuns

**1. Erro de conexão com banco**
```bash
./scripts/setup-dev.sh    # Reconfigurar ambiente
```

**2. Testes de integração falhando**
```bash
./scripts/setup-test.sh   # Reconfigurar banco de teste
```

**3. Conflitos de porta**
```bash
./scripts/clean-all.sh    # Limpar containers
```

**4. Node modules corrompidos**
```bash
rm -rf backend/node_modules frontend/node_modules
npm install                # Reinstalar dependências
```

### Logs Úteis
```bash
# Backend logs
docker-compose -f docker-compose.dev.yml logs -f mysql-dev

# Container status  
docker ps -a

# Database connection
docker exec dashboard_mysql_dev mysql -u root -p
```

## 🎯 Checklist de Code Review

- [ ] Testes unitários e integração criados
- [ ] Cobertura ≥ 80%
- [ ] Validações de entrada implementadas
- [ ] Tratamento de erros adequado
- [ ] DTOs tipados corretamente
- [ ] Repository interface definida
- [ ] Clean Architecture respeitada
- [ ] Documentação atualizada
- [ ] Migrations criadas se necessário

---

**🎉 Happy coding! Este template está otimizado para máxima produtividade com IA.**
