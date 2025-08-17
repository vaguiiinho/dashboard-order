import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { CriarUsuarioUseCase } from './criar-usuario.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { Usuario, Grupo } from '../entities';

describe('CriarUsuarioUseCase', () => {
  let useCase: CriarUsuarioUseCase;
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
    useCase = new CriarUsuarioUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validDto: CreateUsuarioDto = {
      email: 'test@example.com',
      senha: 'password123',
      grupoId: 1,
    };

    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, 1, mockGrupo);

    it('should create a usuario successfully', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(mockGrupo);
      mockRepository.create.mockResolvedValue(mockUsuario);

      // Act
      const result = await useCase.execute(validDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(validDto.grupoId);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const existingUsuario = new Usuario('test@example.com', 'password123', 1, 1);
      mockRepository.findByEmail.mockResolvedValue(existingUsuario);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when grupo does not exist', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(validDto.grupoId);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockRepository.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
    });

    it('should handle grupo validation errors', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockRejectedValue(new Error('Grupo validation error'));

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(validDto.grupoId);
    });

    it('should handle create repository errors', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(mockGrupo);
      mockRepository.create.mockRejectedValue(new Error('Create failed'));

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(validDto.grupoId);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should preserve ConflictException when thrown', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(mockUsuario);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validDto.email);
    });

    it('should preserve BadRequestException when thrown', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('input validation', () => {
    it('should handle empty email', async () => {
      const invalidDto: CreateUsuarioDto = {
        email: '',
        senha: 'password123',
        grupoId: 1,
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });

    it('should handle invalid email format', async () => {
      const invalidDto: CreateUsuarioDto = {
        email: 'invalid-email',
        senha: 'password123',
        grupoId: 1,
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });

    it('should handle short password', async () => {
      const invalidDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: '123',
        grupoId: 1,
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });

    it('should handle invalid grupoId', async () => {
      const invalidDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 0,
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });
  });

  describe('business logic', () => {
    it('should create usuario with correct data', async () => {
      const dto: CreateUsuarioDto = {
        email: 'newuser@example.com',
        senha: 'newpassword123',
        grupoId: 2,
      };

      const mockGrupo = new Grupo('supervisor', 2);
      const mockUsuario = new Usuario('newuser@example.com', 'hashedPassword', 2, 1, mockGrupo);

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(mockGrupo);
      mockRepository.create.mockResolvedValue(mockUsuario);

      const result = await useCase.execute(dto);

      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(result.email).toBe('newuser@example.com');
      expect(result.grupoId).toBe(2);
    });

    it('should handle multiple concurrent requests for same email', async () => {
      const dto: CreateUsuarioDto = {
        email: 'concurrent@example.com',
        senha: 'password123',
        grupoId: 1,
      };

      const mockGrupo = new Grupo('admin', 1);

      // Simular que o email foi criado entre as verificações
      mockRepository.findByEmail
        .mockResolvedValueOnce(null) // Primeira verificação
        .mockResolvedValueOnce(new Usuario('concurrent@example.com', 'password123', 1)); // Segunda verificação

      mockRepository.findGrupoById.mockResolvedValue(mockGrupo);
      mockRepository.create.mockRejectedValue(new Error('Duplicate entry'));

      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
