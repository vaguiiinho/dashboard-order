export class Assunto {
  private _id: string;
  private _nome: string;
  private _descricao?: string;
  private _ativo: boolean;

  constructor(
    id: string,
    nome: string,
    ativo: boolean = true,
    descricao?: string
  ) {
    this.validarId(id);
    this.validarNome(nome);

    this._id = id;
    this._nome = nome;
    this._ativo = ativo;
    this._descricao = descricao;
  }

  // Getters
  get id(): string { return this._id; }
  get nome(): string { return this._nome; }
  get descricao(): string | undefined { return this._descricao; }
  get ativo(): boolean { return this._ativo; }

  // Setters com validação
  set nome(nome: string) {
    this.validarNome(nome);
    this._nome = nome;
  }

  set descricao(descricao: string | undefined) {
    this._descricao = descricao;
  }

  set ativo(ativo: boolean) {
    this._ativo = ativo;
  }

  // Validações privadas
  private validarId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do assunto é obrigatório');
    }
  }

  private validarNome(nome: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do assunto é obrigatório');
    }
    
    if (nome.trim().length < 2) {
      throw new Error('Nome do assunto deve ter pelo menos 2 caracteres');
    }
  }

  // Comportamentos
  ativar(): void {
    this._ativo = true;
  }

  desativar(): void {
    this._ativo = false;
  }

  // Método para serializar a entidade
  toJSON() {
    return {
      id: this._id,
      nome: this._nome,
      descricao: this._descricao,
      ativo: this._ativo
    };
  }

  // Método para criar uma instância a partir de dados
  static fromData(data: any): Assunto {
    return new Assunto(
      data.id,
      data.assunto || data.nome || '',
      data.ativo !== false,
      data.descricao
    );
  }
}
