export interface Usuario {
  id: number;
  email: string;
  grupoId: number;
  grupo: Grupo;
  createdAt: string;
  updatedAt: string;
}

export interface Grupo {
  id: number;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}

export interface AuthContextType {
  user: Usuario | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

