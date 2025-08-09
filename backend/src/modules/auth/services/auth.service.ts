import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidarUsuarioUseCase } from '../use-cases/validar-usuario.use-case';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly validarUsuarioUseCase: ValidarUsuarioUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<Usuario | null> {
    return this.validarUsuarioUseCase.execute(email, senha);
  }

  async login(usuario: Usuario) {
    const payload = { 
      email: usuario.email, 
      sub: usuario.id,
      grupoId: usuario.grupoId,
      grupo: usuario.grupo?.nome
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        grupoId: usuario.grupoId,
        grupo: usuario.grupo,
      },
    };
  }
}

