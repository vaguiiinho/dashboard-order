import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistroOSDto } from './dto/create-registro-os.dto';

@Injectable()
export class OrdemServicoService {
  constructor(private prisma: PrismaService) {}

  // Buscar todos os setores
  async findAllSetores() {
    return this.prisma.setor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  // Buscar colaboradores por setor
  async findColaboradoresBySetor(setorNome: string) {
    const setor = await this.prisma.setor.findUnique({
      where: { nome: setorNome },
    });

    if (!setor) {
      throw new NotFoundException(`Setor ${setorNome} não encontrado`);
    }

    return this.prisma.colaborador.findMany({
      where: {
        setorId: setor.id,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  // Buscar tipos de atividade por setor
  async findTiposAtividadeBySetor(setorNome: string) {
    const setor = await this.prisma.setor.findUnique({
      where: { nome: setorNome },
    });

    if (!setor) {
      throw new NotFoundException(`Setor ${setorNome} não encontrado`);
    }

    return this.prisma.tipoAtividade.findMany({
      where: {
        setorId: setor.id,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  // Criar um único registro
  async createRegistro(dto: CreateRegistroOSDto) {
    // Buscar setor
    const setor = await this.prisma.setor.findUnique({
      where: { nome: dto.setor },
    });

    if (!setor) {
      throw new NotFoundException(`Setor ${dto.setor} não encontrado`);
    }

    // Buscar colaborador
    const colaborador = await this.prisma.colaborador.findFirst({
      where: {
        nome: dto.colaborador,
        setorId: setor.id,
      },
    });

    if (!colaborador) {
      throw new NotFoundException(
        `Colaborador ${dto.colaborador} não encontrado no setor ${dto.setor}`,
      );
    }

    // Buscar tipo de atividade
    const tipoAtividade = await this.prisma.tipoAtividade.findFirst({
      where: {
        nome: dto.tipoAtividade,
        setorId: setor.id,
      },
    });

    if (!tipoAtividade) {
      throw new NotFoundException(
        `Tipo de atividade ${dto.tipoAtividade} não encontrado no setor ${dto.setor}`,
      );
    }

    // Criar registro
    return this.prisma.registroOS.create({
      data: {
        setorId: setor.id,
        colaboradorId: colaborador.id,
        tipoAtividadeId: tipoAtividade.id,
        quantidade: dto.quantidade,
        mes: dto.mes,
        ano: dto.ano,
        observacoes: dto.observacoes,
      },
      include: {
        setor: true,
        colaborador: true,
        tipoAtividade: true,
      },
    });
  }

  // Criar múltiplos registros
  async createMultipleRegistros(registros: CreateRegistroOSDto[]) {
    const created: Awaited<ReturnType<typeof this.createRegistro>>[] = [];

    for (const dto of registros) {
      try {
        const registro = await this.createRegistro(dto);
        created.push(registro);
      } catch (error) {
        throw new BadRequestException(
          `Erro ao criar registro: ${error.message}`,
        );
      }
    }

    return created;
  }

  // Buscar todos os registros com filtros opcionais
  async findAllRegistros(filters?: {
    mes?: string;
    ano?: string;
    setorNome?: string;
  }) {
    const where: any = {};

    if (filters?.mes) {
      where.mes = filters.mes;
    }

    if (filters?.ano) {
      where.ano = filters.ano;
    }

    if (filters?.setorNome) {
      const setor = await this.prisma.setor.findUnique({
        where: { nome: filters.setorNome },
      });
      if (setor) {
        where.setorId = setor.id;
      }
    }

    return this.prisma.registroOS.findMany({
      where,
      include: {
        setor: true,
        colaborador: true,
        tipoAtividade: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Gerar relatório (estatísticas)
  async gerarRelatorio(filters?: { mes?: string; ano?: string }) {
    const registros = await this.findAllRegistros(filters);

    // Calcular estatísticas
    const totalGeral = registros.reduce((acc, r) => acc + r.quantidade, 0);

    const totalPorSetor = registros.reduce(
      (acc, r) => {
        const setorNome = r.setor.nome;
        acc[setorNome] = (acc[setorNome] || 0) + r.quantidade;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalPorColaborador = registros.reduce(
      (acc, r) => {
        const colaboradorNome = r.colaborador.nome;
        acc[colaboradorNome] = (acc[colaboradorNome] || 0) + r.quantidade;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalPorTipo = registros.reduce(
      (acc, r) => {
        const tipoNome = r.tipoAtividade.nome;
        acc[tipoNome] = (acc[tipoNome] || 0) + r.quantidade;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalGeral,
      totalPorSetor,
      totalPorColaborador,
      totalPorTipo,
      registros,
    };
  }

  // Deletar um registro
  async deleteRegistro(id: string) {
    const registro = await this.prisma.registroOS.findUnique({
      where: { id },
    });

    if (!registro) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.prisma.registroOS.delete({
      where: { id },
    });
  }
}

