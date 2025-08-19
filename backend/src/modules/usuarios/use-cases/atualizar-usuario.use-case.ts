import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';

@Injectable()
export class AtualizarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    try {
      // Validar se o ID é válido
      if (!id || id <= 0) {
        throw new BadRequestException('ID do usuário deve ser um número positivo');
      }

      // Verificar se o usuário existe
      const existingUsuario = await this.usuarioRepository.findById(id);
      if (!existingUsuario) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      // Se estiver atualizando o email, verificar se não existe outro usuário com o mesmo email
      if (updateUsuarioDto.email && updateUsuarioDto.email !== existingUsuario.email) {
        const usuarioComEmail = await this.usuarioRepository.findByEmail(updateUsuarioDto.email);
        if (usuarioComEmail) {
          throw new ConflictException('Este email já está sendo usado por outro usuário');
        }
      }

      // Se estiver atualizando o grupo, verificar se o grupo existe
      if (updateUsuarioDto.grupoId) {
        const grupo = await this.usuarioRepository.findGrupoById(updateUsuarioDto.grupoId);
        if (!grupo) {
          throw new BadRequestException(`Grupo com ID ${updateUsuarioDto.grupoId} não encontrado`);
        }
      }

      // Atualizar o usuário
      const usuarioAtualizado = await this.usuarioRepository.update(id, updateUsuarioDto);
      
      return new UsuarioResponseDto(usuarioAtualizado);
    } catch (error) {
      // Preservar exceções conhecidas
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      // Converter outros erros em BadRequestException
      throw new BadRequestException(`Erro ao atualizar usuário: ${error.message}`);
    }
  }
}
