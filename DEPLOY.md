# 📦 Guia de Deploy em Produção

Este guia detalha como fazer o deploy completo da aplicação em um servidor de produção.

## 🎯 Requisitos do Servidor

### Mínimo Recomendado
- **CPU**: 2 vCPU
- **RAM**: 4GB
- **Disco**: 40GB SSD
- **SO**: Ubuntu 22.04 LTS ou similar

### Para Produção com Muitos Usuários
- **CPU**: 4 vCPU
- **RAM**: 8GB
- **Disco**: 80GB SSD
- **SO**: Ubuntu 22.04 LTS

## 📋 Pré-requisitos

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker (opcional)
sudo usermod -aG docker $USER
```

## 🚀 Passo a Passo

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd dashboard-order
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
nano .env
```

**Importante**: Altere pelo menos:
- `MYSQL_ROOT_PASSWORD`: Use uma senha forte
- `JWT_SECRET`: Use uma string aleatória longa e segura

### 3. Construir e Iniciar

```bash
# Build e start de todos os serviços
docker-compose up -d --build

# Verificar logs
docker-compose logs -f
```

### 4. Verificar Status

```bash
# Status dos containers
docker-compose ps

# Healthcheck
curl http://localhost/health

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f nginx
```

## 🔧 Configurações Adicionais

### Firewall (UFW)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### Domínio Customizado

Para usar um domínio, edite `nginx/conf.d/default.conf`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;
    # ... resto da configuração
}
```

### SSL/HTTPS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado (ajuste para usar nginx do docker)
# Nota: Pode ser necessário ajustar a configuração do nginx
sudo certbot --nginx -d seu-dominio.com.br
```

## 📊 Manutenção

### Backup do Banco de Dados

```bash
# Backup manual
docker-compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (criar script)
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR
docker-compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Adicionar ao crontab (backup diário às 2h)
# crontab -e
# 0 2 * * * /caminho/para/backup.sh
```

### Restaurar Backup

```bash
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < backup.sql
```

### Atualizar Aplicação

```bash
# 1. Fazer backup do banco
docker-compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > backup_antes_atualizacao.sql

# 2. Atualizar código
git pull origin main

# 3. Rebuild e restart
docker-compose up -d --build

# 4. Aplicar migrations (se necessário)
docker-compose exec backend npx prisma migrate deploy
```

### Limpar Recursos Não Utilizados

```bash
# Remover imagens antigas
docker image prune -a

# Remover volumes não utilizados (CUIDADO!)
docker volume prune

# Ver uso de disco
docker system df
```

## 🔍 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs [nome_do_servico]

# Verificar status
docker-compose ps

# Reiniciar serviço específico
docker-compose restart [nome_do_servico]
```

### Banco de dados não conecta

```bash
# Verificar se MySQL está rodando
docker-compose ps mysql

# Verificar logs do MySQL
docker-compose logs mysql

# Testar conexão
docker-compose exec mysql mysql -u root -p
```

### Nginx retorna 502

```bash
# Verificar se backend está rodando
docker-compose ps backend

# Verificar logs do backend
docker-compose logs backend

# Verificar logs do nginx
docker-compose logs nginx
```

### Problemas de memória

```bash
# Ver uso de recursos
docker stats

# Limitar memória no docker-compose.yml (exemplo)
# backend:
#   deploy:
#     resources:
#       limits:
#         memory: 512M
```

## 📈 Monitoramento

### Logs em Tempo Real

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
```

### Métricas do Sistema

```bash
# Uso de recursos dos containers
docker stats

# Espaço em disco
df -h
docker system df
```

## 🔐 Segurança

### Checklist

- [ ] Alterar `MYSQL_ROOT_PASSWORD` padrão
- [ ] Alterar `JWT_SECRET` padrão
- [ ] Configurar firewall (portas 80, 443 apenas)
- [ ] Não expor porta 3306 publicamente
- [ ] Usar HTTPS em produção
- [ ] Configurar backups automáticos
- [ ] Manter Docker e imagens atualizadas
- [ ] Revisar permissões de arquivos

### Atualizar Imagens

```bash
# Atualizar imagens base
docker-compose pull
docker-compose up -d --build
```

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Verifique o status: `docker-compose ps`
3. Teste o healthcheck: `curl http://localhost/health`
4. Revise as variáveis de ambiente no `.env`
