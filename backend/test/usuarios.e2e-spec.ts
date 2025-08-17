import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('UsuariosController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Limpar o banco antes de cada teste
    await prismaService.usuario.deleteMany();
    await prismaService.grupo.deleteMany();
  });

  describe('/usuarios (POST)', () => {
    let grupoId: number;

    beforeEach(async () => {
      // Criar um grupo para os testes
      const grupo = await prismaService.grupo.create({
        data: {
          nome: 'admin',
        },
      });
      grupoId = grupo.id;
    });

    it('should create a new usuario successfully', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupoId,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.grupoId).toBe(grupoId);
      expect(response.body.id).toBeDefined();
      expect(response.body.senha).toBeUndefined(); // Senha não deve ser retornada
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 400 for invalid email format', async () => {
      const createUsuarioDto = {
        email: 'invalid-email',
        senha: 'password123',
        grupoId: grupoId,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('Email deve ter um formato válido');
    });

    it('should return 400 for empty email', async () => {
      const createUsuarioDto = {
        email: '',
        senha: 'password123',
        grupoId: grupoId,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('Email é obrigatório');
    });

    it('should return 400 for short password', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: '123',
        grupoId: grupoId,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('Senha deve ter pelo menos 6 caracteres');
    });

    it('should return 400 for invalid grupoId', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 0,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('ID do grupo deve ser um número positivo');
    });

    it('should return 400 for non-existent grupo', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 999,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('Grupo não encontrado');
    });

    it('should return 409 for duplicate email', async () => {
      // Criar primeiro usuário
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupoId,
      };

      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(201);

      // Tentar criar segundo usuário com mesmo email
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(409);

      expect(response.body.message).toContain('Email já está em uso');
    });

    it('should return 400 for missing required fields', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        // senha faltando
        grupoId: grupoId,
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('senha');
    });

    it('should return 400 for extra fields', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupoId,
        extraField: 'should not be allowed',
      };

      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);

      expect(response.body.message).toContain('extraField');
    });
  });

  describe('/usuarios (GET)', () => {
    let grupoId: number;

    beforeEach(async () => {
      // Criar um grupo e alguns usuários para os testes
      const grupo = await prismaService.grupo.create({
        data: {
          nome: 'admin',
        },
      });
      grupoId = grupo.id;

      // Criar alguns usuários
      await prismaService.usuario.createMany({
        data: [
          {
            email: 'user1@example.com',
            senha: 'password123',
            grupoId: grupoId,
          },
          {
            email: 'user2@example.com',
            senha: 'password123',
            grupoId: grupoId,
          },
        ],
      });
    });

    it('should return all usuarios', async () => {
      const response = await request(app.getHttpServer())
        .get('/usuarios')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      
      // Verificar que as senhas não são retornadas
      response.body.forEach((usuario: any) => {
        expect(usuario.senha).toBeUndefined();
        expect(usuario.email).toBeDefined();
        expect(usuario.grupoId).toBeDefined();
      });
    });

    it('should return usuarios with grupo information', async () => {
      const response = await request(app.getHttpServer())
        .get('/usuarios')
        .expect(200);

      const usuario = response.body[0];
      expect(usuario.grupo).toBeDefined();
      expect(usuario.grupo.nome).toBe('admin');
    });
  });

  describe('/usuarios/:id (GET)', () => {
    let grupoId: number;
    let usuarioId: number;

    beforeEach(async () => {
      // Criar um grupo e um usuário para os testes
      const grupo = await prismaService.grupo.create({
        data: {
          nome: 'admin',
        },
      });
      grupoId = grupo.id;

      const usuario = await prismaService.usuario.create({
        data: {
          email: 'test@example.com',
          senha: 'password123',
          grupoId: grupoId,
        },
      });
      usuarioId = usuario.id;
    });

    it('should return usuario by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/usuarios/${usuarioId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(usuarioId);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.senha).toBeUndefined(); // Senha não deve ser retornada
      expect(response.body.grupoId).toBe(grupoId);
    });

    it('should return 404 for non-existent usuario', async () => {
      await request(app.getHttpServer())
        .get('/usuarios/999')
        .expect(404);
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .get('/usuarios/invalid-id')
        .expect(400);
    });
  });

  describe('Validation and error handling', () => {
    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/usuarios')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "senha": "password123", "grupoId": 1')
        .expect(400);
    });

    it('should handle empty request body', async () => {
      await request(app.getHttpServer())
        .post('/usuarios')
        .send({})
        .expect(400);
    });

    it('should handle null values', async () => {
      const createUsuarioDto = {
        email: null,
        senha: 'password123',
        grupoId: 1,
      };

      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);
    });

    it('should handle undefined values', async () => {
      const createUsuarioDto = {
        email: undefined,
        senha: 'password123',
        grupoId: 1,
      };

      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);
    });
  });

  describe('Database constraints', () => {
    it('should enforce unique email constraint', async () => {
      // Criar um grupo primeiro
      const grupo = await prismaService.grupo.create({
        data: {
          nome: 'admin',
        },
      });

      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id,
      };

      // Primeiro usuário deve ser criado com sucesso
      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(201);

      // Segundo usuário com mesmo email deve falhar
      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(409);
    });

    it('should enforce foreign key constraint for grupo', async () => {
      const createUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 999, // Grupo que não existe
      };

      await request(app.getHttpServer())
        .post('/usuarios')
        .send(createUsuarioDto)
        .expect(400);
    });
  });
});
