# Endpoints de CRUD - Dashboard Order

## Visão Geral

Foram criados endpoints completos para gerenciamento de:
- **Setores**
- **Colaboradores** 
- **Tipos de Atividade** (Tipo de Serviço)
- **Cidades**

Todos os endpoints seguem o padrão REST e incluem validação de dados, tratamento de erros e relacionamentos entre entidades.

## Estrutura do Banco de Dados

### Relacionamentos Implementados:

```
Setor (1) -----> (N) Colaborador
Setor (1) -----> (N) TipoAtividade
Setor (1) -----> (N) RegistroOS
Colaborador (1) -----> (N) RegistroOS
TipoAtividade (1) -----> (N) RegistroOS
Cidade (independente)
```

### Campos Comuns:
- `id`: UUID único
- `ativo`: Boolean (padrão: true)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Endpoints Criados

### 1. SETORES

#### POST `/ordem-servico/setor`
Criar novo setor
```json
{
  "nome": "FTTH",
  "ativo": true
}
```

#### PUT `/ordem-servico/setor/:id`
Atualizar setor existente
```json
{
  "nome": "FTTH Atualizado",
  "ativo": false
}
```

#### DELETE `/ordem-servico/setor/:id`
Deletar setor (apenas se não houver relacionamentos)

#### GET `/ordem-servico/setores` (já existia)
Listar todos os setores ativos

### 2. COLABORADORES

#### POST `/ordem-servico/colaborador`
Criar novo colaborador
```json
{
  "nome": "João Silva",
  "setorId": "uuid-do-setor",
  "ativo": true
}
```

#### PUT `/ordem-servico/colaborador/:id`
Atualizar colaborador
```json
{
  "nome": "João Silva Santos",
  "setorId": "novo-uuid-do-setor",
  "ativo": false
}
```

#### DELETE `/ordem-servico/colaborador/:id`
Deletar colaborador (apenas se não houver registros de OS)

#### GET `/ordem-servico/colaboradores?setor=FTTH` (já existia)
Listar colaboradores por setor

### 3. TIPOS DE ATIVIDADE (Tipo de Serviço)

#### POST `/ordem-servico/tipo-atividade`
Criar novo tipo de atividade
```json
{
  "nome": "Instalação de Fibra",
  "setorId": "uuid-do-setor",
  "ativo": true
}
```

#### PUT `/ordem-servico/tipo-atividade/:id`
Atualizar tipo de atividade
```json
{
  "nome": "Instalação de Fibra Óptica",
  "setorId": "novo-uuid-do-setor",
  "ativo": false
}
```

#### DELETE `/ordem-servico/tipo-atividade/:id`
Deletar tipo de atividade (apenas se não houver registros de OS)

#### GET `/ordem-servico/tipos-atividade?setor=FTTH` (já existia)
Listar tipos de atividade por setor

### 4. CIDADES

#### POST `/ordem-servico/cidade`
Criar nova cidade
```json
{
  "nome": "São Paulo",
  "estado": "SP",
  "ativo": true
}
```

#### GET `/ordem-servico/cidades`
Listar todas as cidades ativas (ordenadas por estado e nome)

#### PUT `/ordem-servico/cidade/:id`
Atualizar cidade
```json
{
  "nome": "São Paulo Capital",
  "estado": "SP",
  "ativo": false
}
```

#### DELETE `/ordem-servico/cidade/:id`
Deletar cidade

## Validações Implementadas

### DTOs com Validação:
- **Setor**: nome obrigatório (1-50 caracteres)
- **Colaborador**: nome obrigatório (1-100 caracteres), setorId obrigatório
- **Tipo Atividade**: nome obrigatório (1-200 caracteres), setorId obrigatório  
- **Cidade**: nome obrigatório (1-100 caracteres), estado obrigatório (2 caracteres)

### Regras de Negócio:
1. **Unicidade**: Setores e cidades têm nomes únicos
2. **Integridade Referencial**: Não é possível deletar entidades com relacionamentos ativos
3. **Validação de Relacionamentos**: Colaboradores e tipos de atividade devem pertencer a setores existentes
4. **Soft Delete**: Campo `ativo` permite desativar sem deletar fisicamente

## Tratamento de Erros

### Códigos HTTP:
- `201 Created`: Entidade criada com sucesso
- `200 OK`: Entidade atualizada com sucesso
- `204 No Content`: Entidade deletada com sucesso
- `400 Bad Request`: Dados inválidos ou violação de regras de negócio
- `404 Not Found`: Entidade não encontrada
- `409 Conflict`: Violação de unicidade

### Mensagens de Erro:
- Validação de campos obrigatórios
- Verificação de relacionamentos existentes
- Prevenção de exclusão com dependências
- Conflitos de unicidade

## Lógica de Relacionamentos

### Hierarquia de Dependências:
1. **Setor** é a entidade base
2. **Colaborador** e **TipoAtividade** dependem de Setor
3. **RegistroOS** depende de Setor, Colaborador e TipoAtividade
4. **Cidade** é independente (pode ser usada futuramente)

### Proteções Implementadas:
- Não é possível deletar setor com colaboradores/tipos de atividade/registros
- Não é possível deletar colaborador com registros de OS
- Não é possível deletar tipo de atividade com registros de OS
- Validação de existência de setor ao criar/atualizar colaboradores e tipos de atividade

## Próximos Passos

Para usar os novos endpoints:

1. **Executar migração do banco**:
   ```bash
   npx prisma migrate dev --name add-cidade-model
   ```

2. **Gerar cliente Prisma**:
   ```bash
   npx prisma generate
   ```

3. **Testar endpoints** usando o arquivo `api.http` ou Postman

4. **Integrar com frontend** para criar interfaces de gerenciamento

Os endpoints estão prontos para uso e seguem as melhores práticas de desenvolvimento com NestJS e Prisma.
