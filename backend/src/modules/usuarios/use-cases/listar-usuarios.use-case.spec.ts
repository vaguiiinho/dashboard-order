import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ListarUsuariosUseCase } from './listar-usuarios.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { UsuarioListResponseDto } from '../dto/usuario-response.dto';
import { Usuario, Grupo } from '../entities';

describe('ListarUsuariosUseCase', () => {
  let useCase: ListarUsuariosUseCase;
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
    useCase = new ListarUsuariosUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuarios = [
      new Usuario('user1@example.com', 'password123', 1, 1, mockGrupo),
      new Usuario('user2@example.com', 'password123', 1, 2, mockGrupo),
    ];

    it('should list all usuarios successfully', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(mockUsuarios);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeInstanceOf(UsuarioListResponseDto);
      expect(result.usuarios).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty list when no usuarios exist', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeInstanceOf(UsuarioListResponseDto);
      expect(result.usuarios).toHaveLength(0);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(BadRequestException);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return usuarios with correct data', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(mockUsuarios);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.usuarios[0].email).toBe('user1@example.com');
      expect(result.usuarios[1].email).toBe('user2@example.com');
      expect(result.usuarios[0].grupoId).toBe(1);
      expect(result.usuarios[1].grupoId).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle single usuario', async () => {
      const mockGrupo = new Grupo('admin', 1);
      const mockUsuario = new Usuario('user@example.com', 'password123', 1, 1, mockGrupo);

      mockRepository.findAll.mockResolvedValue([mockUsuario]);

      const result = await useCase.execute();

      expect(result.usuarios).toHaveLength(1);
      expect(result.usuarios[0].email).toBe('user@example.com');
    });

    it('should handle large number of usuarios', async () => {
      const mockGrupo = new Grupo('admin', 1);
      const mockUsuarios = Array.from({ length: 100 }, (_, i) => 
        new Usuario(`user${i}@example.com`, 'password123', 1, i + 1, mockGrupo)
      );

      mockRepository.findAll.mockResolvedValue(mockUsuarios);

      const result = await useCase.execute();

      expect(result.usuarios).toHaveLength(100);
      expect(result.usuarios[0].email).toBe('user0@example.com');
      expect(result.usuarios[99].email).toBe('user99@example.com');
    });
  });
});
