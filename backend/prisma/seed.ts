import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem para respeitar as foreign keys)
  await prisma.registroOS.deleteMany();
  await prisma.tipoAtividade.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.setor.deleteMany();

  // Criar Setores
  const setorFTTH = await prisma.setor.create({
    data: { nome: 'FTTH' },
  });

  const setorInfraestrutura = await prisma.setor.create({
    data: { nome: 'INFRAESTRUTURA' },
  });

  const setorSuporte = await prisma.setor.create({
    data: { nome: 'SUPORTE' },
  });

  const setorFinanceiro = await prisma.setor.create({
    data: { nome: 'FINANCEIRO' },
  });

  console.log('✅ Setores criados');

  // Criar Colaboradores - FTTH
  const colaboradoresFTTH = [
    'Alan',
    'Páscoa',
    'Everson',
    'Carlos',
    'Kassio',
    'Ralfe',
    'Alisson',
  ];

  for (const nome of colaboradoresFTTH) {
    await prisma.colaborador.create({
      data: { nome, setorId: setorFTTH.id },
    });
  }

  // Criar Colaboradores - Infraestrutura
  const colaboradoresInfra = [
    'Emerson',
    'Julio',
    'Matheus',
    'Maurício',
    'Cristiano',
    'Severo',
    'Joel',
  ];

  for (const nome of colaboradoresInfra) {
    await prisma.colaborador.create({
      data: { nome, setorId: setorInfraestrutura.id },
    });
  }

  // Criar Colaboradores - Suporte
  await prisma.colaborador.create({
    data: { nome: 'Equipe Suporte', setorId: setorSuporte.id },
  });

  // Criar Colaboradores - Financeiro
  await prisma.colaborador.create({
    data: { nome: 'Equipe Financeiro', setorId: setorFinanceiro.id },
  });

  console.log('✅ Colaboradores criados');

  // Criar Tipos de Atividade - FTTH
  const tiposFTTH = [
    'Instalação',
    'Adequação',
    'Sem Conexão',
    'Verificação de Equipamento',
    'Recuperação de Crédito',
    'Retirada (Cancelamento/Negativados)',
    'Consultiva',
    'Mudança de Endereço',
    'Sinal Atenuado',
    'Problemas na TV',
    'Retrabalho',
    'Telefonia',
    'Instalação TV',
    'Instalação Rede Mesh',
  ];

  for (const nome of tiposFTTH) {
    await prisma.tipoAtividade.create({
      data: { nome, setorId: setorFTTH.id },
    });
  }

  // Criar Tipos de Atividade - Infraestrutura
  const tiposInfra = [
    'Manutenção BKB Indisponível',
    'Manutenção FTTH Indisponível',
    'Ampliação Rede FTTH',
    'Instalação Pop BKB',
    'Manutenção Predial',
    'Manutenção FTTH Prejudicado',
    'Manutenção BKB Prejudicado',
  ];

  for (const nome of tiposInfra) {
    await prisma.tipoAtividade.create({
      data: { nome, setorId: setorInfraestrutura.id },
    });
  }

  // Criar Tipos de Atividade - Suporte
  const tiposSuporte = [
    'Suporte Técnico - Sem Conexão',
    'Suporte Técnico - Problema Sinal Wi-fi',
    'Suporte Téc. sem retorno do cliente',
    'Suporte Técnico - Dúvidas e informações',
    'Suporte Técnico - Tubaplay',
    'Envio de fatura / Desbloqueio',
    'Troca de endereço',
    'Suporte Técnico - Senha / Nome Wi-Fi',
    'Troca de login',
    'Direcionamento de Portas',
    'Suporte Técnico - Problema no STB',
    'Suporte Técnico - Telefonia',
  ];

  for (const nome of tiposSuporte) {
    await prisma.tipoAtividade.create({
      data: { nome, setorId: setorSuporte.id },
    });
  }

  // Criar Tipos de Atividade - Financeiro
  const tiposFinanceiro = [
    'Recuperação de Crédito/Visita',
    'Retirada de Equipamento',
    'Cobrança',
    'Negativação',
  ];

  for (const nome of tiposFinanceiro) {
    await prisma.tipoAtividade.create({
      data: { nome, setorId: setorFinanceiro.id },
    });
  }

  console.log('✅ Tipos de atividade criados');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

