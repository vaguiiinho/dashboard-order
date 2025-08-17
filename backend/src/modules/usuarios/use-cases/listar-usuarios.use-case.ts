import { Injectable, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioListResponseDto } from '../dto/usuario-response.dto';

@Injectable()
export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<UsuarioListResponseDto> {
    try {
      const usuarios = await this.usuarioRepository.findAll();
      
      return new UsuarioListResponseDto(
        usuarios.map(usuario => ({
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
        })),
        usuarios.length,
        1,
        usuarios.length
      );
    } catch (error) {
      throw new BadRequestException('Erro ao listar usuários');
    }
  }
}

