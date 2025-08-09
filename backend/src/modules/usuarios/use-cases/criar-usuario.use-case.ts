import { Injectable, ConflictException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class CriarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar se o email já existe
    const existingUser = await this.usuarioRepository.findByEmail(createUsuarioDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criar o usuário
    return this.usuarioRepository.create(createUsuarioDto);
  }
}

