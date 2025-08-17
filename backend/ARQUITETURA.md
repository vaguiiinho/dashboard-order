# Arquitetura do Backend - Clean Architecture + DDD

## 🏗️ Visão Geral da Arquitetura

Este backend foi implementado seguindo os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**, com foco em:

- **Separação de responsabilidades**
- **Inversão de dependências**
- **Entidades ricas (não anêmicas)**
- **Validações de domínio**
- **DTOs de entrada e saída bem definidos**

## 📁 Estrutura dos Módulos

### Módulo de Usuários (`/modules/usuarios`)

```
usuarios/
├── entities/           # Entidades de domínio
│   ├── usuario.entity.ts
│   ├── grupo.entity.ts
│   └── index.ts
├── dto/               # DTOs de entrada e saída
│   ├── create-usuario.dto.ts
│   └── usuario-response.dto.ts
├── use-cases/         # Casos de uso
│   ├── criar-usuario.use-case.ts
│   ├── criar-grupo.use-case.ts
│   └── ...
├── repositories/      # Interfaces e implementações
│   ├── usuario.repository.interface.ts
│   └── usuario.repository.ts
└── controllers/       # Controllers HTTP
    └── usuarios.controller.ts
```

### Módulo IXC (`/modules/ixc`)

```
ixc/
├── entities/          # Entidades de domínio
│   ├── ordem-servico.entity.ts
│   ├── assunto.entity.ts
│   └── index.ts
├── dto/               # DTOs de entrada e saída
│   ├── consulta-os.dto.ts
│   └── resposta-ixc.dto.ts
├── use-cases/         # Casos de uso
│   └── consultar-os-por-assunto.use-case.ts
├── repositories/      # Interfaces e implementações
│   ├── ixc.repository.interface.ts
│   └── ixc.repository.ts
└── controllers/       # Controllers HTTP
    └── ixc.controller.ts
```

## 🔧 Princípios Implementados

### 1. **SOLID Principles**

- **S** - Single Responsibility: Cada classe tem uma única responsabilidade
- **O** - Open/Closed: Extensível sem modificação
- **L** - Liskov Substitution: Interfaces bem definidas
- **I** - Interface Segregation: Interfaces específicas para cada contexto
- **D** - Dependency Inversion: Dependências através de abstrações

### 2. **Clean Architecture Layers**

```
Controllers (HTTP) → Use Cases → Entities ← Repositories
     ↓                    ↓         ↓           ↓
   HTTP Layer    →  Business Logic → Domain ← Data Access
```

### 3. **Domain-Driven Design**

- **Entities**: Objetos com identidade e comportamento
- **Value Objects**: Objetos imutáveis
- **Repositories**: Abstração para persistência
- **Use Cases**: Casos de uso da aplicação

## 🎯 Entidades de Domínio

### Usuario Entity
- **Validações**: Email, senha, grupo
- **Comportamentos**: Alterar senha, alterar grupo, verificar permissões
- **Encapsulamento**: Propriedades privadas com getters/setters

### Grupo Entity
- **Validações**: Nome obrigatório
- **Comportamentos**: Adicionar/remover usuários
- **Relacionamentos**: Lista de usuários

### OrdemServico Entity
- **Validações**: ID, status, datas
- **Comportamentos**: Finalizar, cancelar, reagendar
- **Regras de Negócio**: Status válidos, transições permitidas

### Assunto Entity
- **Validações**: ID, nome obrigatório
- **Comportamentos**: Ativar/desativar
- **Estado**: Controle de ativo/inativo

## 📤 DTOs de Entrada e Saída

### DTOs de Entrada
- Validações com `class-validator`
- Mensagens de erro personalizadas
- Tipos específicos para cada operação

### DTOs de Saída
- Dados filtrados (sem informações sensíveis)
- Formatação consistente
- Transformação de entidades para resposta

## 🔄 Use Cases

### Características
- **Orquestração**: Coordenam entidades e repositórios
- **Validação**: Regras de negócio e validações
- **Tratamento de Erros**: Exceções específicas
- **Injeção de Dependência**: Repositórios via interface

### Exemplos Implementados
- `CriarUsuarioUseCase`: Criação com validações
- `ConsultarOSPorAssuntoUseCase`: Consulta com filtros
- `CriarGrupoUseCase`: Criação de grupos

## 🗄️ Repositories

### Interface Pattern
- **Contratos**: Interfaces definem métodos disponíveis
- **Implementação**: Classes concretas implementam interfaces
- **Inversão**: Dependências através de abstrações

### Exemplos
- `IUsuarioRepository`: Métodos para usuários e grupos
- `IIXCRepository`: Métodos para integração IXC

## 🚀 Como Usar

### 1. **Criar um novo Use Case**
```typescript
@Injectable()
export class NovoUseCase {
  constructor(private readonly repository: IRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    // Lógica de negócio
    // Validações
    // Chamadas para repositório
    // Retorno formatado
  }
}
```

### 2. **Criar uma nova Entity**
```typescript
export class NovaEntity {
  private _propriedade: string;

  constructor(propriedade: string) {
    this.validarPropriedade(propriedade);
    this._propriedade = propriedade;
  }

  get propriedade(): string { return this._propriedade; }

  private validarPropriedade(propriedade: string): void {
    // Validações
  }
}
```

### 3. **Criar um novo Repository**
```typescript
export interface INovoRepository {
  metodo(): Promise<Resultado>;
}

@Injectable()
export class NovoRepository implements INovoRepository {
  async metodo(): Promise<Resultado> {
    // Implementação
  }
}
```

## 🔒 Validações e Segurança

### Validações de Domínio
- **Entidades**: Validações no construtor
- **DTOs**: Validações com decorators
- **Use Cases**: Validações de regras de negócio

### Tratamento de Erros
- **Exceções específicas**: `BadRequestException`, `ConflictException`
- **Logs estruturados**: Para debugging e monitoramento
- **Mensagens amigáveis**: Para o usuário final

## 📊 Benefícios da Arquitetura

### ✅ **Manutenibilidade**
- Código organizado e fácil de entender
- Mudanças isoladas em camadas específicas
- Testes unitários facilitados

### ✅ **Escalabilidade**
- Novos módulos seguem o mesmo padrão
- Dependências bem definidas
- Fácil adição de novas funcionalidades

### ✅ **Testabilidade**
- Injeção de dependência facilita mocks
- Lógica de negócio isolada
- Testes de integração simplificados

### ✅ **Flexibilidade**
- Troca de implementações sem afetar outras camadas
- Configuração via variáveis de ambiente
- Adaptação a diferentes bancos de dados

## 🚧 Próximos Passos

### Implementações Pendentes
- [ ] Use cases para listagem de assuntos, cidades e colaboradores
- [ ] Use case para dashboard completo
- [ ] Validações adicionais de domínio
- [ ] Testes unitários para entidades e use cases
- [ ] Testes de integração para repositórios

### Melhorias Futuras
- [ ] Cache para consultas IXC
- [ ] Rate limiting para APIs externas
- [ ] Métricas e monitoramento
- [ ] Documentação automática (Swagger)
- [ ] Logs estruturados (Winston/Pino)

---

**Desenvolvido seguindo as melhores práticas de Clean Architecture e Domain-Driven Design**
