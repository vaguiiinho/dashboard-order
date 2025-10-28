'use client';

import { DateFilter } from '@/components/dashboard/DateFilter';
import { CollaboratorFilter } from '@/components/dashboard/CollaboratorFilter';
import { OSPieChart, OSBarChart } from '@/components/dashboard/OSChart';
import { ClientTime } from '@/components/ui/ClientTime';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardContentProps {
  data: {
    totalOS: number;
    osPorAssunto: Array<{ name: string; value: number; id: string }>;
    osPorCidade: Array<{ name: string; value: number; id: string }>;
    osPorColaborador: Array<{ name: string; value: number; id: string }>;
    colaboradores: Array<{ id: string; funcionario: string }>;
  };
  loading: boolean;
  error: string | null;
  filters: {
    dataInicio: string;
    dataFim: string;
    colaboradoresSelecionados: string[];
  };
  onDateChange: (dataInicio: string, dataFim: string) => void;
  onCollaboratorChange: (colaboradores: string[]) => void;
  onRefresh: () => void;
  sector?: string;
}

export function DashboardContent({
  data,
  loading,
  error,
  filters,
  onDateChange,
  onCollaboratorChange,
  onRefresh,
  sector
}: DashboardContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with sector info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {sector ? `Dashboard - ${sector}` : 'Dashboard Geral'}
          </h1>
          <p className="text-gray-600">
            Análise de produtividade e desempenho
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DateFilter
            startDate={filters.dataInicio}
            endDate={filters.dataFim}
            onDateChange={onDateChange}
          />
          <CollaboratorFilter
            colaboradores={data.colaboradores}
            selectedCollaborators={filters.colaboradoresSelecionados}
            onSelectionChange={onCollaboratorChange}
            loading={loading}
          />
        </div>

        {/* Action bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Estatísticas em Tempo Real
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Última atualização: <ClientTime />
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total de O.S</h3>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            {/* Guard locale-dependent formatting to avoid SSR/client mismatch */}
            <p className="text-4xl font-bold" suppressHydrationWarning>
              {typeof window === 'undefined' ? data.totalOS : Number(data.totalOS).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Colaboradores</h3>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">
              {filters.colaboradoresSelecionados.length === 0 
                ? data.colaboradores.length 
                : filters.colaboradoresSelecionados.length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Período</h3>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {/* Avoid locale-dependent rendering on the server to prevent hydration mismatch */}
            <p className="text-sm font-medium" suppressHydrationWarning>
              {typeof window === 'undefined' ? 'Carregando...' : `${new Date(filters.dataInicio).toLocaleDateString('pt-BR')} - ${new Date(filters.dataFim).toLocaleDateString('pt-BR')}`}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Pie Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <OSPieChart
              data={data.osPorAssunto}
              title="O.S por Assunto"
              loading={loading}
            />
            <OSPieChart
              data={data.osPorCidade}
              title="O.S por Cidade"
              loading={loading}
            />
          </div>

          {/* Bar Chart */}
          <div>
            <OSBarChart
              data={data.osPorColaborador}
              title="O.S por Colaborador"
              loading={loading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

