import { apiService } from './api';
import { mockService } from './mock.service';
import {
  LoginCredentials,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';
import Cookies from 'js-cookie';

// Flag para usar mock em desenvolvimento
const USE_MOCK = process.env.NEXT_PUBLIC_APP_ENV === 'development';

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      const authResponse = await mockService.login(credentials);
      this.setAuthToken(authResponse.access_token);
      this.setUserData(authResponse.user);
      return authResponse;
    }

    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Salva token e dados do usuário
      this.setAuthToken(response.data.access_token);
      this.setUserData(response.data.user);
      return response.data;
    }
    
    throw new Error('Erro ao realizar login');
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continua mesmo se der erro no servidor
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Verifica se o token ainda é válido
   */
  async validateToken(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!token) return null;

    if (USE_MOCK) {
      try {
        const user = await mockService.validateToken();
        if (user) {
          this.setUserData(user);
        }
        return user;
      } catch (error) {
        this.clearAuthData();
        return null;
      }
    }

    try {
      const response = await apiService.get<User>('/auth/me');
      if (response.success && response.data) {
        this.setUserData(response.data);
        return response.data;
      }
    } catch (error) {
      this.clearAuthData();
    }
    
    return null;
  }

  /**
   * Atualiza dados do usuário atual
   */
  async refreshUser(): Promise<User | null> {
    try {
      const response = await apiService.get<User>('/auth/me');
      if (response.success && response.data) {
        this.setUserData(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
    
    return null;
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    const response = await apiService.post('/auth/change-password', data);
    
    if (!response.success) {
      throw new Error('Erro ao alterar senha');
    }
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiService.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error('Erro ao solicitar reset de senha');
    }
  }

  /**
   * Confirma reset de senha
   */
  async confirmPasswordReset(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    const response = await apiService.post('/auth/reset-password', data);
    
    if (!response.success) {
      throw new Error('Erro ao confirmar reset de senha');
    }
  }

  // Métodos para gerenciar dados locais
  
  /**
   * Salva token de autenticação
   */
  private setAuthToken(token: string): void {
    Cookies.set(this.AUTH_TOKEN_KEY, token, {
      expires: 7, // 7 dias
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  /**
   * Obtém token de autenticação
   */
  getAuthToken(): string | null {
    return Cookies.get(this.AUTH_TOKEN_KEY) || null;
  }

  /**
   * Salva dados do usuário
   */
  private setUserData(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Obtém dados do usuário
   */
  getUserData(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao ler dados do usuário:', error);
      return null;
    }
  }

  /**
   * Limpa todos os dados de autenticação
   */
  private clearAuthData(): void {
    Cookies.remove(this.AUTH_TOKEN_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    const user = this.getUserData();
    return user?.role === role;
  }

  /**
   * Verifica se o usuário tem pelo menos uma das roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUserData();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Verifica se o usuário é admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Verifica se o usuário é manager ou admin
   */
  isManagerOrAdmin(): boolean {
    return this.hasAnyRole(['admin', 'manager']);
  }
}

export const authService = new AuthService();
export default authService;
