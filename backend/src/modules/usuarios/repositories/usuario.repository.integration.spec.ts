import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../config/prisma.service';
import { UsuarioRepository } from './usuario.repository';
import { Usuario, Grupo } from '../entities';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { cleanTestDatabase, checkDatabaseConnection, createTestData, prisma } from '../../../../test/setup-integration';

describe('UsuarioRepository Integration Tests', () => {
  let repository: UsuarioRepository;
  let prismaService: PrismaService;
  let testData: any;

  beforeAll(async () => {
    // Verificar conexão com banco de teste
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('❌ Não foi possível conectar ao banco de teste. Execute: npm run db:test:setup');
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioRepository,
        {
          provide: PrismaService,
          useValue: prisma, // Usar instância do setup-integration
        },
      ],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpar o banco antes de cada teste
    await cleanTestDatabase();
    
    // Criar dados de teste básicos
    testData = await createTestData();
  });

  afterAll(async () => {
    // Limpeza final
    await cleanTestDatabase();
  });

  describe('🏗️ Grupo Operations', () => {
    it('should create a new grupo', async () => {
      const grupo = new Grupo('colaborador');
      const createdGrupo = await repository.createGrupo(grupo);

      expect(createdGrupo).toBeDefined();
      expect(createdGrupo.nome).toBe('colaborador');
      expect(createdGrupo.id).toBeGreaterThan(0);
      expect(createdGrupo.createdAt).toBeInstanceOf(Date);
      expect(createdGrupo.updatedAt).toBeInstanceOf(Date);
    });

    it('should find grupo by id', async () => {
      const grupo = testData.grupos[0];
      const foundGrupo = await repository.findGrupoById(grupo.id);

      expect(foundGrupo).toBeDefined();
      expect(foundGrupo?.nome).toBe(grupo.nome);
      expect(foundGrupo?.id).toBe(grupo.id);
    });

    it('should find grupo by nome', async () => {
      const grupo = testData.grupos[0];
      const foundGrupo = await repository.findGrupoByNome(grupo.nome);

      expect(foundGrupo).toBeDefined();
      expect(foundGrupo?.nome).toBe(grupo.nome);
      expect(foundGrupo?.id).toBe(grupo.id);
    });

    it('should return null for non-existent grupo by id', async () => {
      const foundGrupo = await repository.findGrupoById(999999);
      expect(foundGrupo).toBeNull();
    });

    it('should return null for non-existent grupo by nome', async () => {
      const foundGrupo = await repository.findGrupoByNome('grupo-inexistente');
      expect(foundGrupo).toBeNull();
    });

    it('should list all grupos', async () => {
      const grupos = await repository.listarGrupos();
      expect(grupos).toHaveLength(2);
      expect(grupos.map(g => g.nome)).toContain('admin');
      expect(grupos.map(g => g.nome)).toContain('supervisor');
    });

    it('should update grupo', async () => {
      const grupo = testData.grupos[0];
      const updatedGrupo = await repository.updateGrupo(grupo.id, { nome: 'admin-updated' });

      expect(updatedGrupo.nome).toBe('admin-updated');
      expect(updatedGrupo.id).toBe(grupo.id);
      expect(updatedGrupo.updatedAt.getTime()).toBeGreaterThan(grupo.updatedAt.getTime());
    });

    it('should delete grupo', async () => {
      const grupo = testData.grupos[0];
      await repository.deleteGrupo(grupo.id);

      const foundGrupo = await repository.findGrupoById(grupo.id);
      expect(foundGrupo).toBeNull();
    });

    it('should handle duplicate grupo name', async () => {
      const grupo = new Grupo('admin'); // Nome já existe
      
      await expect(repository.createGrupo(grupo)).rejects.toThrow();
    });
  });

  describe('👤 Usuario Operations', () => {
    it('should create a new usuario with password hashing', async () => {
      const grupo = testData.grupos[0];
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
      expect(createdUsuario.senha).not.toBe('password123'); // Senha deve estar hasheada
      expect(createdUsuario.senha.length).toBeGreaterThan(20); // Hash bcrypt é longo
      expect(createdUsuario.createdAt).toBeInstanceOf(Date);
      expect(createdUsuario.updatedAt).toBeInstanceOf(Date);
    });

    it('should find usuario by id with grupo relationship', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const foundUsuario = await repository.findById(createdUsuario.id);

      expect(foundUsuario).toBeDefined();
      expect(foundUsuario?.email).toBe('test@example.com');
      expect(foundUsuario?.grupoId).toBe(grupo.id);
      expect(foundUsuario?.grupo).toBeDefined();
      expect(foundUsuario?.grupo?.nome).toBe(grupo.nome);
    });

    it('should find usuario by email', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      await repository.create(createDto);
      const foundUsuario = await repository.findByEmail('test@example.com');

      expect(foundUsuario).toBeDefined();
      expect(foundUsuario?.email).toBe('test@example.com');
      expect(foundUsuario?.grupo).toBeDefined();
    });

    it('should return null for non-existent usuario by id', async () => {
      const foundUsuario = await repository.findById(999999);
      expect(foundUsuario).toBeNull();
    });

    it('should return null for non-existent usuario by email', async () => {
      const foundUsuario = await repository.findByEmail('nonexistent@example.com');
      expect(foundUsuario).toBeNull();
    });

    it('should list all usuarios with grupos', async () => {
      const grupo1 = testData.grupos[0];
      const grupo2 = testData.grupos[1];

      const createDto1: CreateUsuarioDto = {
        email: 'user1@example.com',
        senha: 'password123',
        grupoId: grupo1.id
      };

      const createDto2: CreateUsuarioDto = {
        email: 'user2@example.com',
        senha: 'password123',
        grupoId: grupo2.id
      };

      await repository.create(createDto1);
      await repository.create(createDto2);

      const usuarios = await repository.findAll();
      expect(usuarios).toHaveLength(2);
      expect(usuarios.map(u => u.email)).toContain('user1@example.com');
      expect(usuarios.map(u => u.email)).toContain('user2@example.com');
      
      // Verificar se grupos estão incluídos
      usuarios.forEach(usuario => {
        expect(usuario.grupo).toBeDefined();
        expect(usuario.grupo?.nome).toMatch(/admin|supervisor/);
      });
    });

    it('should update usuario email', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const updateDto: UpdateUsuarioDto = { email: 'updated@example.com' };
      
      const updatedUsuario = await repository.update(createdUsuario.id, updateDto);

      expect(updatedUsuario.email).toBe('updated@example.com');
      expect(updatedUsuario.id).toBe(createdUsuario.id);
      expect(updatedUsuario.updatedAt.getTime()).toBeGreaterThan(createdUsuario.updatedAt.getTime());
    });

    it('should update usuario password with hashing', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const originalPassword = createdUsuario.senha;
      const updateDto: UpdateUsuarioDto = { senha: 'newpassword456' };
      
      const updatedUsuario = await repository.update(createdUsuario.id, updateDto);

      expect(updatedUsuario.senha).not.toBe('newpassword456'); // Deve estar hasheada
      expect(updatedUsuario.senha).not.toBe(originalPassword); // Deve ser diferente da anterior
      expect(updatedUsuario.senha.length).toBeGreaterThan(20); // Hash bcrypt é longo
    });

    it('should update usuario grupo', async () => {
      const grupo1 = testData.grupos[0];
      const grupo2 = testData.grupos[1];
      
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo1.id
      };

      const createdUsuario = await repository.create(createDto);
      const updateDto: UpdateUsuarioDto = { grupoId: grupo2.id };
      
      const updatedUsuario = await repository.update(createdUsuario.id, updateDto);

      expect(updatedUsuario.grupoId).toBe(grupo2.id);
      expect(updatedUsuario.grupo?.nome).toBe(grupo2.nome);
    });

    it('should delete usuario', async () => {
      const grupo = testData.grupos[0];
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

    it('should handle duplicate email constraint', async () => {
      const grupo = testData.grupos[0];
      const createDto1: CreateUsuarioDto = {
        email: 'duplicate@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createDto2: CreateUsuarioDto = {
        email: 'duplicate@example.com', // Email duplicado
        senha: 'password456',
        grupoId: grupo.id
      };

      await repository.create(createDto1);
      await expect(repository.create(createDto2)).rejects.toThrow();
    });
  });

  describe('🔗 Relationships and Constraints', () => {
    it('should create usuario with grupo relationship', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      const foundUsuario = await repository.findById(createdUsuario.id);

      expect(foundUsuario?.grupoId).toBe(grupo.id);
      expect(foundUsuario?.grupo).toBeDefined();
      expect(foundUsuario?.grupo?.nome).toBe(grupo.nome);
    });

    it('should fail to create usuario with non-existent grupo', async () => {
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 999999 // Grupo inexistente
      };

      await expect(repository.create(createDto)).rejects.toThrow();
    });

    it('should prevent deletion of grupo with associated usuarios', async () => {
      const grupo = testData.grupos[0];
      const createDto: CreateUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
        grupoId: grupo.id
      };

      await repository.create(createDto);
      
      // Tentar deletar grupo que tem usuários deve falhar
      await expect(repository.deleteGrupo(grupo.id)).rejects.toThrow();
    });

    it('should allow deletion of grupo without usuarios', async () => {
      const grupo = new Grupo('grupo-vazio');
      const createdGrupo = await repository.createGrupo(grupo);
      
      // Deletar grupo sem usuários deve funcionar
      await expect(repository.deleteGrupo(createdGrupo.id)).resolves.not.toThrow();
      
      const foundGrupo = await repository.findGrupoById(createdGrupo.id);
      expect(foundGrupo).toBeNull();
    });
  });

  describe('🔍 Data Validation and Edge Cases', () => {
    it('should handle long email addresses', async () => {
      const grupo = testData.grupos[0];
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      
      const createDto: CreateUsuarioDto = {
        email: longEmail,
        senha: 'password123',
        grupoId: grupo.id
      };

      const createdUsuario = await repository.create(createDto);
      expect(createdUsuario.email).toBe(longEmail);
    });

    it('should handle special characters in grupo nome', async () => {
      const grupo = new Grupo('grupo-com-hífen_e_underscore');
      const createdGrupo = await repository.createGrupo(grupo);

      expect(createdGrupo.nome).toBe('grupo-com-hífen_e_underscore');
    });

    it('should handle concurrent usuario creation', async () => {
      const grupo = testData.grupos[0];
      
      const createPromises = Array.from({ length: 5 }, (_, i) => 
        repository.create({
          email: `concurrent${i}@example.com`,
          senha: 'password123',
          grupoId: grupo.id
        })
      );

      const results = await Promise.all(createPromises);
      
      expect(results).toHaveLength(5);
      results.forEach((usuario, index) => {
        expect(usuario.email).toBe(`concurrent${index}@example.com`);
      });
    });

    it('should maintain data consistency after update operations', async () => {
      const grupo1 = testData.grupos[0];
      const grupo2 = testData.grupos[1];
      
      const createDto: CreateUsuarioDto = {
        email: 'consistency@example.com',
        senha: 'password123',
        grupoId: grupo1.id
      };

      const createdUsuario = await repository.create(createDto);
      
      // Atualizar múltiplos campos
      const updateDto: UpdateUsuarioDto = {
        email: 'updated-consistency@example.com',
        senha: 'newpassword456',
        grupoId: grupo2.id
      };
      
      const updatedUsuario = await repository.update(createdUsuario.id, updateDto);
      
      // Verificar consistência dos dados
      expect(updatedUsuario.email).toBe('updated-consistency@example.com');
      expect(updatedUsuario.grupoId).toBe(grupo2.id);
      expect(updatedUsuario.grupo?.nome).toBe(grupo2.nome);
      expect(updatedUsuario.senha).not.toBe('newpassword456'); // Deve estar hasheada
      expect(updatedUsuario.updatedAt).toBeDefined();
    });
  });

  describe('⚡ Performance and Scalability', () => {
    it('should efficiently handle batch operations', async () => {
      const grupo = testData.grupos[0];
      const startTime = Date.now();
      
      // Criar múltiplos usuários
      const createPromises = Array.from({ length: 10 }, (_, i) => 
        repository.create({
          email: `batch${i}@example.com`,
          senha: 'password123',
          grupoId: grupo.id
        })
      );

      await Promise.all(createPromises);
      const endTime = Date.now();
      
      // Verificar que todos foram criados
      const usuarios = await repository.findAll();
      expect(usuarios).toHaveLength(10);
      
      // Operação deve ser razoavelmente rápida (menos de 5 segundos)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle pagination-like queries efficiently', async () => {
      const grupo = testData.grupos[0];
      
      // Criar usuários para teste
      await Promise.all(
        Array.from({ length: 20 }, (_, i) => 
          repository.create({
            email: `pagination${i}@example.com`,
            senha: 'password123',
            grupoId: grupo.id
          })
        )
      );

      const startTime = Date.now();
      const usuarios = await repository.findAll();
      const endTime = Date.now();
      
      expect(usuarios).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(1000); // Deve ser rápido
    });
  });
});
