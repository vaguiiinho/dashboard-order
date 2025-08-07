import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import StatsCard from './StatsCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { useSummaryStats } from '@/hooks/useDashboard';
import { DashboardFilters } from '@/types';

interface StatsOverviewProps {
  filters?: DashboardFilters;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ filters }) => {
  const { data, isLoading, error } = useSummaryStats(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-lg border border-secondary-200 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">Erro ao carregar estatísticas</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      title: 'Total de Ordens',
      value: data.totalOrders || 0,
      icon: FileText,
      color: 'blue' as const,
      description: 'Todas as ordens cadastradas',
    },
    {
      title: 'Pendentes',
      value: data.pendingOrders || 0,
      icon: Clock,
      color: 'yellow' as const,
      description: 'Aguardando atendimento',
    },
    {
      title: 'Em Andamento',
      value: data.inProgressOrders || 0,
      icon: AlertTriangle,
      color: 'blue' as const,
      description: 'Sendo executadas',
    },
    {
      title: 'Concluídas',
      value: data.completedOrders || 0,
      icon: CheckCircle,
      color: 'green' as const,
      description: 'Finalizadas com sucesso',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
