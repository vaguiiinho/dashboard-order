#!/bin/bash

echo "🚀 Iniciando Backend + MySQL para desenvolvimento..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "⚙️  Criando arquivo .env para desenvolvimento..."
    cp env.example .env
    echo "✅ Arquivo .env criado"
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Iniciar MySQL primeiro
echo "🗄️  Iniciando MySQL..."
docker-compose -f docker-compose.dev.yml up -d mysql

# Aguardar MySQL estar pronto
echo "⏳ Aguardando MySQL inicializar..."
sleep 15

# Iniciar Backend
echo "🔨 Construindo e iniciando Backend..."
docker-compose -f docker-compose.dev.yml up --build -d backend

# Aguardar inicialização
echo "⏳ Aguardando Backend inicializar..."
sleep 20

# Executar migrations e seed
echo "🔄 Executando migrations e seed..."
docker-compose -f docker-compose.dev.yml exec backend npx prisma db push
docker-compose -f docker-compose.dev.yml exec backend npx prisma db seed

# Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.dev.yml ps mysql backend

echo ""
echo "✅ Backend iniciado!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   API Backend: http://localhost:3001/api"
echo "   MySQL: localhost:3306"
echo ""
echo "📝 Dados para teste:"
echo "   Email: admin@dashboard.com"
echo "   Senha: admin123"
echo ""
echo "🧪 Teste de login:"
echo "   curl -X POST http://localhost:3001/api/auth/login \\"
echo "        -H \"Content-Type: application/json\" \\"
echo "        -d '{\"email\":\"admin@dashboard.com\",\"password\":\"admin123\"}'"
echo ""
echo "📝 Para ver os logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f backend"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose -f docker-compose.dev.yml down"
