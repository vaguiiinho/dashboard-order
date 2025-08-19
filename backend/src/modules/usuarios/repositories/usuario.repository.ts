import { Injectable } from '@nestjs/common';
import { IUsuarioRepository } from './usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';
import { Grupo } from '../entities/grupo.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { PrismaService } from '../../../config/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      include: {
        grupo: true,
      },
    });
    return usuarios.map(user => Usuario.fromData(user));
  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        grupo: true,
      },
    });
    return usuario ? Usuario.fromData(usuario) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        grupo: true,
      },
    });
    return usuario ? Usuario.fromData(usuario) : null;
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);
    
    const usuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
      include: {
        grupo: true,
      },
    });
    return Usuario.fromData(usuario);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const updateData = { ...updateUsuarioDto };
    
    if (updateUsuarioDto.senha) {
      updateData.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
      include: {
        grupo: true,
      },
    });
    return Usuario.fromData(usuario);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({
      where: { id },
    });
  }

  // Métodos de grupo
  async findGrupoById(id: number): Promise<Grupo | null> {
    const grupo = await this.prisma.grupo.findUnique({
      where: { id },
    });
    return grupo ? Grupo.fromData(grupo) : null;
  }

  async findGrupoByNome(nome: string): Promise<Grupo | null> {
    const grupo = await this.prisma.grupo.findUnique({
      where: { nome },
    });
    return grupo ? Grupo.fromData(grupo) : null;
  }

  async createGrupo(grupo: Grupo): Promise<Grupo> {
    const novoGrupo = await this.prisma.grupo.create({
      data: {
        nome: grupo.nome,
        descricao: grupo.descricao,
        ativo: grupo.ativo,
      },
    });
    return Grupo.fromData(novoGrupo);
  }

  async updateGrupo(id: number, grupo: Partial<Grupo>): Promise<Grupo> {
    const updateData: any = {};
    if (grupo.nome !== undefined) updateData.nome = grupo.nome;
    if (grupo.descricao !== undefined) updateData.descricao = grupo.descricao;
    if (grupo.ativo !== undefined) updateData.ativo = grupo.ativo;

    const grupoAtualizado = await this.prisma.grupo.update({
      where: { id },
      data: updateData,
    });
    return Grupo.fromData(grupoAtualizado);
  }

  async deleteGrupo(id: number): Promise<void> {
    await this.prisma.grupo.delete({
      where: { id },
    });
  }

  async listarGrupos(): Promise<Grupo[]> {
    const grupos = await this.prisma.grupo.findMany();
    return grupos.map(grupo => Grupo.fromData(grupo));
  }
}

