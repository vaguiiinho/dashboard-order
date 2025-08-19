import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUsuarioRepository } from '../repositories/usuario.repository.interface';

@Injectable()
export class RemoverUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: number): Promise<void> {
    try {
      // Validar se o ID é válido
      if (!id || id <= 0 || typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID do usuário deve ser um número positivo');
      }

      // Verificar se o usuário existe
      const existingUsuario = await this.usuarioRepository.findById(id);
      if (!existingUsuario) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      // Remover o usuário
      await this.usuarioRepository.delete(id);
    } catch (error) {
      // Preservar exceções conhecidas
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      // Converter outros erros em BadRequestException
      throw new BadRequestException(`Erro ao remover usuário: ${error.message}`);
    }
  }
}
