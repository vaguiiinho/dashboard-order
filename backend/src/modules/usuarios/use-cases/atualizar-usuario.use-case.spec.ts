import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AtualizarUsuarioUseCase } from './atualizar-usuario.use-case';
import { IUsuarioRepository } from '../repositories/usuario.repository.interface';
import { UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { Usuario, Grupo } from '../entities';

describe('AtualizarUsuarioUseCase', () => {
  let useCase: AtualizarUsuarioUseCase;
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
    useCase = new AtualizarUsuarioUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);
    const mockUsuarioAtualizado = new Usuario('updated@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    it('should update a usuario successfully', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(mockUsuarioAtualizado);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should update usuario with new group successfully', async () => {
      // Arrange
      const novoGrupo = new Grupo('supervisor', 2);
      const updateDto: UpdateUsuarioDto = {
        grupoId: 2,
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findGrupoById.mockResolvedValue(novoGrupo);
      mockRepository.update.mockResolvedValue(mockUsuarioAtualizado);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(updateDto.grupoId);
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should update multiple fields successfully', async () => {
      // Arrange
      const novoGrupo = new Grupo('supervisor', 2);
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
        senha: 'newPassword123',
        grupoId: 2,
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findGrupoById.mockResolvedValue(novoGrupo);
      mockRepository.update.mockResolvedValue(mockUsuarioAtualizado);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(updateDto.grupoId);
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should throw NotFoundException when usuario does not exist', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists for another user', async () => {
      // Arrange
      const outroUsuario = new Usuario('updated@example.com', 'password', 1, 2, mockGrupo);
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(outroUsuario);

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating email to the same email', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'test@example.com', // mesmo email atual
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.update.mockResolvedValue(mockUsuario);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findByEmail).not.toHaveBeenCalled(); // Não deve verificar email se for o mesmo
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should throw BadRequestException when grupo does not exist', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        grupoId: 999,
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findGrupoById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(updateDto.grupoId);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid id', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      // Act & Assert
      await expect(useCase.execute(0, updateDto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(-1, updateDto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(null as any, updateDto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(undefined as any, updateDto)).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
    });

    it('should handle update repository errors', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should preserve specific exceptions', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'updated@example.com',
      };

      // Test NotFoundException preservation
      mockRepository.findById.mockResolvedValue(null);
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(NotFoundException);

      // Test ConflictException preservation
      const outroUsuario = new Usuario('updated@example.com', 'password', 1, 2, mockGrupo);
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(outroUsuario);
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('input validation', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('test@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(mockUsuario);
    });

    it('should handle empty update dto', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {};

      mockRepository.update.mockResolvedValue(mockUsuario);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });

    it('should handle invalid email format', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'invalid-email',
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.update.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle short password', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        senha: '123',
      };

      mockRepository.update.mockRejectedValue(new Error('Password too short'));

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle invalid grupoId', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        grupoId: 0,
      };

      mockRepository.findGrupoById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('business logic', () => {
    const usuarioId = 1;
    const mockGrupo = new Grupo('admin', 1);
    const mockUsuario = new Usuario('original@example.com', 'hashedPassword', 1, usuarioId, mockGrupo);

    it('should handle partial updates correctly', async () => {
      // Test updating only email
      const emailUpdateDto: UpdateUsuarioDto = { email: 'newemail@example.com' };
      
      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(mockUsuario);

      const result = await useCase.execute(usuarioId, emailUpdateDto);

      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('newemail@example.com');
      expect(mockRepository.findGrupoById).not.toHaveBeenCalled();
    });

    it('should handle concurrent email updates', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        email: 'concurrent@example.com',
      };

      const outroUsuario = new Usuario('concurrent@example.com', 'password', 1, 2, mockGrupo);

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findByEmail.mockResolvedValue(outroUsuario); // Email já existe
      
      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(ConflictException);
    });

    it('should validate grupo existence before update', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        grupoId: 999, // Grupo inexistente
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.findGrupoById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(usuarioId, updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.findGrupoById).toHaveBeenCalledWith(999);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating password without other validations', async () => {
      // Arrange
      const updateDto: UpdateUsuarioDto = {
        senha: 'newSecurePassword123',
      };

      mockRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.update.mockResolvedValue(mockUsuario);

      // Act
      const result = await useCase.execute(usuarioId, updateDto);

      // Assert
      expect(result).toBeInstanceOf(UsuarioResponseDto);
      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockRepository.findGrupoById).not.toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalledWith(usuarioId, updateDto);
    });
  });
});
