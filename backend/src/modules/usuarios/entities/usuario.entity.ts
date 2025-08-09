export class Usuario {
  id: number;
  email: string;
  senha: string;
  grupoId: number;
  grupo?: Grupo;
  createdAt: Date;
  updatedAt: Date;
}

export class Grupo {
  id: number;
  nome: string;
  usuarios?: Usuario[];
  createdAt: Date;
  updatedAt: Date;
}

