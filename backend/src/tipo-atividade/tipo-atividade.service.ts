import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoAtividadeDto, UpdateTipoAtividadeDto } from './dto/tipo-atividade.dto';

@Injectable()
export class TipoAtividadeService {
  constructor(private prisma: PrismaService) {}

  async findBySetor(setorNome: string) {
    return this.prisma.tipoAtividade.findMany({
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

  async create(dto: CreateTipoAtividadeDto) {
    return this.prisma.tipoAtividade.create({
      data: dto,
      include: {
        setor: true,
      },
    });
  }

  async update(id: string, dto: UpdateTipoAtividadeDto) {
    const tipoAtividade = await this.prisma.tipoAtividade.findUnique({
      where: { id },
    });

    if (!tipoAtividade) {
      throw new NotFoundException('Tipo de atividade não encontrado');
    }

    return this.prisma.tipoAtividade.update({
      where: { id },
      data: dto,
      include: {
        setor: true,
      },
    });
  }

  async delete(id: string) {
    const tipoAtividade = await this.prisma.tipoAtividade.findUnique({
      where: { id },
    });

    if (!tipoAtividade) {
      throw new NotFoundException('Tipo de atividade não encontrado');
    }

    await this.prisma.tipoAtividade.delete({
      where: { id },
    });
  }
}
