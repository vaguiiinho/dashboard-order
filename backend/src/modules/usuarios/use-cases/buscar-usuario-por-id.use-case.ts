import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';

@Injectable()
export class BuscarUsuarioPorIdUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: number): Promise<UsuarioResponseDto> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID inválido');
      }

      const usuario = await this.usuarioRepository.findById(id);
      
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return new UsuarioResponseDto({
        id: usuario.id,
        email: usuario.email,
        grupoId: usuario.grupoId,
        grupo: usuario.grupo ? {
          id: usuario.grupo.id,
          nome: usuario.grupo.nome,
          descricao: usuario.grupo.descricao,
          ativo: usuario.grupo.ativo,
          createdAt: usuario.grupo.createdAt,
          updatedAt: usuario.grupo.updatedAt
        } : undefined,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar usuário');
    }
  }
}

