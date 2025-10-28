import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSetorDto, UpdateSetorDto } from './dto/setor.dto';

@Injectable()
export class SetorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setor.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async create(dto: CreateSetorDto) {
    return this.prisma.setor.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateSetorDto) {
    const setor = await this.prisma.setor.findUnique({
      where: { id },
    });

    if (!setor) {
      throw new NotFoundException('Setor não encontrado');
    }

    return this.prisma.setor.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const setor = await this.prisma.setor.findUnique({
      where: { id },
    });

    if (!setor) {
      throw new NotFoundException('Setor não encontrado');
    }

    await this.prisma.setor.delete({
      where: { id },
    });
  }
}
