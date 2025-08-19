import { Usuario } from './usuario.entity';

export class Grupo {
  private _id: number;
  private _nome: string;
  private _descricao?: string;
  private _ativo: boolean;
  private _usuarios?: Usuario[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    nome: string,
    id?: number,
    usuarios?: Usuario[],
    createdAt?: Date,
    updatedAt?: Date,
    descricao?: string,
    ativo: boolean = true
  ) {
    this.validarNome(nome);

    this._nome = nome;
    this._id = id || 0;
    this._usuarios = usuarios || [];
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._descricao = descricao;
    this._ativo = ativo;
  }

  // Getters
  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  get descricao(): string | undefined { return this._descricao; }
  get ativo(): boolean { return this._ativo; }
  get usuarios(): Usuario[] { return this._usuarios || []; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Setters com validação
  set nome(nome: string) {
    this.validarNome(nome);
    this._nome = nome;
    this._updatedAt = new Date();
  }

  set descricao(descricao: string | undefined) {
    this._descricao = descricao;
    this._updatedAt = new Date();
  }

  set ativo(ativo: boolean) {
    this._ativo = ativo;
    this._updatedAt = new Date();
  }

  // Validações privadas
  private validarNome(nome: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do grupo é obrigatório');
    }
    
    if (nome.trim().length < 2) {
      throw new Error('Nome do grupo deve ter pelo menos 2 caracteres');
    }
  }

  // Comportamentos
  adicionarUsuario(usuario: Usuario): void {
    if (!this._usuarios) {
      this._usuarios = [];
    }
    
    if (!this._usuarios.find(u => u.id === usuario.id)) {
      this._usuarios.push(usuario);
      this._updatedAt = new Date();
    }
  }

  removerUsuario(usuarioId: number): void {
    if (this._usuarios) {
      this._usuarios = this._usuarios.filter(u => u.id !== usuarioId);
      this._updatedAt = new Date();
    }
  }

  // Método para serializar a entidade
  toJSON() {
    return {
      id: this._id,
      nome: this._nome,
      descricao: this._descricao,
      ativo: this._ativo,
      usuarios: this._usuarios?.map(u => u.toJSON()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  // Método para criar uma instância a partir de dados
  static fromData(data: any): Grupo {
    return new Grupo(
      data.nome,
      data.id,
      data.usuarios?.map((u: any) => Usuario.fromData(u)),
      data.createdAt ? new Date(data.createdAt) : undefined,
      data.updatedAt ? new Date(data.updatedAt) : undefined,
      data.descricao,
      data.ativo !== false // default to true if not specified
    );
  }
}
