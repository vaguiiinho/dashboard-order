# 🧪 Guia de Teste do Frontend

Este guia explica como testar o frontend independentemente do backend.

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Portas 3000 disponível

## 🚀 Opção 1: Teste Rápido com Make

```bash
# Comando mais simples
make frontend-only
```

## 🚀 Opção 2: Script Manual

```bash
# Execute o script de teste
./scripts/start-frontend-only.sh
```

## 🚀 Opção 3: Docker Compose Manual

```bash
# 1. Criar .env se não existir
cp env.example .env

# 2. Iniciar apenas o frontend
docker-compose -f docker-compose.dev.yml up --build -d frontend

# 3. Verificar logs
docker-compose -f docker-compose.dev.yml logs -f frontend
```

## 🌐 Acessando a Aplicação

Depois de executar qualquer opção acima:

1. **Acesse:** http://localhost:3000
2. **Login:** 
   - Email: `admin@dashboard.com`
   - Senha: `admin123`

## 🎮 Testando Funcionalidades

### ✅ Autenticação
- [x] Página de login responsiva
- [x] Validação de formulário
- [x] Feedback de erro/sucesso
- [x] Redirecionamento após login

### ✅ Layout
- [x] Sidebar responsiva
- [x] Header com barra de busca
- [x] Navegação baseada em roles
- [x] Menu mobile funcional

### ✅ Dashboard
- [x] Estatísticas resumidas (cards)
- [x] Gráfico de pizza (status/prioridade)
- [x] Gráfico de barras (categoria/departamento/cidade)
- [x] Gráfico de linha (tendência mensal)
- [x] Estados de loading
- [x] Tratamento de erro

### ✅ Componentes UI
- [x] Botões com estados (loading, disabled)
- [x] Cards com sombras
- [x] Badges coloridos
- [x] Spinner de loading
- [x] Responsividade

## 📊 Dados Mock Disponíveis

O frontend em modo teste usa dados simulados:

- **135 ordens** no total
- **35 pendentes**, **28 em andamento**, **71 concluídas**
- Dados distribuídos por categoria, departamento, cidade
- Tendência mensal dos últimos 6 meses
- 5 usuários mock, 6 cidades, 5 departamentos

## 🔧 Comandos Úteis

```bash
# Ver logs do frontend
docker-compose -f docker-compose.dev.yml logs -f frontend

# Parar apenas o frontend
docker-compose -f docker-compose.dev.yml stop frontend

# Reconstruir o frontend
docker-compose -f docker-compose.dev.yml up --build -d frontend

# Status do container
docker-compose -f docker-compose.dev.yml ps frontend

# Entrar no container para debug
docker-compose -f docker-compose.dev.yml exec frontend sh
```

## 🐛 Solução de Problemas

### Erro de porta ocupada
```bash
# Verificar o que está usando a porta 3000
sudo lsof -i :3000
# Ou parar outros containers
docker-compose down
```

### Container não inicia
```bash
# Verificar logs para erros
docker-compose -f docker-compose.dev.yml logs frontend

# Reconstruir do zero
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build frontend
```

### Mudanças no código não aparecem
```bash
# O volume está mapeado, mas se não funcionar:
docker-compose -f docker-compose.dev.yml restart frontend
```

## 🔍 Testando Diferentes Cenários

### Teste de Responsividade
1. Redimensione a janela do browser
2. Teste no mobile (F12 > Device Mode)
3. Verifique se sidebar/menu funcionam

### Teste de Loading States
1. Abra DevTools (F12)
2. Vá em Network > Slow 3G
3. Faça login para ver spinners de loading
4. Navegue entre páginas

### Teste de Erros
1. Desligue a internet temporariamente
2. Tente fazer login
3. Verifique se erros são exibidos corretamente

## 🎯 Próximos Passos

Após testar o frontend:

1. **Desenvolvimento do Backend:** Implementar API NestJS
2. **Integração:** Conectar frontend com backend real
3. **Filtros Avançados:** Implementar sistema de filtros
4. **CRUD de Ordens:** Páginas para gerenciar ordens
5. **Testes Automatizados:** Jest + React Testing Library

## 📞 Suporte

- Verifique os logs primeiro: `make logs`
- Consulte a documentação no README.md
- Abra uma issue se encontrar problemas
