import { Usuario } from './usuario.entity';
import { Grupo } from './grupo.entity';

describe('Usuario Entity', () => {
  let grupo: Grupo;

  beforeEach(() => {
    grupo = new Grupo('admin');
  });

  describe('Constructor', () => {
    it('should create a valid usuario', () => {
      const usuario = new Usuario('test@example.com', 'password123', 1);
      
      expect(usuario.email).toBe('test@example.com');
      expect(usuario.senha).toBe('password123');
      expect(usuario.grupoId).toBe(1);
      expect(usuario.id).toBe(0);
      expect(usuario.createdAt).toBeInstanceOf(Date);
      expect(usuario.updatedAt).toBeInstanceOf(Date);
    });

    it('should create usuario with all parameters', () => {
      const dataCriacao = new Date('2023-01-01');
      const dataAtualizacao = new Date('2023-01-02');
      
      const usuario = new Usuario(
        'test@example.com',
        'password123',
        1,
        123,
        grupo,
        dataCriacao,
        dataAtualizacao
      );
      
      expect(usuario.id).toBe(123);
      expect(usuario.grupo).toBe(grupo);
      expect(usuario.createdAt).toBe(dataCriacao);
      expect(usuario.updatedAt).toBe(dataAtualizacao);
    });
  });

  describe('Validations', () => {
    it('should throw error for invalid email', () => {
      expect(() => {
        new Usuario('invalid-email', 'password123', 1);
      }).toThrow('Email deve ter um formato válido');
    });

    it('should throw error for empty email', () => {
      expect(() => {
        new Usuario('', 'password123', 1);
      }).toThrow('Email é obrigatório');
    });

    it('should throw error for empty password', () => {
      expect(() => {
        new Usuario('test@example.com', '', 1);
      }).toThrow('Senha é obrigatória');
    });

    it('should throw error for short password', () => {
      expect(() => {
        new Usuario('test@example.com', '123', 1);
      }).toThrow('Senha deve ter pelo menos 6 caracteres');
    });

    it('should throw error for invalid grupoId', () => {
      expect(() => {
        new Usuario('test@example.com', 'password123', 0);
      }).toThrow('ID do grupo deve ser um número positivo');
    });

    it('should throw error for negative grupoId', () => {
      expect(() => {
        new Usuario('test@example.com', 'password123', -1);
      }).toThrow('ID do grupo deve ser um número positivo');
    });
  });

  describe('Setters with validation', () => {
    let usuario: Usuario;

    beforeEach(() => {
      usuario = new Usuario('test@example.com', 'password123', 1);
    });

    it('should set valid email', () => {
      const newEmail = 'new@example.com';
      usuario.email = newEmail;
      
      expect(usuario.email).toBe(newEmail);
    });

    it('should set valid password', () => {
      const newPassword = 'newpassword123';
      usuario.senha = newPassword;
      
      expect(usuario.senha).toBe(newPassword);
    });

    it('should set valid grupoId', () => {
      const newGrupoId = 2;
      usuario.grupoId = newGrupoId;
      
      expect(usuario.grupoId).toBe(newGrupoId);
    });

    it('should set grupo', () => {
      const newGrupo = new Grupo('supervisor');
      usuario.grupo = newGrupo;
      
      expect(usuario.grupo).toBe(newGrupo);
    });

    it('should throw error for invalid email in setter', () => {
      expect(() => {
        usuario.email = 'invalid-email';
      }).toThrow('Email deve ter um formato válido');
    });

    it('should throw error for invalid password in setter', () => {
      expect(() => {
        usuario.senha = '123';
      }).toThrow('Senha deve ter pelo menos 6 caracteres');
    });

    it('should throw error for invalid grupoId in setter', () => {
      expect(() => {
        usuario.grupoId = 0;
      }).toThrow('ID do grupo deve ser um número positivo');
    });
  });

  describe('Business methods', () => {
    let usuario: Usuario;

    beforeEach(() => {
      usuario = new Usuario('test@example.com', 'password123', 1, 1, grupo);
    });

    it('should alter password', () => {
      const newPassword = 'newpassword123';
      usuario.alterarSenha(newPassword);
      
      expect(usuario.senha).toBe(newPassword);
    });

    it('should alter grupo', () => {
      const newGrupoId = 2;
      usuario.alterarGrupo(newGrupoId);
      
      expect(usuario.grupoId).toBe(newGrupoId);
    });

    it('should alter email', () => {
      const newEmail = 'new@example.com';
      usuario.alterarEmail(newEmail);
      
      expect(usuario.email).toBe(newEmail);
    });

    it('should check if user belongs to group', () => {
      expect(usuario.pertenceAoGrupo(1)).toBe(true);
      expect(usuario.pertenceAoGrupo(2)).toBe(false);
    });

    it('should check if user is admin', () => {
      expect(usuario.isAdmin()).toBe(true);
      
      const nonAdminGrupo = new Grupo('colaborador');
      const nonAdminUsuario = new Usuario('user@example.com', 'password123', 1, 2, nonAdminGrupo);
      
      expect(nonAdminUsuario.isAdmin()).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      const usuario = new Usuario('test@example.com', 'password123', 1, 1, grupo);
      const json = usuario.toJSON();
      
      expect(json).toEqual({
        id: 1,
        email: 'test@example.com',
        grupoId: 1,
        grupo: grupo.toJSON(),
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      });
    });

    it('should create from data', () => {
      const data = {
        id: 1,
        email: 'test@example.com',
        senha: 'password123',
        grupoId: 1,
        grupo: {
          id: 1,
          nome: 'admin',
          usuarios: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const usuario = Usuario.fromData(data);
      
      expect(usuario.id).toBe(1);
      expect(usuario.email).toBe('test@example.com');
      expect(usuario.grupoId).toBe(1);
      expect(usuario.grupo).toBeDefined();
      expect(usuario.grupo?.nome).toBe('admin');
    });
  });
});
