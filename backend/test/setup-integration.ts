import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: './env.test' });

// Configurar variáveis de ambiente para teste
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'mysql://test_user:test_password@localhost:3307/dashboard_order_test';

let prisma: PrismaClient;

// Configuração global para testes de integração
beforeAll(async () => {
  console.log('🔧 Configurando ambiente de teste de integração...');
  console.log(`📊 Database URL: ${process.env.DATABASE_URL}`);
  
  // Inicializar Prisma
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Verificar conexão
  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco de teste estabelecida');
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de teste:', error);
    throw new Error('❌ Não foi possível conectar ao banco de teste. Execute: npm run db:test:setup');
  }
}, 60000);

afterAll(async () => {
  console.log('🧹 Limpeza final dos testes de integração...');
  if (prisma) {
    await prisma.$disconnect();
  }
}, 30000);

// Configuração do Jest
jest.setTimeout(60000);

// Função helper para limpar banco de teste
export const cleanTestDatabase = async (): Promise<void> => {
  if (!prisma) {
    throw new Error('Prisma não foi inicializado');
  }

  try {
    // Limpar dados em ordem (respeitando foreign keys)
    await prisma.usuario.deleteMany();
    await prisma.grupo.deleteMany();
    
    console.log('✅ Banco de teste limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar banco de teste:', error);
    throw error;
  }
};

// Função helper para verificar conexão com banco
export const checkDatabaseConnection = async (): Promise<boolean> => {
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  try {
    await testPrisma.$connect();
    console.log('✅ Conexão com banco de teste verificada');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de teste:', error);
    return false;
  } finally {
    await testPrisma.$disconnect();
  }
};

// Função helper para criar dados de teste
export const createTestData = async () => {
  if (!prisma) {
    throw new Error('Prisma não foi inicializado');
  }

  try {
    // Criar grupos de teste
    const grupoAdmin = await prisma.grupo.create({
      data: {
        nome: 'admin',
      },
    });

    const grupoSupervisor = await prisma.grupo.create({
      data: {
        nome: 'supervisor',
      },
    });

    return {
      grupos: [grupoAdmin, grupoSupervisor],
    };
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
    throw error;
  }
};

// Exportar instância do Prisma para uso nos testes
export { prisma };
