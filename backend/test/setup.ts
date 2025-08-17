import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: './env.test' });

// Configuração global para testes
beforeAll(async () => {
  // Configurar variáveis de ambiente para teste
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'mysql://root:rootpassword@localhost:3307/dashboard_order_test';
  
  console.log('🔧 Configurando ambiente de teste E2E...');
  console.log(`📊 Database URL: ${process.env.DATABASE_URL}`);
});

afterAll(async () => {
  console.log('🧹 Limpeza final dos testes E2E...');
});

// Configuração do Jest
jest.setTimeout(30000);

// Mock global para console.log em testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Função helper para limpar banco de teste
export const cleanTestDatabase = async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  try {
    // Limpar dados em ordem (respeitando foreign keys)
    await prisma.usuario.deleteMany();
    await prisma.grupo.deleteMany();
    
    console.log('✅ Banco de teste limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar banco de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Função helper para verificar conexão com banco
export const checkDatabaseConnection = async (): Promise<boolean> => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco de teste estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de teste:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};
