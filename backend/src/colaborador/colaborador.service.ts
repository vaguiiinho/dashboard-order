import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColaboradorDto, UpdateColaboradorDto } from './dto/colaborador.dto';

@Injectable()
export class ColaboradorService {
  constructor(private prisma: PrismaService) {}

  async findBySetor(setorNome: string) {
    return this.prisma.colaborador.findMany({
      where: {
        setor: {
          nome: setorNome,
        },
        ativo: true,
      },
      include: {
        setor: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async create(dto: CreateColaboradorDto) {
    return this.prisma.colaborador.create({
      data: dto,
      include: {
        setor: true,
      },
    });
  }

  async update(id: string, dto: UpdateColaboradorDto) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
    });

    if (!colaborador) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    return this.prisma.colaborador.update({
      where: { id },
      data: dto,
      include: {
        setor: true,
      },
    });
  }

  async delete(id: string) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
    });

    if (!colaborador) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    await this.prisma.colaborador.delete({
      where: { id },
    });
  }
}
