'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { CollaboratorFilter } from '@/components/dashboard/CollaboratorFilter';
import { OSPieChart, OSBarChart, OSCard } from '@/components/dashboard/OSChart';
import { BarChart3, RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthGuard();
  const { 
    data, 
    loading, 
    error, 
    filters, 
    updateDateFilter, 
    updateCollaboratorFilter, 
    refreshData 
  } = useDashboardData();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar userName={user?.email} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Filtros */}
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DateFilter
              startDate={filters.dataInicio}
              endDate={filters.dataFim}
              onDateChange={updateDateFilter}
            />
            <CollaboratorFilter
              colaboradores={data.colaboradores}
              selectedCollaborators={filters.colaboradoresSelecionados}
              onSelectionChange={updateCollaboratorFilter}
              loading={loading}
            />
          </div>

          {/* Botão de Atualizar */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Dashboard de Produtividade - O.S
            </h2>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    <p className="mt-1 text-xs">
                      Verifique se as variáveis de ambiente NEXT_PUBLIC_IXC_API_URL e NEXT_PUBLIC_IXC_TOKEN estão configuradas corretamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card de Total */}
          <div className="mb-6">
            <OSCard
              title="Total de O.S no Período"
              value={data.totalOS}
              loading={loading}
              icon={<BarChart3 className="h-6 w-6" />}
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de Pizza - O.S por Assunto */}
            <OSPieChart
              data={data.osPorAssunto}
              title="O.S por Assunto"
              loading={loading}
            />

            {/* Gráfico de Pizza - O.S por Cidade */}
            <OSPieChart
              data={data.osPorCidade}
              title="O.S por Cidade"
              loading={loading}
            />
          </div>

          {/* Gráfico de Barras - O.S por Colaborador */}
          <div className="mb-6">
            <OSBarChart
              data={data.osPorColaborador}
              title="O.S por Colaborador"
              loading={loading}
            />
          </div>

          {/* Resumo de Período */}
          {!loading && !error && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo do Período</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-600">Período analisado:</p>
                  <p className="font-medium">
                    {new Date(filters.dataInicio).toLocaleDateString('pt-BR')} - {new Date(filters.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Colaboradores:</p>
                  <p className="font-medium">
                    {filters.colaboradoresSelecionados.length === 0 ? 'Todos' : `${filters.colaboradoresSelecionados.length} selecionados`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Última atualização:</p>
                  <p className="font-medium">
                    {new Date().toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

