// Mock service para testar o frontend sem backend
import {
  User,
  AuthResponse,
  DashboardData,
  ChartData,
  TrendData,
  LoginCredentials,
} from '@/types';

class MockService {
  private isAuthenticated = false;
  private currentUser: User | null = null;

  // Mock de dados do usuário
  private mockUser: User = {
    id: 1,
    email: 'admin@dashboard.com',
    name: 'Administrador',
    role: 'admin',
    department: 'TI',
    city: 'São Paulo',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  // Mock de login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(1000); // Simula delay da API

    if (credentials.email === 'admin@dashboard.com' && credentials.password === 'admin123') {
      this.isAuthenticated = true;
      this.currentUser = this.mockUser;
      
      return {
        user: this.mockUser,
        access_token: 'mock-jwt-token',
        expires_in: 3600,
      };
    }

    throw new Error('Credenciais inválidas');
  }

  // Mock de validação de token
  async validateToken(): Promise<User | null> {
    await this.delay(500);
    
    if (this.isAuthenticated) {
      return this.currentUser;
    }
    
    return null;
  }

  // Mock de logout
  async logout(): Promise<void> {
    await this.delay(300);
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  // Mock de dados do dashboard
  async getDashboardData(): Promise<DashboardData> {
    await this.delay(1000);

    const byCategory: ChartData[] = [
      { name: 'Manutenção', value: 45, color: '#3B82F6' },
      { name: 'Instalação', value: 32, color: '#10B981' },
      { name: 'Reparo', value: 28, color: '#F59E0B' },
      { name: 'Inspeção', value: 18, color: '#EF4444' },
      { name: 'Limpeza', value: 12, color: '#8B5CF6' },
    ];

    const byDepartment: ChartData[] = [
      { name: 'Técnico', value: 52, color: '#3B82F6' },
      { name: 'Operações', value: 38, color: '#10B981' },
      { name: 'Qualidade', value: 24, color: '#F59E0B' },
      { name: 'Segurança', value: 19, color: '#EF4444' },
      { name: 'Administrativo', value: 12, color: '#8B5CF6' },
    ];

    const byCity: ChartData[] = [
      { name: 'São Paulo', value: 89, color: '#3B82F6' },
      { name: 'Rio de Janeiro', value: 67, color: '#10B981' },
      { name: 'Belo Horizonte', value: 34, color: '#F59E0B' },
      { name: 'Curitiba', value: 28, color: '#EF4444' },
      { name: 'Porto Alegre', value: 22, color: '#8B5CF6' },
      { name: 'Salvador', value: 18, color: '#06B6D4' },
    ];

    const byCollaborator: ChartData[] = [
      { name: 'João Silva', value: 23, color: '#3B82F6' },
      { name: 'Maria Santos', value: 19, color: '#10B981' },
      { name: 'Pedro Costa', value: 16, color: '#F59E0B' },
      { name: 'Ana Oliveira', value: 14, color: '#EF4444' },
      { name: 'Carlos Lima', value: 12, color: '#8B5CF6' },
    ];

    const byStructure: ChartData[] = [
      { name: 'Prédio A', value: 34, color: '#3B82F6' },
      { name: 'Prédio B', value: 28, color: '#10B981' },
      { name: 'Prédio C', value: 22, color: '#F59E0B' },
      { name: 'Estacionamento', value: 18, color: '#EF4444' },
      { name: 'Área Externa', value: 15, color: '#8B5CF6' },
    ];

    const byStatus: ChartData[] = [
      { name: 'Pendente', value: 35, color: '#F59E0B' },
      { name: 'Em Andamento', value: 28, color: '#3B82F6' },
      { name: 'Concluída', value: 71, color: '#10B981' },
      { name: 'Cancelada', value: 6, color: '#EF4444' },
    ];

    const byPriority: ChartData[] = [
      { name: 'Baixa', value: 42, color: '#6B7280' },
      { name: 'Média', value: 56, color: '#F59E0B' },
      { name: 'Alta', value: 28, color: '#EF4444' },
      { name: 'Crítica', value: 9, color: '#991B1B' },
    ];

    const monthlyTrend: TrendData[] = [
      { month: 'Jan', total: 45, completed: 38, pending: 5, in_progress: 2 },
      { month: 'Fev', total: 52, completed: 42, pending: 7, in_progress: 3 },
      { month: 'Mar', total: 48, completed: 39, pending: 6, in_progress: 3 },
      { month: 'Abr', total: 61, completed: 48, pending: 8, in_progress: 5 },
      { month: 'Mai', total: 58, completed: 45, pending: 9, in_progress: 4 },
      { month: 'Jun', total: 67, completed: 52, pending: 10, in_progress: 5 },
    ];

    return {
      totalOrders: 135,
      pendingOrders: 35,
      completedOrders: 71,
      inProgressOrders: 28,
      byCategory,
      byDepartment,
      byCity,
      byCollaborator,
      byStructure,
      byStatus,
      byPriority,
      monthlyTrend,
    };
  }

  // Mock de estatísticas resumidas
  async getSummaryStats() {
    await this.delay(800);
    
    return {
      totalOrders: 135,
      pendingOrders: 35,
      completedOrders: 71,
      inProgressOrders: 28,
    };
  }

  // Mock de dados específicos
  async getOrdersByCategory() {
    await this.delay(600);
    return [
      { name: 'Manutenção', value: 45, color: '#3B82F6' },
      { name: 'Instalação', value: 32, color: '#10B981' },
      { name: 'Reparo', value: 28, color: '#F59E0B' },
      { name: 'Inspeção', value: 18, color: '#EF4444' },
      { name: 'Limpeza', value: 12, color: '#8B5CF6' },
    ];
  }

  async getOrdersByDepartment() {
    await this.delay(600);
    return [
      { name: 'Técnico', value: 52, color: '#3B82F6' },
      { name: 'Operações', value: 38, color: '#10B981' },
      { name: 'Qualidade', value: 24, color: '#F59E0B' },
      { name: 'Segurança', value: 19, color: '#EF4444' },
      { name: 'Administrativo', value: 12, color: '#8B5CF6' },
    ];
  }

  async getOrdersByCity() {
    await this.delay(600);
    return [
      { name: 'São Paulo', value: 89, color: '#3B82F6' },
      { name: 'Rio de Janeiro', value: 67, color: '#10B981' },
      { name: 'Belo Horizonte', value: 34, color: '#F59E0B' },
      { name: 'Curitiba', value: 28, color: '#EF4444' },
      { name: 'Porto Alegre', value: 22, color: '#8B5CF6' },
      { name: 'Salvador', value: 18, color: '#06B6D4' },
    ];
  }

  async getOrdersByStatus() {
    await this.delay(600);
    return [
      { name: 'Pendente', value: 35, color: '#F59E0B' },
      { name: 'Em Andamento', value: 28, color: '#3B82F6' },
      { name: 'Concluída', value: 71, color: '#10B981' },
      { name: 'Cancelada', value: 6, color: '#EF4444' },
    ];
  }

  async getOrdersByPriority() {
    await this.delay(600);
    return [
      { name: 'Baixa', value: 42, color: '#6B7280' },
      { name: 'Média', value: 56, color: '#F59E0B' },
      { name: 'Alta', value: 28, color: '#EF4444' },
      { name: 'Crítica', value: 9, color: '#991B1B' },
    ];
  }

  async getMonthlyTrend() {
    await this.delay(700);
    return [
      { month: 'Jan', total: 45, completed: 38, pending: 5, in_progress: 2 },
      { month: 'Fev', total: 52, completed: 42, pending: 7, in_progress: 3 },
      { month: 'Mar', total: 48, completed: 39, pending: 6, in_progress: 3 },
      { month: 'Abr', total: 61, completed: 48, pending: 8, in_progress: 5 },
      { month: 'Mai', total: 58, completed: 45, pending: 9, in_progress: 4 },
      { month: 'Jun', total: 67, completed: 52, pending: 10, in_progress: 5 },
    ];
  }

  // Utilitário para simular delay de rede
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockService = new MockService();
export default mockService;
