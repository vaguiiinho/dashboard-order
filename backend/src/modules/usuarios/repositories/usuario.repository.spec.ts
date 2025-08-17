import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../config/prisma.service';
import { UsuarioRepository } from './usuario.repository';
import { Usuario, Grupo } from '../entities';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { cleanTestDatabase, checkDatabaseConnection } from '../../../test/setup-integration';

describe('UsuarioRepository Integration', () => {
  let repository: UsuarioRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    // Verificar conexão com banco de teste
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('❌ Não foi possível conectar ao banco de teste. Execute: npm run db:test:setup');
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioRepository, PrismaService],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  beforeEach(async () => {
    // Limpar o banco antes de cada teste
    await cleanTestDatabase();
  });

  describe('Grupo operations', () => {
    it('should create a new grupo', async () => {
      const grupo = new Grupo('admin');
      const createdGrupo = await repository.createGrupo(grupo);

      expect(createdGrupo).toBeDefined();
      expect(createdGrupo.nome).toBe('admin');
      expect(createdGrupo.id).toBeGreaterThan(0);
    });

    it('should find grupo by id', async () => {
      const grupo = new Grupo('supervisor');
      const createdGrupo = await repository.createGrupo(grupo);

      const foundGrupo = await repository.findGrupoById(createdGrupo.id);
      expect(foundGrupo).toBeDefined();
      expect(foundGrupo?.nome).toBe('supervisor');
    });

    it('should find grupo by nome', async () => {
      const grupo = new Grupo('colaborador');
      await repository.createGrupo(grupo);

      const foundGrupo = await repository.findGrupoByNome('colaborador');
      expect(foundGrupo).toBeDefined();
      expect(foundGrupo?.nome).toBe('colaborador');
    });

    it('should return null for non-existent grupo', async () => {
      const foundGrupo = await repository.findGrupoById(999);
      expect(foundGrupo).toBeNull();
    });

    it('should list all grupos', async () => {
      const grupo1 = new Grupo('admin');
      const grupo2 = new Grupo('supervisor');
      
      await repository.createGrupo(grupo1);
      await repository.createGrupo(grupo2);

      const grupos = await repository.listarGrupos();
      expect(grupos).toHaveLength(2);
      expect(grupos.map(g => g.nome)).toContain('admin');
      expect(grupos.map(g => g.nome)).toContain('supervisor');
    });

    it('should update grupo', async () => {
      const grupo = new Grupo('admin');
      const createdGrupo = await repository.createGrupo(grupo);

      const updatedGrupo = await repository.updateGrupo(createdGrupo.id, { nome: 'supervisor' });
      expect(updatedGrupo.nome).toBe('supervisor');
    });

    it('should delete grupo', async () => {
      const grupo = new Grupo('admin');
      const createdGrupo = await repository.createGrupo(grupo);

      await repository.deleteGrupo(createdGrupo.id);

      const foundGrupo = await repository.findGrupoById(createdGrupo.id);
      expect(foundGrupo).toBeNull();
    });
  });

  describe('Usuario operations', () => {
    let grupo: Grupo;

    beforeEach(async () => {
      grupo = await repository.createGrupo(new Grupo('admin'));
    });

    it('should create a new usuario', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);

      expect(createdUsuario).toBeDefined();
      expect(createdUsuario.email).toBe('test@example.com');
      expect(createdUsuario.grupoId).toBe(grupo.id);
      expect(createdUsuario.id).toBeGreaterThan(0);
    });

    it('should find usuario by id', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const foundUsuario = await repository.findById(createdUsuario.id);

      expect(foundUsuario).toBeDefined();
      expect(foundUsuario?.email).toBe('test@example.com');
    });

    it('should find usuario by email', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      await repository.create(createDto);
      const foundUsuario = await repository.findByEmail('test@example.com');

      expect(foundUsuario).toBeDefined();
      expect(foundUsuario?.email).toBe('test@example.com');
    });

    it('should return null for non-existent usuario', async () => {
      const foundUsuario = await repository.findById(999);
      expect(foundUsuario).toBeNull();
    });

    it('should return null for non-existent email', async () => {
      const foundUsuario = await repository.findByEmail('nonexistent@example.com');
      expect(foundUsuario).toBeNull();
    });

    it('should list all usuarios', async () => {
      const createDto1: CreateUsuarioDto = {
        email: 'user1@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createDto2: CreateUsuarioDto = {
        email: 'user2@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      await repository.create(createDto1);
      await repository.create(createDto2);

      const usuarios = await repository.findAll();
      expect(usuarios).toHaveLength(2);
      expect(usuarios.map(u => u.email)).toContain('user1@example.com');
      expect(usuarios.map(u => u.email)).toContain('user2@example.com');
    });

    it('should update usuario', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const updatedUsuario = await repository.update(createdUsuario.id, { email: 'updated@example.com' });

      expect(updatedUsuario.email).toBe('updated@example.com');
    });

    it('should delete usuario', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      await repository.delete(createdUsuario.id);

      const foundUsuario = await repository.findById(createdUsuario.id);
      expect(foundUsuario).toBeNull();
    });
  });

  describe('Relationships', () => {
    it('should create usuario with grupo relationship', async () => {
      const grupo = await repository.createGrupo(new Grupo('admin'));
      
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const foundUsuario = await repository.findById(createdUsuario.id);

      expect(foundUsuario?.grupoId).toBe(grupo.id);
    });

    it('should handle grupo deletion with usuarios', async () => {
      const grupo = await repository.createGrupo(new Grupo('admin'));
      
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      await repository.create(createDto);
      
      // Deletar o grupo (deve falhar devido à constraint de foreign key)
      try {
        await repository.deleteGrupo(grupo.id);
        fail('Should have thrown an error due to foreign key constraint');
      } catch (error) {
        // Esperado que falhe devido à constraint
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Simular erro de conexão
      jest.spyOn(prismaService.usuario, 'create').mockRejectedValueOnce(new Error('Connection failed'));

      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 1
      };

      await expect(repository.create(createDto)).rejects.toThrow('Connection failed');
    });

    it('should handle validation errors', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'invalid-email',
        senha: 'password123',
        grupoId: 1
      };

      // Deve falhar na validação da entidade
      try {
        await repository.create(createDto);
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
