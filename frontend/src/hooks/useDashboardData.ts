'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordemServicoService } from '@/services/ordemServicoService';

interface DashboardData {
  totalOS: number;
  osPorAssunto: Array<{ name: string; value: number; id: string }>;
  osPorCidade: Array<{ name: string; value: number; id: string }>;
  osPorColaborador: Array<{ name: string; value: number; id: string }>;
  colaboradores: Array<{ id: string; funcionario: string }>;
}

interface DashboardFilters {
  dataInicio: string;
  dataFim: string;
  colaboradoresSelecionados: string[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    totalOS: 0,
    osPorAssunto: [],
    osPorCidade: [],
    osPorColaborador: [],
    colaboradores: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros padrão: último mês
  const getDefaultDates = () => {
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    
    return {
      dataInicio: lastMonth.toISOString().split('T')[0],
      dataFim: now.toISOString().split('T')[0]
    };
  };

  const [filters, setFilters] = useState<DashboardFilters>({
    ...getDefaultDates(),
    colaboradoresSelecionados: []
  });

  const formatDateForAPI = (date: string) => {
    return `${date} 00:00:00`;
  };

  const formatEndDateForAPI = (date: string) => {
    return `${date} 23:59:59`;
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro, tentar carregar dados do nosso sistema de cadastro em massa
      try {
        const relatorio = await ordemServicoService.getRelatorio();
        
        // Processar dados do nosso sistema
        const totalOS = relatorio.totalGeral;
        
        // O.S por Assunto (tipo de atividade)
        const osPorAssunto = Object.entries(relatorio.totalPorTipo).map(([tipo, quantidade]) => ({
          id: tipo,
          name: tipo,
          value: quantidade
        })).sort((a, b) => b.value - a.value);

        // O.S por Colaborador
        const osPorColaborador = Object.entries(relatorio.totalPorColaborador).map(([nome, quantidade]) => ({
          id: nome,
          name: nome,
          value: quantidade
        })).sort((a, b) => b.value - a.value);

        // Carregar colaboradores para filtro
        const colaboradoresResponse = await ordemServicoService.getColaboradores('FTTH');
        const colaboradores = colaboradoresResponse.map(c => ({
          id: c.id,
          funcionario: c.nome
        }));

        // Cidades (dados mockados por enquanto)
        const osPorCidade: Array<{ name: string; value: number; id: string }> = [
          { id: '1', name: 'Porto Alegre', value: 0 },
          { id: '2', name: 'Rio Pardo', value: 0 },
          { id: '3', name: 'Nova Petrópolis', value: 0 }
        ];

        setData({
          totalOS,
          osPorAssunto,
          osPorCidade,
          osPorColaborador,
          colaboradores
        });
        
      } catch {
        console.log('Sistema interno não disponível, usando IXC API...');
        
        // Fallback para IXC API
        const startDate = formatDateForAPI(filters.dataInicio);
        const endDate = formatEndDateForAPI(filters.dataFim);

        // Carregar dados completos do dashboard
        const dashboardData = await ixcApiService.getDashboardData(
          startDate,
          endDate,
          filters.colaboradoresSelecionados.length > 0 ? filters.colaboradoresSelecionados : undefined
        );

        // Processar dados para os gráficos
        const totalOS = dashboardData.osSetor.total;

        // O.S por Assunto
        const assuntoStats = new Map<string, number>();
        dashboardData.osAssunto.registros.forEach(os => {
          if (os.id_assunto) {
            assuntoStats.set(os.id_assunto, (assuntoStats.get(os.id_assunto) || 0) + 1);
          }
        });

        const osPorAssunto = Array.from(assuntoStats.entries()).map(([assuntoId, count]) => {
          const assunto = dashboardData.assuntos.registros.find(a => a.id === assuntoId);
          return {
            id: assuntoId,
            name: assunto?.assunto || `Assunto ${assuntoId}`,
            value: count
          };
        }).sort((a, b) => b.value - a.value);

        // O.S por Cidade  
        const cidadeStats = new Map<string, number>();
        dashboardData.osCidade.registros.forEach(os => {
          if (os.id_cidade) {
            cidadeStats.set(os.id_cidade, (cidadeStats.get(os.id_cidade) || 0) + 1);
          }
        });

        const osPorCidade = Array.from(cidadeStats.entries()).map(([cidadeId, count]) => {
          const cidade = dashboardData.cidades.registros.find(c => c.id === cidadeId);
          return {
            id: cidadeId,
            name: cidade?.nome || `Cidade ${cidadeId}`,
            value: count
          };
        }).sort((a, b) => b.value - a.value);

        // O.S por Colaborador
        const colaboradorStats = new Map<string, number>();
        dashboardData.osColaborador.registros.forEach(os => {
          if (os.id_tecnico) {
            colaboradorStats.set(os.id_tecnico, (colaboradorStats.get(os.id_tecnico) || 0) + 1);
          }
        });

        const osPorColaborador = Array.from(colaboradorStats.entries()).map(([tecnicoId, count]) => {
          const colaborador = dashboardData.colaboradores.registros.find(c => c.id === tecnicoId);
          return {
            id: tecnicoId,
            name: colaborador?.funcionario || `Colaborador ${tecnicoId}`,
            value: count
          };
        }).sort((a, b) => b.value - a.value);

        // Lista de colaboradores para o filtro
        const colaboradores = dashboardData.colaboradores.registros.map(c => ({
          id: c.id,
          funcionario: c.funcionario
        }));

        setData({
          totalOS,
          osPorAssunto,
          osPorCidade,
          osPorColaborador,
          colaboradores
        });
      }

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Carregar dados na inicialização e quando os filtros mudarem
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Funções para atualizar filtros
  const updateDateFilter = useCallback((dataInicio: string, dataFim: string) => {
    setFilters(prev => ({
      ...prev,
      dataInicio,
      dataFim
    }));
  }, []);

  const updateCollaboratorFilter = useCallback((colaboradoresSelecionados: string[]) => {
    setFilters(prev => ({
      ...prev,
      colaboradoresSelecionados
    }));
  }, []);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    data,
    loading,
    error,
    filters,
    updateDateFilter,
    updateCollaboratorFilter,
    refreshData
  };
}
