# 🗄️ Configuração de Banco de Teste

## 📋 Visão Geral

Este documento explica como configurar e usar o banco de teste para executar os testes de **repositories** e **E2E** que precisam de uma conexão real com banco de dados.

## 🏗️ Estrutura de Configuração

```
backend/
├── env.test                           # Variáveis de ambiente para teste
├── prisma/
│   └── schema.test.prisma            # Schema Prisma para teste
├── test/
│   ├── jest-integration.json         # Config Jest para testes de integração
│   ├── setup-integration.ts          # Setup para testes de integração
│   └── setup.ts                      # Setup para testes E2E
├── scripts/
│   ├── setup-test-db.sh              # Script para configurar banco de teste
│   └── clean-test-db.sh              # Script para limpar banco de teste
└── package.json                       # Scripts de teste atualizados
```

## 🚀 Configuração Inicial

### 1. **Configurar Banco de Teste**

```bash
# Executar script de configuração
npm run db:test:setup
```

Este comando irá:
- ✅ Criar banco `dashboard_order_test`
- ✅ Executar migrations
- ✅ Gerar cliente Prisma para teste

### 2. **Verificar Configuração**

```bash
# Verificar se o banco foi criado
mysql -u root -ppassword -e "SHOW DATABASES;" | grep dashboard_order_test
```

## 🧪 Executando os Testes

### **Testes de Integração (Repositories)**

```bash
# Executar testes de repositories
npm run test:repositories

# Ou usando configuração específica
npm run test:integration
```

### **Testes E2E (Endpoints)**

```bash
# Executar testes E2E
npm run test:e2e
```

### **Todos os Testes**

```bash
# Executar todos os tipos de teste
npm run test:all
```

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:test:setup` | Configura banco de teste |
| `npm run db:test:clean` | Limpa dados do banco de teste |
| `npm run test:repositories` | Testes de integração (repositories) |
| `npm run test:integration` | Testes de integração (configuração específica) |
| `npm run test:e2e` | Testes end-to-end |
| `npm run test:all` | Todos os tipos de teste |

## 🗃️ Banco de Teste

### **Configuração**

- **Host**: localhost
- **Porta**: 3306
- **Usuário**: root
- **Senha**: password
- **Banco**: dashboard_order_test

### **Tabelas**

- `usuarios` - Usuários do sistema
- `grupos` - Grupos de usuários

### **Isolamento**

- ✅ Banco separado do desenvolvimento
- ✅ Dados limpos antes de cada teste
- ✅ Não interfere com dados de produção

## 🚨 Troubleshooting

### **Problema: "Authentication failed"**

```bash
# Verificar se o MySQL está rodando
sudo systemctl status mysql

# Verificar credenciais
mysql -u root -ppassword -e "SELECT 1;"
```

### **Problema: "Database doesn't exist"**

```bash
# Recriar banco de teste
npm run db:test:setup
```

### **Problema: "Connection timeout"**

```bash
# Verificar se a porta 3306 está livre
netstat -tlnp | grep 3306

# Verificar firewall
sudo ufw status
```

### **Problema: "Permission denied"**

```bash
# Dar permissões ao usuário root
mysql -u root -ppassword -e "GRANT ALL PRIVILEGES ON dashboard_order_test.* TO 'root'@'localhost';"
mysql -u root -ppassword -e "FLUSH PRIVILEGES;"
```

## 🔄 Manutenção

### **Limpar Dados de Teste**

```bash
# Limpar dados (manter estrutura)
npm run db:test:clean
```

### **Recriar Banco de Teste**

```bash
# Recriar completamente
npm run db:test:setup
```

### **Verificar Status**

```bash
# Verificar tabelas
mysql -u root -ppassword dashboard_order_test -e "SHOW TABLES;"

# Verificar dados
mysql -u root -ppassword dashboard_order_test -e "SELECT COUNT(*) FROM usuarios; SELECT COUNT(*) FROM grupos;"
```

## 📊 Monitoramento

### **Logs de Teste**

Os testes de integração e E2E geram logs detalhados:

```bash
# Executar com verbose
npm run test:repositories -- --verbose
npm run test:e2e -- --verbose
```

### **Cobertura de Teste**

```bash
# Gerar relatório de cobertura
npm run test:cov
```

## 🎯 Boas Práticas

### **1. Sempre limpar dados antes dos testes**
```typescript
beforeEach(async () => {
  await cleanTestDatabase();
});
```

### **2. Verificar conexão antes de executar testes**
```typescript
beforeAll(async () => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Banco de teste não disponível');
  }
});
```

### **3. Usar dados de teste isolados**
```typescript
// ✅ Bom: Dados específicos para teste
const testUsuario = new Usuario('test@example.com', 'password123', 1);

// ❌ Ruim: Dados que podem existir no banco
const existingUsuario = await repository.findByEmail('admin@example.com');
```

### **4. Limpar recursos após testes**
```typescript
afterAll(async () => {
  await prismaService.$disconnect();
});
```

## 🔍 Debugging

### **Executar Teste Específico**

```bash
# Teste específico
npm run test:repositories -- --testNamePattern="should create a new usuario"

# Teste com debug
npm run test:debug
```

### **Verificar Banco Durante Teste**

```bash
# Em outro terminal, monitorar banco
mysql -u root -ppassword dashboard_order_test -e "SELECT * FROM usuarios; SELECT * FROM grupos;"
```

## 📈 Próximos Passos

### **Melhorias Futuras**

- [ ] **TestContainers**: Usar containers Docker para testes
- [ ] **Migrations automáticas**: Executar migrations automaticamente
- [ ] **Seed de dados**: Criar dados de teste consistentes
- [ **Backup/Restore**: Backup automático antes dos testes

---

## 🎉 **Resultado Esperado**

Após a configuração, você deve conseguir executar:

```bash
✅ npm run test:entities      # 43/43 testes passando
✅ npm run test:usecases      # 27/27 testes passando  
✅ npm run test:repositories  # 19/19 testes passando
✅ npm run test:e2e           # Todos os testes E2E passando
```

**Todos os testes devem passar para garantir a qualidade do código! 🚀**
