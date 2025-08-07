import { apiService } from './api';
import { mockService } from './mock.service';
import {
  DashboardData,
  DashboardFilters,
  ApiResponse,
} from '@/types';

// Flag para usar mock em desenvolvimento
const USE_MOCK = process.env.NEXT_PUBLIC_APP_ENV === 'development';

class DashboardService {
  /**
   * Obtém dados completos do dashboard
   */
  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    const params = this.buildFilterParams(filters);
    const response = await apiService.get<DashboardData>('/dashboard', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados do dashboard');
  }

  /**
   * Obtém dados de ordens por categoria
   */
  async getOrdersByCategory(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getOrdersByCategory();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-category', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por categoria');
  }

  /**
   * Obtém dados de ordens por departamento
   */
  async getOrdersByDepartment(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getOrdersByDepartment();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-department', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por departamento');
  }

  /**
   * Obtém dados de ordens por cidade
   */
  async getOrdersByCity(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getOrdersByCity();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-city', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por cidade');
  }

  /**
   * Obtém dados de ordens por colaborador
   */
  async getOrdersByCollaborator(filters?: DashboardFilters) {
    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-collaborator', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por colaborador');
  }

  /**
   * Obtém dados de ordens por estrutura
   */
  async getOrdersByStructure(filters?: DashboardFilters) {
    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-structure', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por estrutura');
  }

  /**
   * Obtém dados de ordens por status
   */
  async getOrdersByStatus(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getOrdersByStatus();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-status', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por status');
  }

  /**
   * Obtém dados de ordens por prioridade
   */
  async getOrdersByPriority(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getOrdersByPriority();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/by-priority', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar dados por prioridade');
  }

  /**
   * Obtém tendência mensal
   */
  async getMonthlyTrend(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getMonthlyTrend();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/monthly-trend', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar tendência mensal');
  }

  /**
   * Obtém estatísticas resumidas
   */
  async getSummaryStats(filters?: DashboardFilters) {
    if (USE_MOCK) {
      return await mockService.getSummaryStats();
    }

    const params = this.buildFilterParams(filters);
    const response = await apiService.get('/dashboard/summary', { params });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Erro ao carregar estatísticas resumidas');
  }

  /**
   * Exporta dados do dashboard
   */
  async exportDashboardData(
    format: 'pdf' | 'excel' | 'csv',
    filters?: DashboardFilters
  ): Promise<void> {
    const params = {
      ...this.buildFilterParams(filters),
      format,
    };
    
    await apiService.download(`/dashboard/export`, `dashboard-report.${format}`);
  }

  /**
   * Constrói parâmetros de filtro para as requisições
   */
  private buildFilterParams(filters?: DashboardFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.dateRange) {
      params.start_date = filters.dateRange.start;
      params.end_date = filters.dateRange.end;
    }

    if (filters.categories && filters.categories.length > 0) {
      params.categories = filters.categories.join(',');
    }

    if (filters.departments && filters.departments.length > 0) {
      params.departments = filters.departments.join(',');
    }

    if (filters.cities && filters.cities.length > 0) {
      params.cities = filters.cities.join(',');
    }

    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(',');
    }

    if (filters.priority && filters.priority.length > 0) {
      params.priority = filters.priority.join(',');
    }

    if (filters.assignees && filters.assignees.length > 0) {
      params.assignees = filters.assignees.join(',');
    }

    return params;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
