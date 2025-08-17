import { Grupo } from './grupo.entity';

export class Usuario {
  private _id: number;
  private _email: string;
  private _senha: string;
  private _grupoId: number;
  private _grupo?: Grupo;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    email: string,
    senha: string,
    grupoId: number,
    id?: number,
    grupo?: Grupo,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validarEmail(email);
    this.validarSenha(senha);
    this.validarGrupoId(grupoId);

    this._email = email;
    this._senha = senha;
    this._grupoId = grupoId;
    this._id = id || 0;
    this._grupo = grupo;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getters
  get id(): number { return this._id; }
  get email(): string { return this._email; }
  get senha(): string { return this._senha; }
  get grupoId(): number { return this._grupoId; }
  get grupo(): Grupo | undefined { return this._grupo; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Setters com validação
  set email(email: string) {
    this.validarEmail(email);
    this._email = email;
    this._updatedAt = new Date();
  }

  set senha(senha: string) {
    this.validarSenha(senha);
    this._senha = senha;
    this._updatedAt = new Date();
  }

  set grupoId(grupoId: number) {
    this.validarGrupoId(grupoId);
    this._grupoId = grupoId;
    this._updatedAt = new Date();
  }

  set grupo(grupo: Grupo) {
    this._grupo = grupo;
    this._updatedAt = new Date();
  }

  // Validações privadas
  private validarEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email é obrigatório');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email deve ter um formato válido');
    }
  }

  private validarSenha(senha: string): void {
    if (!senha || senha.trim().length === 0) {
      throw new Error('Senha é obrigatória');
    }
    
    if (senha.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
  }

  private validarGrupoId(grupoId: number): void {
    if (!grupoId || grupoId <= 0) {
      throw new Error('ID do grupo deve ser um número positivo');
    }
  }

  // Comportamentos
  alterarSenha(novaSenha: string): void {
    this.senha = novaSenha;
  }

  alterarGrupo(novoGrupoId: number): void {
    this.grupoId = novoGrupoId;
  }

  alterarEmail(novoEmail: string): void {
    this.email = novoEmail;
  }

  // Método para verificar se o usuário pertence a um grupo específico
  pertenceAoGrupo(grupoId: number): boolean {
    return this._grupoId === grupoId;
  }

  // Método para verificar se o usuário tem permissão de administrador
  isAdmin(): boolean {
    return this._grupo?.nome === 'admin' || this._grupo?.nome === 'gerente';
  }

  // Método para serializar a entidade
  toJSON() {
    return {
      id: this._id,
      email: this._email,
      grupoId: this._grupoId,
      grupo: this._grupo ? this._grupo.toJSON() : undefined,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  // Método para criar uma instância a partir de dados
  static fromData(data: any): Usuario {
    return new Usuario(
      data.email,
      data.senha,
      data.grupoId,
      data.id,
      data.grupo ? Grupo.fromData(data.grupo) : undefined,
      data.createdAt ? new Date(data.createdAt) : undefined,
      data.updatedAt ? new Date(data.updatedAt) : undefined
    );
  }
}

