import { Injectable } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }
}

