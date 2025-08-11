# Integração com API IXC - Dashboard de O.S

## 📋 Visão Geral

Este projeto implementa uma integração completa com a API IXC para monitoramento de produtividade de Ordens de Serviço (O.S). A implementação foi feita diretamente no Next.js para otimizar performance e reduzir latência.

## 🔧 Configuração

### Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` no diretório `frontend/` com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IXC_API_URL=https://crm.tubaron.net/webservice/v1
NEXT_PUBLIC_IXC_TOKEN=seu_token_base64_aqui
```

**Importante:** O `NEXT_PUBLIC_IXC_TOKEN` deve ser o token em formato Base64 da API IXC, diferente do JWT usado para autenticação interna.

### Logo da Empresa

Substitua o arquivo `frontend/public/logo.png` pelo logo oficial da Tubaron (recomendado 32x32px ou 64x64px).

## 📊 Funcionalidades Implementadas

### Dashboard Principal (`/dashboard`)

#### Filtros Disponíveis:
- **Período**: Data inicial e final com filtros rápidos (hoje, semana, mês, trimestre)
- **Colaboradores**: Seleção múltipla de técnicos específicos
- **Filtros Mensais**: Períodos pré-definidos para análise

#### Visualizações:
1. **Card Total**: Quantidade total de O.S no período
2. **Gráfico Pizza - Assuntos**: Distribuição de O.S por tipo de assunto
3. **Gráfico Pizza - Cidades**: Distribuição de O.S por localização
4. **Gráfico Barras - Colaboradores**: Produtividade individual dos técnicos

### Administração (`/dashboard/usuarios`)

Página separada para gerenciamento de usuários e grupos do sistema interno.

### Navbar Inteligente

- Título: "BI - Monitoramento de Produtividade de O.S"
- Logo da empresa (placeholder)
- Menu do usuário com acesso à administração
- Logout seguro

## 🔌 Endpoints IXC Integrados

### Consultas de O.S:
- `POST /su_oss_chamado` - O.S por assunto
- `POST /su_oss_chamado` - O.S por setor  
- `POST /su_oss_chamado` - O.S por colaborador
- `POST /su_oss_chamado` - O.S por cidade

### Consultas Auxiliares:
- `POST /su_oss_assunto` - Detalhes dos assuntos
- `POST /cidade` - Nomes das cidades
- `POST /funcionarios` - Nomes dos colaboradores

## 🚀 Como Usar

1. **Configure as variáveis de ambiente** com os dados da API IXC
2. **Inicie o sistema**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Acesse o dashboard** em `http://localhost:3000/dashboard`
4. **Configure os filtros** de período e colaboradores
5. **Visualize os dados** em tempo real

## 🎯 Melhorias Implementadas

### Arquitetura:
- ✅ Integração direta no Next.js (menor latência)
- ✅ Requisições paralelas para melhor performance
- ✅ Cache inteligente de dados
- ✅ Tratamento robusto de erros

### UX/UI:
- ✅ Design moderno e responsivo
- ✅ Filtros intuitivos com busca
- ✅ Gráficos interativos (Recharts)
- ✅ Estados de loading e erro
- ✅ Feedback visual em tempo real

### Funcionalidades:
- ✅ Filtros rápidos de período
- ✅ Seleção múltipla de colaboradores
- ✅ Atualização manual dos dados
- ✅ Resumo detalhado do período
- ✅ Navegação entre páginas

## 📈 Estrutura dos Dados

### Filtros de Grid IXC:
```json
{
  "grid_param": "[{\"TB\":\"campo\", \"OP\":\"operador\", \"P\":\"valor\", \"P2\":\"valor2\"}]"
}
```

### Operadores Suportados:
- `=` - Igual
- `IN` - Em lista de valores
- `BE` - Entre valores (datas)

### Status Fixo:
- Todas as consultas filtram por `status = "F"` (finalizado)

## 🔒 Segurança

- Token IXC separado da autenticação interna
- Validação de dados de entrada
- Tratamento seguro de erros de API
- Headers de autorização adequados

## 🛠 Manutenção

### Logs de Debug:
Erros da API IXC são logados no console do navegador para facilitar debugging.

### Monitoramento:
- Status de conexão com API IXC
- Tempo de resposta das consultas
- Erros de autenticação

### Backup:
Dados são consultados em tempo real, sem armazenamento local permanente.

## 📞 Suporte

Para problemas com a integração IXC, verifique:

1. ✅ Conectividade com `https://crm.tubaron.net`
2. ✅ Validade do token de autenticação
3. ✅ Permissões de acesso aos endpoints
4. ✅ Formato correto dos parâmetros de consulta

---

**Desenvolvido especificamente para Tubaron - Sistema de BI para Monitoramento de Produtividade de O.S**
