import { useQuery, UseQueryResult } from 'react-query';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardData, DashboardFilters } from '@/types';

/**
 * Hook para buscar dados completos do dashboard
 */
export function useDashboardData(
  filters?: DashboardFilters
): UseQueryResult<DashboardData, Error> {
  return useQuery(
    ['dashboard', filters],
    () => dashboardService.getDashboardData(filters),
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchInterval: 1000 * 60 * 10, // Atualiza a cada 10 minutos
    }
  );
}

/**
 * Hook para buscar dados por categoria
 */
export function useOrdersByCategory(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-category', filters],
    () => dashboardService.getOrdersByCategory(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por departamento
 */
export function useOrdersByDepartment(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-department', filters],
    () => dashboardService.getOrdersByDepartment(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por cidade
 */
export function useOrdersByCity(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-city', filters],
    () => dashboardService.getOrdersByCity(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por colaborador
 */
export function useOrdersByCollaborator(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-collaborator', filters],
    () => dashboardService.getOrdersByCollaborator(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por estrutura
 */
export function useOrdersByStructure(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-structure', filters],
    () => dashboardService.getOrdersByStructure(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por status
 */
export function useOrdersByStatus(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-status', filters],
    () => dashboardService.getOrdersByStatus(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar dados por prioridade
 */
export function useOrdersByPriority(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'by-priority', filters],
    () => dashboardService.getOrdersByPriority(filters),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}

/**
 * Hook para buscar tendência mensal
 */
export function useMonthlyTrend(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'monthly-trend', filters],
    () => dashboardService.getMonthlyTrend(filters),
    {
      staleTime: 1000 * 60 * 10,
    }
  );
}

/**
 * Hook para buscar estatísticas resumidas
 */
export function useSummaryStats(filters?: DashboardFilters) {
  return useQuery(
    ['dashboard', 'summary', filters],
    () => dashboardService.getSummaryStats(filters),
    {
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
    }
  );
}
