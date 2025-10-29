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

export function useSectorDashboardData(sector?: string) {
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

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar relatório filtrado por setor se fornecido
      const relatorio = await ordemServicoService.getRelatorio();
      
      // Se um setor específico foi selecionado, filtrar os dados
      let registros = relatorio.registros;
      
      if (sector && sector !== 'Geral') {
        registros = registros.filter(r => r.setor.nome === sector);
      }

      // Calcular total geral
      const totalOS = registros.reduce((sum, r) => sum + r.quantidade, 0);

      // O.S por Assunto (tipo de atividade)
      const assuntoMap = new Map<string, number>();
      registros.forEach(r => {
        const tipo = r.tipoAtividade.nome;
        assuntoMap.set(tipo, (assuntoMap.get(tipo) || 0) + r.quantidade);
      });
      const osPorAssunto = Array.from(assuntoMap.entries())
        .map(([tipo, quantidade]) => ({
          id: tipo,
          name: tipo,
          value: quantidade
        }))
        .sort((a, b) => b.value - a.value);

      // O.S por Colaborador
      const colaboradorMap = new Map<string, number>();
      registros.forEach(r => {
        const nome = r.colaborador.nome;
        colaboradorMap.set(nome, (colaboradorMap.get(nome) || 0) + r.quantidade);
      });
      const osPorColaborador = Array.from(colaboradorMap.entries())
        .map(([nome, quantidade]) => ({
          id: nome,
          name: nome,
          value: quantidade
        }))
        .sort((a, b) => b.value - a.value);

      // Carregar colaboradores para filtro
      let colaboradores: Array<{ id: string; funcionario: string }> = [];
      
      if (sector && sector !== 'Geral') {
        const colaboradoresResponse = await ordemServicoService.getColaboradores(sector);
        colaboradores = colaboradoresResponse.map(c => ({
          id: c.id,
          funcionario: c.nome
        }));
      } else {
        // Para dashboard geral, carregar colaboradores de todos os setores
        const setores = await ordemServicoService.getSetores();
        const allColabs = await Promise.all(
          setores.map(s => ordemServicoService.getColaboradores(s.nome))
        );
        colaboradores = allColabs.flat().map(c => ({
          id: c.id,
          funcionario: c.nome
        }));
      }

      // O.S por Cidade (dados do backend)
      const cidadeMap = new Map<string, string>(); // nome -> id
      const cidadeStats = new Map<string, number>(); // nome -> quantidade
      
      registros.forEach(r => {
        if (r.cidade) {
          // Mapear nome -> id
          if (!cidadeMap.has(r.cidade.nome)) {
            cidadeMap.set(r.cidade.nome, r.cidade.id);
          }
          // Contar quantidade por cidade
          cidadeStats.set(
            r.cidade.nome,
            (cidadeStats.get(r.cidade.nome) || 0) + r.quantidade
          );
        }
      });
      
      const osPorCidade = Array.from(cidadeStats.entries())
        .map(([nome, quantidade]) => ({
          id: cidadeMap.get(nome) || nome,
          name: nome,
          value: quantidade
        }))
        .sort((a, b) => b.value - a.value);

      setData({
        totalOS,
        osPorAssunto,
        osPorCidade,
        osPorColaborador,
        colaboradores
      });
        
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  }, [sector]);

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

