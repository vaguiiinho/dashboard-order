import { Injectable } from '@nestjs/common';
import type { IUsuarioRepository } from '../../usuarios/repositories/usuario.repository.interface';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ValidarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    
    if (!usuario) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return null;
    }

    // Remover a senha do objeto retornado
    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha as Usuario;
  }
}

