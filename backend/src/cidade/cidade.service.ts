import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCidadeDto, UpdateCidadeDto } from './dto/cidade.dto';

@Injectable()
export class CidadeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cidade.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async create(dto: CreateCidadeDto) {
    return this.prisma.cidade.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateCidadeDto) {
    const cidade = await this.prisma.cidade.findUnique({
      where: { id },
    });

    if (!cidade) {
      throw new NotFoundException('Cidade não encontrada');
    }

    return this.prisma.cidade.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const cidade = await this.prisma.cidade.findUnique({
      where: { id },
    });

    if (!cidade) {
      throw new NotFoundException('Cidade não encontrada');
    }

    await this.prisma.cidade.delete({
      where: { id },
    });
  }
}
