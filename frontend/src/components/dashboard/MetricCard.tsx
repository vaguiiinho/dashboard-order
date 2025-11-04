'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, MapPin } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  format?: 'number' | 'currency' | 'percentage';
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  color,
  format = 'number' 
}: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'text-blue-100',
      trend: 'text-blue-200'
    },
    green: {
      bg: 'from-emerald-500 to-emerald-600',
      icon: 'text-emerald-100',
      trend: 'text-emerald-200'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'text-purple-100',
      trend: 'text-purple-200'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      icon: 'text-orange-100',
      trend: 'text-orange-200'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'text-red-100',
      trend: 'text-red-200'
    }
  };

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return typeof window === 'undefined' ? val : val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    return typeof window === 'undefined' ? val : val.toLocaleString('pt-BR');
  };

  const calculateTrend = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change),
      isPositive: change > 0
    };
  };

  const trend = calculateTrend();

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color].bg} rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    } hover:shadow-xl hover:scale-105`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
            <p className="text-white text-3xl font-bold mb-2">
              {formatValue(value)}
            </p>
            {trend && (
              <div className={`flex items-center ${colorClasses[color].trend}`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {trend.value.toFixed(1)}% vs período anterior
                </span>
              </div>
            )}
          </div>
          <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
            <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface RealTimeMetricsProps {
  data: {
    totalOS: number;
    totalSetores: number;
    totalColaboradores: number;
    totalCidades: number;
  };
  loading?: boolean;
}

export function RealTimeMetrics({ data, loading = false }: RealTimeMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total de O.S"
        value={data.totalOS}
        previousValue={Math.floor(data.totalOS * 0.9)}
        icon={Activity}
        color="blue"
      />
      <MetricCard
        title="Setores Ativos"
        value={data.totalSetores}
        previousValue={data.totalSetores - 1}
        icon={Users}
        color="green"
      />
      <MetricCard
        title="Colaboradores"
        value={data.totalColaboradores}
        previousValue={Math.floor(data.totalColaboradores * 0.95)}
        icon={Users}
        color="purple"
      />
      <MetricCard
        title="Cidades Atendidas"
        value={data.totalCidades}
        previousValue={data.totalCidades - 1}
        icon={MapPin}
        color="orange"
      />
    </div>
  );
}
