import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CriarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    try {
      // Verificar se o email já existe
      const existingUser = await this.usuarioRepository.findByEmail(createUsuarioDto.email);
      
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }

      // Verificar se o grupo existe
      const grupo = await this.usuarioRepository.findGrupoById(createUsuarioDto.grupoId);
      if (!grupo) {
        throw new BadRequestException('Grupo não encontrado');
      }

      // Criptografar a senha
      const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha, 10);

      // Criar a entidade Usuario
      const usuario = new Usuario(
        createUsuarioDto.email,
        senhaCriptografada,
        createUsuarioDto.grupoId
      );

      // Salvar no repositório
      const usuarioSalvo = await this.usuarioRepository.create(usuario);

      // Retornar DTO de resposta
      return new UsuarioResponseDto(usuarioSalvo);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar usuário: ' + error.message);
    }
  }
}

