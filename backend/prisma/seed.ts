import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Hash da senha padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Criar usuário administrador
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dashboard.com' },
    update: {},
    create: {
      email: 'admin@dashboard.com',
      password: hashedPassword,
      name: 'Administrador',
      role: Role.ADMIN,
      department: 'TI',
      city: 'São Paulo',
      active: true,
    },
  });

  console.log('✅ Usuário admin criado:', admin);

  // Criar categorias padrão
  const categories = [
    { name: 'Manutenção', description: 'Serviços de manutenção preventiva e corretiva', color: '#28a745' },
    { name: 'Instalação', description: 'Instalação de novos equipamentos e estruturas', color: '#007bff' },
    { name: 'Reparo', description: 'Reparos urgentes e emergenciais', color: '#dc3545' },
    { name: 'Inspeção', description: 'Inspeções técnicas e de segurança', color: '#ffc107' },
    { name: 'Limpeza', description: 'Serviços de limpeza e conservação', color: '#6f42c1' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorias criadas');

  // Criar departamentos padrão
  const departments = [
    { name: 'Técnico', description: 'Departamento técnico responsável por manutenções' },
    { name: 'Operações', description: 'Departamento de operações e logística' },
    { name: 'Qualidade', description: 'Controle de qualidade e inspeções' },
    { name: 'Segurança', description: 'Segurança do trabalho e patrimonial' },
    { name: 'Administrativo', description: 'Departamento administrativo' },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: {},
      create: department,
    });
  }

  console.log('✅ Departamentos criados');

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
