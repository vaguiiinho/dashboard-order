import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem para respeitar as foreign keys)
  await prisma.registroOS.deleteMany();
  await prisma.tipoAtividade.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.setor.deleteMany();
  await prisma.cidade.deleteMany();

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

  // Criar Cidades
  const cidades = [
    { nome: 'Tubarão', estado: 'SC' },
    { nome: 'Laguna', estado: 'SC' },
    { nome: 'Imbituba', estado: 'SC' },
    { nome: 'Gravatal', estado: 'SC' },
    { nome: 'Capivari de Baixo', estado: 'SC' },
    { nome: 'São José', estado: 'SC' },
    { nome: 'Florianópolis', estado: 'SC' },
    { nome: 'Palhoça', estado: 'SC' },
  ];

  const cidadeRecords: any[] = [];
  for (const cidade of cidades) {
    const cidadeRecord = await prisma.cidade.create({
      data: cidade,
    });
    cidadeRecords.push(cidadeRecord);
  }

  console.log('✅ Cidades criadas');

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

  // Criar alguns registros de exemplo com cidades
  const colaboradores = await prisma.colaborador.findMany();
  const tiposAtividade = await prisma.tipoAtividade.findMany();

  // Criar registros de exemplo para diferentes cidades
  const registrosExemplo = [
    {
      colaborador: colaboradores[0], // Alan
      tipoAtividade: tiposAtividade[0], // Instalação
      cidade: cidadeRecords[0], // Tubarão
      quantidade: 5,
      mes: '01',
      ano: '2024',
    },
    {
      colaborador: colaboradores[1], // Páscoa
      tipoAtividade: tiposAtividade[1], // Adequação
      cidade: cidadeRecords[1], // Laguna
      quantidade: 3,
      mes: '01',
      ano: '2024',
    },
    {
      colaborador: colaboradores[2], // Everson
      tipoAtividade: tiposAtividade[2], // Sem Conexão
      cidade: cidadeRecords[2], // Imbituba
      quantidade: 7,
      mes: '01',
      ano: '2024',
    },
    {
      colaborador: colaboradores[0], // Alan
      tipoAtividade: tiposAtividade[0], // Instalação
      cidade: cidadeRecords[0], // Tubarão
      quantidade: 4,
      mes: '02',
      ano: '2024',
    },
    {
      colaborador: colaboradores[3], // Carlos
      tipoAtividade: tiposAtividade[3], // Verificação de Equipamento
      cidade: cidadeRecords[3], // Gravatal
      quantidade: 2,
      mes: '02',
      ano: '2024',
    },
  ];

  for (const registro of registrosExemplo) {
    await prisma.registroOS.create({
      data: {
        setorId: registro.colaborador.setorId,
        colaboradorId: registro.colaborador.id,
        tipoAtividadeId: registro.tipoAtividade.id,
        cidadeId: registro.cidade.id,
        quantidade: registro.quantidade,
        mes: registro.mes,
        ano: registro.ano,
        observacoes: `Registro de exemplo para ${registro.cidade.nome}`,
      },
    });
  }

  console.log('✅ Registros de exemplo criados');

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

