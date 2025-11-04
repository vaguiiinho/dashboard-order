'use client';

import { useState, useEffect } from 'react';
import { ordemServicoService, RelatorioResponse } from '@/services/ordemServicoService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { RealTimeMetrics } from './MetricCard';
import { DashboardFilters } from './DashboardFilters';

interface GeneralDashboardProps {
  className?: string;
}

// Cores modernas para os gráficos
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
];



export function GeneralDashboard({ className = '' }: GeneralDashboardProps) {
  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordemServicoService.getRelatorio({
        mes: startDate ? new Date(startDate).getMonth().toString() : undefined,
        ano: startDate ? new Date(startDate).getFullYear().toString() : undefined
      });
      setRelatorio(data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (start: string, _end: string) => {
    loadData(start, _end);
  };

  const handleExport = () => {
    // Implementar exportação
    console.log('Exportando dados...');
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center">
          <div className="text-red-400 mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!relatorio) return null;

  // Preparar dados para os gráficos
  const setoresData = Object.entries(relatorio.totalPorSetor)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);

  const colaboradoresData = Object.entries(relatorio.totalPorColaborador)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10); // Top 10 colaboradores

  const tiposData = Object.entries(relatorio.totalPorTipo)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);

  // Dados para gráfico de linha (simulação de evolução mensal)
  const evolucaoData = [
    { mes: 'Jan', total: Math.floor(relatorio.totalGeral * 0.8) },
    { mes: 'Fev', total: Math.floor(relatorio.totalGeral * 0.9) },
    { mes: 'Mar', total: Math.floor(relatorio.totalGeral * 0.95) },
    { mes: 'Abr', total: relatorio.totalGeral },
    { mes: 'Mai', total: Math.floor(relatorio.totalGeral * 1.1) },
    { mes: 'Jun', total: Math.floor(relatorio.totalGeral * 1.2) },
  ];

  const ChartCard = ({ 
    title, 
    children, 
    icon: Icon,
    className = '' 
  }: {
    title: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
  }) => (
    <div className={`dashboard-card rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold dashboard-card-title">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
      </div>
      {children}
    </div>
  );

  return (
    <div className={`space-y-6 ${className} relative z-10`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold dashboard-text-primary mb-2">Dashboard Geral</h1>
        <p className="dashboard-text-secondary text-lg">Visão completa dos dados de ordem de serviço</p>
      </div>

      {/* Filtros */}
      <DashboardFilters
        onDateRangeChange={handleDateRangeChange}
        onRefresh={() => loadData()}
        onExport={handleExport}
        loading={loading}
      />

      {/* Métricas em tempo real */}
      <RealTimeMetrics
        data={{
          totalOS: relatorio.totalGeral,
          totalSetores: Object.keys(relatorio.totalPorSetor).length,
          totalColaboradores: Object.keys(relatorio.totalPorColaborador).length,
          totalCidades: Object.keys(relatorio.totalPorCidade).length,
        }}
        loading={loading}
      />

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Distribuição por Setor */}
        <ChartCard title="Distribuição por Setor" icon={PieChartIcon}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={setoresData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {setoresData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [Number(value).toLocaleString('pt-BR'), 'Quantidade']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico de Barras - Top Colaboradores */}
        <ChartCard title="Top 10 Colaboradores" icon={BarChart3}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={colaboradoresData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="nome" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <Tooltip 
                  formatter={(value: number) => [Number(value).toLocaleString('pt-BR'), 'Quantidade']}
                />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Área - Evolução Mensal */}
        <ChartCard title="Evolução Mensal" icon={LineChartIcon}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolucaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mes" 
                  fontSize={12}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <Tooltip 
                  formatter={(value: number) => [Number(value).toLocaleString('pt-BR'), 'Total']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico de Barras Horizontais - Tipos de Atividade */}
        <ChartCard title="Tipos de Atividade" icon={BarChart3}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={tiposData} 
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  fontSize={12}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <YAxis 
                  dataKey="nome" 
                  type="category" 
                  fontSize={12} 
                  width={120}
                  tick={{ fill: '#1e40af' }}
                  stroke="#1e40af"
                />
                <Tooltip 
                  formatter={(value: number) => [Number(value).toLocaleString('pt-BR'), 'Quantidade']}
                />
                <Bar dataKey="total" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Tabela de resumo */}
      <div className="dashboard-card rounded-xl shadow-sm">
        <div className="p-6 border-b border-blue-200">
          <h3 className="text-lg font-semibold dashboard-card-title">Resumo por Setor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="dashboard-table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total de O.S
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Colaboradores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {setoresData.map((setor, index) => (
                <tr key={setor.nome} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3 shadow-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="text-sm font-medium dashboard-table-text">{setor.nome}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold dashboard-table-text">
                    {typeof window === 'undefined' ? setor.total : Number(setor.total).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dashboard-table-text">
                    {Object.keys(relatorio.totalPorColaborador).filter(col => 
                      relatorio.registros.some(r => r.setor.nome === setor.nome && r.colaborador.nome === col)
                    ).length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dashboard-table-text">
                    {((setor.total / relatorio.totalGeral) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
