import { Injectable, NotFoundException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class BuscarUsuarioPorIdUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }
}

