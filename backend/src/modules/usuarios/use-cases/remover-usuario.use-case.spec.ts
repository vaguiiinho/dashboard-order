import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RemoverUsuarioUseCase } from './remover-usuario.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { Usuario, Grupo } from '../entities';

describe('RemoverUsuarioUseCase', () => {
  let useCase: RemoverUsuarioUseCase;
  let mockRepository: jest.Mocked<IUsuarioRepository>;

  beforeEach(async () => {
    // Criar mock simples do repositório
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findGrupoById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findGrupoByNome: jest.fn(),
      createGrupo: jest.fn(),
      updateGrupo: jest.fn(),
      deleteGrupo: jest.fn(),
      listarGrupos: jest.fn(),
    };

    // Criar instância do use case diretamente
    useCase = new RemoverUsuarioUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    it('should remove a usuario successfully', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(usuarioId);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });

    it('should throw NotFoundException when usuario does not exist', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid id', async () => {
      // Act & Assert
      await expect(useCase.execute(0)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(-1)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(null as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(undefined as any)).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors gracefully', async () => {
      // Arrange
      mockRepository.findById.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository delete errors gracefully', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockRejectedValue(new Error('Delete operation failed'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });

    it('should preserve NotFoundException when thrown', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should preserve BadRequestException when thrown from validation', async () => {
      // Act & Assert
      await expect(useCase.execute(0)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle foreign key constraint errors', async () => {
      // Arrange - Simular erro de constraint de chave estrangeira
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockRejectedValue(new Error('Foreign key constraint fails'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });

    it('should handle concurrent deletion attempts', async () => {
      // Arrange - Simular usuário que existe na primeira verificação mas é deletado antes da operação
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockRejectedValue(new Error('Record not found'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });
  });

  describe('input validation', () => {
    it('should validate positive integer IDs', async () => {
      // Test boundary values
      await expect(useCase.execute(0)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(-1)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(-999)).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate non-null and non-undefined IDs', async () => {
      await expect(useCase.execute(null as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(undefined as any)).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate numeric IDs', async () => {
      await expect(useCase.execute(NaN)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute('1' as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('business logic', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    it('should handle deletion of usuario with different grupo types', async () => {
      // Test com diferentes tipos de grupo
      const supervisorGrupo = new Grupo('supervisor', 2);
      const supervisorUsuario = new Usuario('supervisor@example.com', 'password', 2, 2, supervisorGrupo);

      mockRepository.findById.mockResolvedValue(supervisorUsuario);
      mockRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(2);

      expect(mockRepository.findById).toHaveBeenCalledWith(2);
      expect(mockRepository.delete).toHaveBeenCalledWith(2);
    });

    it('should not validate business rules beyond existence', async () => {
      // Arrange - Usuario que pode ter relacionamentos
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(usuarioId);

      // Assert - Deve executar sem validações adicionais
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });

    it('should handle very large IDs correctly', async () => {
      // Arrange
      const largeId = 999999999;
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(largeId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(largeId);
    });

    it('should complete successfully without return value', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(usuarioId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });
  });

  describe('error handling', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    it('should convert generic errors to BadRequestException', async () => {
      // Arrange
      mockRepository.findById.mockRejectedValue(new Error('Generic database error'));

      // Act & Assert
      const error = await useCase.execute(usuarioId).catch(e => e);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('Erro ao remover usuário');
      expect(error.message).toContain('Generic database error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      mockRepository.findById.mockRejectedValue(new Error('Connection timeout'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should handle network errors', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.delete.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.delete).toHaveBeenCalledWith(usuarioId);
    });

    it('should provide meaningful error messages', async () => {
      // Arrange
      const customError = new Error('Custom validation failed');
      mockRepository.findById.mockRejectedValue(customError);

      // Act & Assert
      const error = await useCase.execute(usuarioId).catch(e => e);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Erro ao remover usuário: Custom validation failed');
    });
  });
});
