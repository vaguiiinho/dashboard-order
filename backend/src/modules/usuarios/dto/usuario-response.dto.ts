export class UsuarioResponseDto {
  id: number;
  email: string;
  grupoId: number;
  grupo?: GrupoResponseDto;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.grupoId = data.grupoId;
    this.grupo = data.grupo ? new GrupoResponseDto(data.grupo) : undefined;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class GrupoResponseDto {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.ativo = data.ativo;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class UsuarioListResponseDto {
  usuarios: UsuarioResponseDto[];
  total: number;
  page: number;
  limit: number;

  constructor(usuarios: any[], total: number, page: number, limit: number) {
    this.usuarios = usuarios.map(u => new UsuarioResponseDto(u));
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

export class GrupoListResponseDto {
  grupos: GrupoResponseDto[];
  total: number;
  page: number;
  limit: number;

  constructor(grupos: any[], total: number, page: number, limit: number) {
    this.grupos = grupos.map(g => new GrupoResponseDto(g));
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
