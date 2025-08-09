import { Injectable } from '@nestjs/common';
import { IUsuarioRepository } from './usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { PrismaService } from '../../../config/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      include: {
        grupo: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        grupo: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        grupo: true,
      },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);
    
    return this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
      include: {
        grupo: true,
      },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const updateData = { ...updateUsuarioDto };
    
    if (updateUsuarioDto.senha) {
      updateData.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
      include: {
        grupo: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({
      where: { id },
    });
  }
}

