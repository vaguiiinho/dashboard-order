import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../users/repositories/user.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';

export interface LoginResult {
  user: UserEntity;
  access_token: string;
  expires_in: number;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResult> {
    const { email, password } = loginDto;

    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = 3600; // 1 hora

    // Retornar dados do usuário (sem senha) e token
    const userEntity = new UserEntity(user);

    return {
      user: userEntity,
      access_token,
      expires_in,
    };
  }
}
