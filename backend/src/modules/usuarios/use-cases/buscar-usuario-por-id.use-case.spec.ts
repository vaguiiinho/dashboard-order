import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BuscarUsuarioPorIdUseCase } from './buscar-usuario-por-id.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { Usuario, Grupo } from '../entities';

describe('BuscarUsuarioPorIdUseCase', () => {
  let useCase: BuscarUsuarioPorIdUseCase;
  let mockRepository: jest.Mocked<IUsuarioRepository>;

  beforeEach(async () => {
    // Criar mock simples do repositório
    mockRepository = {
      findByEmail: jest.fn(),
      findGrupoById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findGrupoByNome: jest.fn(),
      createGrupo: jest.fn(),
      updateGrupo: jest.fn(),
      deleteGrupo: jest.fn(),
      listarGrupos: jest.fn(),
    };

    // Criar instância do use case diretamente
    useCase = new BuscarUsuarioPorIdUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'password123', 1, 1, mockGrupo);

    it('should find usuario by id successfully', async () => {
      // Arrange
      const usuarioId = 1;
      mockRepository.findById.mockResolvedValue(mockUsuario);

      // Act
      const result = await useCase.execute(usuarioId);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should throw NotFoundException when usuario does not exist', async () => {
      // Arrange
      const usuarioId = 999;
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const usuarioId = 1;
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should preserve NotFoundException when thrown', async () => {
      // Arrange
      const usuarioId = 999;
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('input validation', () => {
    it('should handle invalid id', async () => {
      const invalidId = 0;

      await expect(useCase.execute(invalidId)).rejects.toThrow();
    });

    it('should handle negative id', async () => {
      const negativeId = -1;

      await expect(useCase.execute(negativeId)).rejects.toThrow();
    });
  });

  describe('business logic', () => {
    it('should return usuario with correct data', async () => {
      const usuarioId = 1;
      const mockGrupo = new Grupo('supervisor', 2);
      const mockUsuario = new Usuario('user@example.com', 'password123', 2, 1, mockGrupo);

      mockRepository.findById.mockResolvedValue(mockUsuario);

      const result = await useCase.execute(usuarioId);

      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(result.email).toBe('user@example.com');
      expect(result.grupoId).toBe(2);
    });
  });
});
