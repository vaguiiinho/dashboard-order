import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { CriarGrupoUseCase } from './criar-grupo.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { CreateGrupoDto } from '../dto/create-usuario.dto';
import { GrupoResponseDto } from '../dto/usuario-response.dto';
import { Grupo } from '../entities';

describe('CriarGrupoUseCase', () => {
  let useCase: CriarGrupoUseCase;
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
    useCase = new CriarGrupoUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validDto: CreateGrupoDto = {
      nome: 'admin',
    };

    const mockGrupo = new Grupo('admin', 1);

    it('should create a grupo successfully', async () => {
      // Arrange
      mockRepository.findGrupoByNome.mockResolvedValue(null);
      mockRepository.createGrupo.mockResolvedValue(mockGrupo);

      // Act
      const result = await useCase.execute(validDto);

      // Assert
      expect(result).toBeInstanceOf(GrupoResponseDto);
      expect(result.nome).toBe('admin');
      expect(mockRepository.findGrupoByNome).toHaveBeenCalledWith(validDto.nome);
      expect(mockRepository.createGrupo).toHaveBeenCalled();
    });

    it('should throw ConflictException when nome already exists', async () => {
      // Arrange
      const existingGrupo = new Grupo('admin', 1);
      mockRepository.findGrupoByNome.mockResolvedValue(existingGrupo);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findGrupoByNome).toHaveBeenCalledWith(validDto.nome);
      expect(mockRepository.createGrupo).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockRepository.findGrupoByNome.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findGrupoByNome).toHaveBeenCalledWith(validDto.nome);
    });

    it('should handle create repository errors', async () => {
      // Arrange
      mockRepository.findGrupoByNome.mockResolvedValue(null);
      mockRepository.createGrupo.mockRejectedValue(new Error('Create failed'));

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findGrupoByNome).toHaveBeenCalledWith(validDto.nome);
      expect(mockRepository.createGrupo).toHaveBeenCalled();
    });

    it('should preserve ConflictException when thrown', async () => {
      // Arrange
      const existingGrupo = new Grupo('admin', 1);
      mockRepository.findGrupoByNome.mockResolvedValue(existingGrupo);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findGrupoByNome).toHaveBeenCalledWith(validDto.nome);
    });
  });

  describe('input validation', () => {
    it('should handle empty nome', async () => {
      const invalidDto: CreateGrupoDto = {
        nome: '',
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });

    it('should handle short nome', async () => {
      const invalidDto: CreateGrupoDto = {
        nome: 'a',
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });

    it('should handle nome with only spaces', async () => {
      const invalidDto: CreateGrupoDto = {
        nome: '   ',
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });
  });

  describe('business logic', () => {
    it('should create grupo with correct data', async () => {
      const dto: CreateGrupoDto = {
        nome: 'supervisor',
      };

      const mockGrupo = new Grupo('supervisor', 1);

      mockRepository.findGrupoByNome.mockResolvedValue(null);
      mockRepository.createGrupo.mockResolvedValue(mockGrupo);

      const result = await useCase.execute(dto);

      expect(result).toBeInstanceOf(GrupoResponseDto);
      expect(result.nome).toBe('supervisor');
    });

    it('should handle multiple concurrent requests for same nome', async () => {
      const dto: CreateGrupoDto = {
        nome: 'concurrent',
      };

      // Simular que o nome foi criado entre as verificações
      mockRepository.findGrupoByNome
        .mockResolvedValueOnce(null) // Primeira verificação
        .mockResolvedValueOnce(new Grupo('concurrent', 1)); // Segunda verificação

      mockRepository.createGrupo.mockRejectedValue(new Error('Duplicate entry'));

      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle different case sensitivity', async () => {
      const dto: CreateGrupoDto = {
        nome: 'Admin',
      };

      const existingGrupo = new Grupo('admin', 1);
      mockRepository.findGrupoByNome.mockResolvedValue(existingGrupo);

      await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('edge cases', () => {
    it('should handle very long nome', async () => {
      const longNome = 'a'.repeat(1000);
      const dto: CreateGrupoDto = {
        nome: longNome,
      };

      const mockGrupo = new Grupo(longNome, 1);

      mockRepository.findGrupoByNome.mockResolvedValue(null);
      mockRepository.createGrupo.mockResolvedValue(mockGrupo);

      const result = await useCase.execute(dto);

      expect(result).toBeInstanceOf(GrupoResponseDto);
      expect(result.nome).toBe(longNome);
    });

    it('should handle special characters in nome', async () => {
      const dto: CreateGrupoDto = {
        nome: 'grupo-especial_123',
      };

      const mockGrupo = new Grupo('grupo-especial_123', 1);

      mockRepository.findGrupoByNome.mockResolvedValue(null);
      mockRepository.createGrupo.mockResolvedValue(mockGrupo);

      const result = await useCase.execute(dto);

      expect(result).toBeInstanceOf(GrupoResponseDto);
      expect(result.nome).toBe('grupo-especial_123');
    });
  });
});
