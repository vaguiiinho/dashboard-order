import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar grupos se não existirem
  const grupos = [
    { nome: 'gerente' },
    { nome: 'supervisor' },
    { nome: 'colaborador' },
  ];

  for (const grupo of grupos) {
    await prisma.grupo.upsert({
      where: { nome: grupo.nome },
      update: {},
      create: grupo,
    });
  }

  console.log('Grupos criados com sucesso!');

  // Buscar o grupo gerente para criar usuário admin
  const grupoGerente = await prisma.grupo.findUnique({
    where: { nome: 'gerente' },
  });

  if (grupoGerente) {
    // Criar usuário admin se não existir
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await prisma.usuario.upsert({
      where: { email: 'admin@exemplo.com' },
      update: {},
      create: {
        email: 'admin@exemplo.com',
        senha: senhaHash,
        grupoId: grupoGerente.id,
      },
    });

    console.log('Usuário admin criado com sucesso!');
    console.log('Email: admin@exemplo.com');
    console.log('Senha: admin123');
  }

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

