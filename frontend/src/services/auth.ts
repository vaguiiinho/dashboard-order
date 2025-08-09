import { api } from './api';
import { LoginRequest, LoginResponse, Usuario } from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<Usuario> {
    const response = await api.get<Usuario>('/auth/profile');
    return response.data;
  },
};

