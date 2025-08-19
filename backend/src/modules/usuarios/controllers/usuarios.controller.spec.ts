import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { UsuariosController } from './usuarios.controller';
import { CriarUsuarioUseCase } from '../use-cases/criar-usuario.use-case';
import { ListarUsuariosUseCase } from '../use-cases/listar-usuarios.use-case';
import { BuscarUsuarioPorIdUseCase } from '../use-cases/buscar-usuario-por-id.use-case';
import { AtualizarUsuarioUseCase } from '../use-cases/atualizar-usuario.use-case';
import { RemoverUsuarioUseCase } from '../use-cases/remover-usuario.use-case';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsuariosController', () => {
  let app: INestApplication;
  let controller: UsuariosController;
  let mockCriarUsuarioUseCase: jest.Mocked<CriarUsuarioUseCase>;
  let mockListarUsuariosUseCase: jest.Mocked<ListarUsuariosUseCase>;
  let mockBuscarUsuarioPorIdUseCase: jest.Mocked<BuscarUsuarioPorIdUseCase>;
  let mockAtualizarUsuarioUseCase: jest.Mocked<AtualizarUsuarioUseCase>;
  let mockRemoverUsuarioUseCase: jest.Mocked<RemoverUsuarioUseCase>;
  let jwtToken: string;

  beforeAll(async () => {
    // Create mocks for use cases
    mockCriarUsuarioUseCase = {
      execute: jest.fn(),
    } as any;

    mockListarUsuariosUseCase = {
      execute: jest.fn(),
    } as any;

    mockBuscarUsuarioPorIdUseCase = {
      execute: jest.fn(),
    } as any;

    mockAtualizarUsuarioUseCase = {
      execute: jest.fn(),
    } as any;

    mockRemoverUsuarioUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: CriarUsuarioUseCase,
          useValue: mockCriarUsuarioUseCase,
        },
        {
          provide: ListarUsuariosUseCase,
          useValue: mockListarUsuariosUseCase,
        },
        {
          provide: BuscarUsuarioPorIdUseCase,
          useValue: mockBuscarUsuarioPorIdUseCase,
        },
        {
          provide: AtualizarUsuarioUseCase,
          useValue: mockAtualizarUsuarioUseCase,
        },
        {
          provide: RemoverUsuarioUseCase,
          useValue: mockRemoverUsuarioUseCase,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ userId: 1, email: 'admin@test.com' }),
          },
        },
      ],
    })
      .overrideGuard(require('../../auth/guards/jwt-auth.guard').JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UsuariosController>(UsuariosController);
    jwtToken = 'Bearer mock-jwt-token';
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /usuarios (create)', () => {
    const createDto: CreateUsuarioDto = {
      email: 'test@example.com',
      senha: 'password123',
      grupoId: 1,
    };

    const mockResponse: UsuarioResponseDto = {
      id: 1,
      email: 'test@example.com',
      grupoId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new usuario', async () => {
      // Arrange
      mockCriarUsuarioUseCase.execute.mockResolvedValue(mockResponse);

      // Act & Assert
      return request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', jwtToken)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
          expect(mockCriarUsuarioUseCase.execute).toHaveBeenCalledWith(createDto);
        });
    });

    it('should return 409 when email already exists', async () => {
      // Arrange
      mockCriarUsuarioUseCase.execute.mockRejectedValue(
        new ConflictException('Email já está em uso')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', jwtToken)
        .send(createDto)
        .expect(409);
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidDto = {
        email: 'invalid-email',
        senha: '123',
        grupoId: 'invalid',
      };

      // Act & Assert
      return request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', jwtToken)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .post('/usuarios')
        .send(createDto)
        .expect(401);
    });
  });

  describe('GET /usuarios (findAll)', () => {
    const mockUsuarios: UsuarioResponseDto[] = [
      {
        id: 1,
        email: 'user1@example.com',
        grupoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        email: 'user2@example.com',
        grupoId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all usuarios', async () => {
      // Arrange
      mockListarUsuariosUseCase.execute.mockResolvedValue(mockUsuarios);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUsuarios);
          expect(mockListarUsuariosUseCase.execute).toHaveBeenCalled();
        });
    });

    it('should return empty array when no usuarios exist', async () => {
      // Arrange
      mockListarUsuariosUseCase.execute.mockResolvedValue([]);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios')
        .expect(401);
    });
  });

  describe('GET /usuarios/:id (findOne)', () => {
    const mockUsuario: UsuarioResponseDto = {
      id: 1,
      email: 'test@example.com',
      grupoId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return usuario by id', async () => {
      // Arrange
      mockBuscarUsuarioPorIdUseCase.execute.mockResolvedValue(mockUsuario);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios/1')
        .set('Authorization', jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUsuario);
          expect(mockBuscarUsuarioPorIdUseCase.execute).toHaveBeenCalledWith(1);
        });
    });

    it('should return 404 when usuario not found', async () => {
      // Arrange
      mockBuscarUsuarioPorIdUseCase.execute.mockRejectedValue(
        new NotFoundException('Usuário não encontrado')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios/999')
        .set('Authorization', jwtToken)
        .expect(404);
    });

    it('should return 400 for invalid id format', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios/invalid')
        .set('Authorization', jwtToken)
        .expect(400);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .get('/usuarios/1')
        .expect(401);
    });
  });

  describe('PATCH /usuarios/:id (update)', () => {
    const updateDto: UpdateUsuarioDto = {
      email: 'updated@example.com',
    };

    const mockUpdatedUsuario: UsuarioResponseDto = {
      id: 1,
      email: 'updated@example.com',
      grupoId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update usuario successfully', async () => {
      // Arrange
      mockAtualizarUsuarioUseCase.execute.mockResolvedValue(mockUpdatedUsuario);

      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/1')
        .set('Authorization', jwtToken)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUpdatedUsuario);
          expect(mockAtualizarUsuarioUseCase.execute).toHaveBeenCalledWith(1, updateDto);
        });
    });

    it('should return 404 when usuario not found', async () => {
      // Arrange
      mockAtualizarUsuarioUseCase.execute.mockRejectedValue(
        new NotFoundException('Usuário não encontrado')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/999')
        .set('Authorization', jwtToken)
        .send(updateDto)
        .expect(404);
    });

    it('should return 409 when email already exists', async () => {
      // Arrange
      mockAtualizarUsuarioUseCase.execute.mockRejectedValue(
        new ConflictException('Este email já está sendo usado por outro usuário')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/1')
        .set('Authorization', jwtToken)
        .send(updateDto)
        .expect(409);
    });

    it('should return 400 for invalid id format', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/invalid')
        .set('Authorization', jwtToken)
        .send(updateDto)
        .expect(400);
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidDto = {
        email: 'invalid-email',
        grupoId: 'invalid',
      };

      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/1')
        .set('Authorization', jwtToken)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .patch('/usuarios/1')
        .send(updateDto)
        .expect(401);
    });
  });

  describe('DELETE /usuarios/:id (remove)', () => {
    it('should delete usuario successfully', async () => {
      // Arrange
      mockRemoverUsuarioUseCase.execute.mockResolvedValue(undefined);

      // Act & Assert
      return request(app.getHttpServer())
        .delete('/usuarios/1')
        .set('Authorization', jwtToken)
        .expect(200)
        .expect((res) => {
          expect(mockRemoverUsuarioUseCase.execute).toHaveBeenCalledWith(1);
        });
    });

    it('should return 404 when usuario not found', async () => {
      // Arrange
      mockRemoverUsuarioUseCase.execute.mockRejectedValue(
        new NotFoundException('Usuário não encontrado')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .delete('/usuarios/999')
        .set('Authorization', jwtToken)
        .expect(404);
    });

    it('should return 400 for invalid id format', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .delete('/usuarios/invalid')
        .set('Authorization', jwtToken)
        .expect(400);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      return request(app.getHttpServer())
        .delete('/usuarios/1')
        .expect(401);
    });

    it('should handle business rule violations', async () => {
      // Arrange
      mockRemoverUsuarioUseCase.execute.mockRejectedValue(
        new BadRequestException('Usuário não pode ser removido pois possui relacionamentos')
      );

      // Act & Assert
      return request(app.getHttpServer())
        .delete('/usuarios/1')
        .set('Authorization', jwtToken)
        .expect(400);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete CRUD operations flow', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'integration@example.com',
        senha: 'password123',
        grupoId: 1,
      };

      const createdUsuario: UsuarioResponseDto = {
        id: 10,
        email: 'integration@example.com',
        grupoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateUsuarioDto = {
        email: 'updated-integration@example.com',
      };

      const updatedUsuario: UsuarioResponseDto = {
        ...createdUsuario,
        email: 'updated-integration@example.com',
      };

      // Mock the use cases
      mockCriarUsuarioUseCase.execute.mockResolvedValue(createdUsuario);
      mockBuscarUsuarioPorIdUseCase.execute.mockResolvedValue(createdUsuario);
      mockAtualizarUsuarioUseCase.execute.mockResolvedValue(updatedUsuario);
      mockRemoverUsuarioUseCase.execute.mockResolvedValue(undefined);

      // 1. Create
      await request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', jwtToken)
        .send(createDto)
        .expect(201);

      // 2. Read
      await request(app.getHttpServer())
        .get('/usuarios/10')
        .set('Authorization', jwtToken)
        .expect(200);

      // 3. Update
      await request(app.getHttpServer())
        .patch('/usuarios/10')
        .set('Authorization', jwtToken)
        .send(updateDto)
        .expect(200);

      // 4. Delete
      await request(app.getHttpServer())
        .delete('/usuarios/10')
        .set('Authorization', jwtToken)
        .expect(200);

      // Verify all use cases were called
      expect(mockCriarUsuarioUseCase.execute).toHaveBeenCalledWith(createDto);
      expect(mockBuscarUsuarioPorIdUseCase.execute).toHaveBeenCalledWith(10);
      expect(mockAtualizarUsuarioUseCase.execute).toHaveBeenCalledWith(10, updateDto);
      expect(mockRemoverUsuarioUseCase.execute).toHaveBeenCalledWith(10);
    });

    it('should handle concurrent operations', async () => {
      const usuario1: UsuarioResponseDto = {
        id: 1,
        email: 'user1@example.com',
        grupoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const usuario2: UsuarioResponseDto = {
        id: 2,
        email: 'user2@example.com',
        grupoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBuscarUsuarioPorIdUseCase.execute
        .mockResolvedValueOnce(usuario1)
        .mockResolvedValueOnce(usuario2);

      // Make concurrent requests
      const promises = [
        request(app.getHttpServer())
          .get('/usuarios/1')
          .set('Authorization', jwtToken),
        request(app.getHttpServer())
          .get('/usuarios/2')
          .set('Authorization', jwtToken),
      ];

      const responses = await Promise.all(promises);

      expect(responses[0].status).toBe(200);
      expect(responses[1].status).toBe(200);
      expect(mockBuscarUsuarioPorIdUseCase.execute).toHaveBeenCalledTimes(2);
    });
  });
});
