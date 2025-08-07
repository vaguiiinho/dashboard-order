import React, { useState } from 'react';
import Head from 'next/head';
import { usePermissions } from '@/contexts/AuthContext';
import { DashboardFilters } from '@/types';
import StatsOverview from '@/components/Dashboard/StatsOverview';
import PieChart from '@/components/Dashboard/Charts/PieChart';
import BarChart from '@/components/Dashboard/Charts/BarChart';
import LineChart from '@/components/Dashboard/Charts/LineChart';
import {
  useOrdersByCategory,
  useOrdersByDepartment,
  useOrdersByCity,
  useOrdersByStatus,
  useOrdersByPriority,
  useMonthlyTrend,
} from '@/hooks/useDashboard';
import {
  RefreshCw,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';
import Button from '@/components/UI/Button';

const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { canViewDashboard } = usePermissions();

  // Hooks para buscar dados dos gráficos
  const categoriesQuery = useOrdersByCategory(filters);
  const departmentsQuery = useOrdersByDepartment(filters);
  const citiesQuery = useOrdersByCity(filters);
  const statusQuery = useOrdersByStatus(filters);
  const priorityQuery = useOrdersByPriority(filters);
  const trendQuery = useMonthlyTrend(filters);

  // Função para atualizar todos os dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        categoriesQuery.refetch(),
        departmentsQuery.refetch(),
        citiesQuery.refetch(),
        statusQuery.refetch(),
        priorityQuery.refetch(),
        trendQuery.refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Verificar permissões
  if (!canViewDashboard()) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-secondary-600">
            Você não tem permissão para visualizar o dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Ordens de Serviço</title>
        <meta name="description" content="Dashboard principal do sistema de ordens de serviço" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-600">
              Visão geral das ordens de serviço
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              leftIcon={<Filter className="h-4 w-4" />}
              onClick={() => {
                // TODO: Abrir modal de filtros
                console.log('Abrir filtros');
              }}
            >
              Filtros
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              Atualizar
            </Button>
            
            <Button
              variant="primary"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => {
                // TODO: Implementar exportação
                console.log('Exportar dados');
              }}
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Estatísticas resumidas */}
        <StatsOverview filters={filters} />

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ordens por Status */}
          <PieChart
            title="Ordens por Status"
            data={statusQuery.data}
            isLoading={statusQuery.isLoading}
            error={statusQuery.error?.message}
          />

          {/* Ordens por Prioridade */}
          <PieChart
            title="Ordens por Prioridade"
            data={priorityQuery.data}
            isLoading={priorityQuery.isLoading}
            error={priorityQuery.error?.message}
          />
        </div>

        {/* Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ordens por Categoria */}
          <BarChart
            title="Ordens por Categoria"
            data={categoriesQuery.data}
            isLoading={categoriesQuery.isLoading}
            error={categoriesQuery.error?.message}
            color="#3B82F6"
          />

          {/* Ordens por Departamento */}
          <BarChart
            title="Ordens por Departamento"
            data={departmentsQuery.data}
            isLoading={departmentsQuery.isLoading}
            error={departmentsQuery.error?.message}
            color="#10B981"
          />
        </div>

        {/* Gráfico de cidades */}
        <div className="grid grid-cols-1">
          <BarChart
            title="Ordens por Cidade"
            data={citiesQuery.data}
            isLoading={citiesQuery.isLoading}
            error={citiesQuery.error?.message}
            color="#F59E0B"
            height={350}
          />
        </div>

        {/* Tendência mensal */}
        <div className="grid grid-cols-1">
          <LineChart
            title="Tendência Mensal"
            data={trendQuery.data}
            isLoading={trendQuery.isLoading}
            error={trendQuery.error?.message}
            height={400}
          />
        </div>

        {/* Informações adicionais */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-primary-800">
                Última atualização
              </h3>
              <p className="text-sm text-primary-600">
                {new Date().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
