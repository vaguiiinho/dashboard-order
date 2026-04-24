# Build stage
FROM node:20-alpine

# Copiar dependências
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Gerar prisma client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Copiar entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

# Healthcheck (corrigido)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 3001