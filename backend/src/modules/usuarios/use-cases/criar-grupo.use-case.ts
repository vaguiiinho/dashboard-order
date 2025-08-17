import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { CreateGrupoDto } from '../dto/create-usuario.dto';
import { GrupoResponseDto } from '../dto/usuario-response.dto';
import { Grupo } from '../entities/grupo.entity';

@Injectable()
export class CriarGrupoUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(createGrupoDto: CreateGrupoDto): Promise<GrupoResponseDto> {
    try {
      // Verificar se o nome do grupo já existe
      const existingGrupo = await this.usuarioRepository.findGrupoByNome(createGrupoDto.nome);
      
      if (existingGrupo) {
        throw new ConflictException('Nome do grupo já está em uso');
      }

      // Criar a entidade Grupo
      const grupo = new Grupo(createGrupoDto.nome);

      // Salvar no repositório
      const grupoSalvo = await this.usuarioRepository.createGrupo(grupo);

      // Retornar DTO de resposta
      return new GrupoResponseDto(grupoSalvo);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar grupo: ' + error.message);
    }
  }
}
