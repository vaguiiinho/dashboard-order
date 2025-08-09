import { api } from './api';
import { Usuario } from '@/types/auth';

export interface CreateUsuarioRequest {
  email: string;
  senha: string;
  grupoId: number;
}

export interface UpdateUsuarioRequest {
  email?: string;
  senha?: string;
  grupoId?: number;
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  async create(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios', data);
    return response.data;
  },

  async update(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};

