import { Grupo } from './grupo.entity';
import { Usuario } from './usuario.entity';

describe('Grupo Entity', () => {
  let grupo: Grupo;
  let usuario: Usuario;

  beforeEach(() => {
    grupo = new Grupo('admin');
    usuario = new Usuario('test@example.com', 'password123', 1);
  });

  describe('Constructor', () => {
    it('should create a valid grupo', () => {
      expect(grupo.nome).toBe('admin');
      expect(grupo.id).toBe(0);
      expect(grupo.usuarios).toEqual([]);
      expect(grupo.createdAt).toBeInstanceOf(Date);
      expect(grupo.updatedAt).toBeInstanceOf(Date);
    });

    it('should create grupo with all parameters', () => {
      const dataCriacao = new Date('2023-01-01');
      const dataAtualizacao = new Date('2023-01-02');
      const usuarios = [usuario];
      
      const grupoCompleto = new Grupo(
        'supervisor',
        123,
        usuarios,
        dataCriacao,
        dataAtualizacao
      );
      
      expect(grupoCompleto.id).toBe(123);
      expect(grupoCompleto.nome).toBe('supervisor');
      expect(grupoCompleto.usuarios).toEqual(usuarios);
      expect(grupoCompleto.createdAt).toBe(dataCriacao);
      expect(grupoCompleto.updatedAt).toBe(dataAtualizacao);
    });
  });

  describe('Validations', () => {
    it('should throw error for empty nome', () => {
      expect(() => {
        new Grupo('');
      }).toThrow('Nome do grupo é obrigatório');
    });

    it('should throw error for short nome', () => {
      expect(() => {
        new Grupo('a');
      }).toThrow('Nome do grupo deve ter pelo menos 2 caracteres');
    });

    it('should throw error for nome with only spaces', () => {
      expect(() => {
        new Grupo('   ');
      }).toThrow('Nome do grupo é obrigatório');
    });
  });

  describe('Setters with validation', () => {
    it('should set valid nome', () => {
      grupo.nome = 'supervisor';
      expect(grupo.nome).toBe('supervisor');
    });

    it('should set descricao', () => {
      grupo.descricao = 'Grupo de supervisores';
      expect(grupo.descricao).toBe('Grupo de supervisores');
    });

    it('should set ativo', () => {
      grupo.ativo = false;
      expect(grupo.ativo).toBe(false);
    });

    it('should throw error for invalid nome in setter', () => {
      expect(() => {
        grupo.nome = '';
      }).toThrow('Nome do grupo é obrigatório');
    });

    it('should throw error for short nome in setter', () => {
      expect(() => {
        grupo.nome = 'a';
      }).toThrow('Nome do grupo deve ter pelo menos 2 caracteres');
    });
  });

  describe('Business methods', () => {
    it('should add usuario', () => {
      grupo.adicionarUsuario(usuario);
      
      expect(grupo.usuarios).toHaveLength(1);
      expect(grupo.usuarios[0]).toBe(usuario);
    });

    it('should not add duplicate usuario', () => {
      grupo.adicionarUsuario(usuario);
      grupo.adicionarUsuario(usuario);
      
      expect(grupo.usuarios).toHaveLength(1);
    });

    it('should remove usuario', () => {
      grupo.adicionarUsuario(usuario);
      expect(grupo.usuarios).toHaveLength(1);
      
      grupo.removerUsuario(usuario.id);
      expect(grupo.usuarios).toHaveLength(0);
    });

    it('should not fail when removing non-existent usuario', () => {
      grupo.removerUsuario(999);
      expect(grupo.usuarios).toHaveLength(0);
    });

    it('should change ativo status', () => {
      grupo.ativo = false;
      expect(grupo.ativo).toBe(false);
      
      grupo.ativo = true;
      expect(grupo.ativo).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      grupo.adicionarUsuario(usuario);
      const json = grupo.toJSON();
      
      expect(json).toEqual({
        id: 0,
        nome: 'admin',
        usuarios: [usuario.toJSON()],
        createdAt: grupo.createdAt,
        updatedAt: grupo.updatedAt
      });
    });

    it('should create from data', () => {
      const data = {
        id: 1,
        nome: 'supervisor',
        usuarios: [{
          id: 1,
          email: 'test@example.com',
          senha: 'password123',
          grupoId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const grupoFromData = Grupo.fromData(data);
      
      expect(grupoFromData.id).toBe(1);
      expect(grupoFromData.nome).toBe('supervisor');
      expect(grupoFromData.usuarios).toHaveLength(1);
      expect(grupoFromData.usuarios[0].email).toBe('test@example.com');
    });

    it('should create from data without usuarios', () => {
      const data = {
        id: 1,
        nome: 'supervisor',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const grupoFromData = Grupo.fromData(data);
      
      expect(grupoFromData.id).toBe(1);
      expect(grupoFromData.nome).toBe('supervisor');
      expect(grupoFromData.usuarios).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined usuarios in constructor', () => {
      const grupoSemUsuarios = new Grupo('test');
      expect(grupoSemUsuarios.usuarios).toEqual([]);
    });

    it('should handle undefined dates in constructor', () => {
      const grupoSemDatas = new Grupo('test');
      expect(grupoSemDatas.createdAt).toBeInstanceOf(Date);
      expect(grupoSemDatas.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle empty usuarios array', () => {
      const grupoVazio = new Grupo('test', 1, []);
      expect(grupoVazio.usuarios).toEqual([]);
    });
  });
});
