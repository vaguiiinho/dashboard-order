'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { ordemServicoService, Colaborador, TipoAtividade } from '@/services/ordemServicoService';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  TrendingUp,
  BarChart3,
  Users,
  ClipboardList,
  Trash2,
  Download,
  Loader2,
} from 'lucide-react';

// Schema de validação
const ordemServicoSchema = z.object({
  setor: z.enum(['FTTH', 'INFRAESTRUTURA', 'SUPORTE', 'FINANCEIRO']),
  tipoAtividade: z.string().min(1, 'Selecione o tipo de atividade'),
  colaborador: z.string().min(1, 'Selecione um colaborador'),
  quantidade: z.number().min(1, 'Quantidade deve ser no mínimo 1'),
  mes: z.string().min(1, 'Selecione o mês'),
  ano: z.string().min(1, 'Selecione o ano'),
});

type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>;

// Schema para múltiplos registros
type RegistroOS = {
  setor: string;
  tipoAtividade: string;
  colaborador: string;
  quantidade: number;
  mes: string;
  ano: string;
  id: string;
};

// Dados mockados para os dropdowns
const setores = ['FTTH', 'INFRAESTRUTURA', 'SUPORTE', 'FINANCEIRO'];

const tiposAtividade = {
  FTTH: [
    'Instalação',
    'Adequação',
    'Sem Conexão',
    'Verificação de Equipamento',
    'Recuperação de Crédito',
    'Retirada (Cancelamento/Negativados)',
    'Consultiva',
    'Mudança de Endereço',
    'Sinal Atenuado',
    'Problemas na TV',
    'Retrabalho',
    'Telefonia',
    'Instalação TV',
    'Instalação Rede Mesh',
  ],
  INFRAESTRUTURA: [
    'Manutenção BKB Indisponível',
    'Manutenção FTTH Indisponível',
    'Ampliação Rede FTTH',
    'Instalação Pop BKB',
    'Manutenção Predial',
    'Manutenção FTTH Prejudicado',
    'Manutenção BKB Prejudicado',
  ],
  SUPORTE: [
    'Suporte Técnico - Sem Conexão',
    'Suporte Técnico - Problema Sinal Wi-fi',
    'Suporte Téc. sem retorno do cliente',
    'Suporte Técnico - Dúvidas e informações',
    'Suporte Técnico - Tubaplay',
    'Envio de fatura / Desbloqueio',
    'Troca de endereço',
    'Suporte Técnico - Senha / Nome Wi-Fi',
    'Troca de login',
    'Direcionamento de Portas',
    'Suporte Técnico - Problema no STB',
    'Suporte Técnico - Telefonia',
  ],
  FINANCEIRO: [
    'Recuperação de Crédito/Visita',
    'Retirada de Equipamento',
    'Cobrança',
    'Negativação',
  ],
};

const colaboradores = {
  FTTH: ['Alan', 'Páscoa', 'Everson', 'Carlos', 'Kassio', 'Ralfe', 'Alisson'],
  INFRAESTRUTURA: ['Emerson', 'Julio', 'Matheus', 'Maurício', 'Cristiano', 'Severo', 'Joel'],
  SUPORTE: ['Equipe Suporte'],
  FINANCEIRO: ['Equipe Financeiro'],
};

const meses = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const anos = ['2024', '2025', '2026'];

export default function OrdemServicoPage() {
  const [registros, setRegistros] = useState<RegistroOS[]>([]);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colaboradoresDisponiveis, setColaboradoresDisponiveis] = useState<Colaborador[]>([]);
  const [tiposAtividadeDisponiveis, setTiposAtividadeDisponiveis] = useState<TipoAtividade[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoSchema),
  });

  const setorSelecionado = watch('setor');

  // Carregar colaboradores e tipos de atividade quando o setor mudar
  useEffect(() => {
    if (setorSelecionado) {
      setLoading(true);
      Promise.all([
        ordemServicoService.getColaboradores(setorSelecionado),
        ordemServicoService.getTiposAtividade(setorSelecionado),
      ])
        .then(([colab, tipos]) => {
          setColaboradoresDisponiveis(colab);
          setTiposAtividadeDisponiveis(tipos);
        })
        .catch((error) => {
          console.error('Erro ao carregar dados:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setorSelecionado]);

  const onSubmit = async (data: OrdemServicoFormData) => {
    try {
      setLoading(true);
      await ordemServicoService.createRegistro(data);
      
      const novoRegistro: RegistroOS = {
        ...data,
        id: crypto.randomUUID(),
      };
      setRegistros([...registros, novoRegistro]);
      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      alert('Erro ao criar registro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const removerRegistro = (id: string) => {
    setRegistros(registros.filter((r) => r.id !== id));
  };

  const calcularEstatisticas = () => {
    const totalPorSetor: Record<string, number> = {};
    const totalPorColaborador: Record<string, number> = {};
    const totalPorTipo: Record<string, number> = {};
    const totalGeral = registros.reduce((acc, r) => acc + r.quantidade, 0);

    registros.forEach((r) => {
      totalPorSetor[r.setor] = (totalPorSetor[r.setor] || 0) + r.quantidade;
      totalPorColaborador[r.colaborador] = (totalPorColaborador[r.colaborador] || 0) + r.quantidade;
      totalPorTipo[r.tipoAtividade] = (totalPorTipo[r.tipoAtividade] || 0) + r.quantidade;
    });

    return { totalGeral, totalPorSetor, totalPorColaborador, totalPorTipo };
  };

  const gerarRelatorio = () => {
    setShowRelatorio(true);
  };

  const exportarRelatorio = () => {
    const stats = calcularEstatisticas();
    const dados = JSON.stringify({ registros, estatisticas: stats }, null, 2);
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-os-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const stats = calcularEstatisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Cadastro em Massa de O.S
            </h1>
            <p className="text-gray-600">
              Registre múltiplas O.S por colaborador e tipo de serviço
            </p>
          </div>

          {/* Cards de Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Registros</p>
                  <p className="text-3xl font-bold text-blue-600">{registros.length}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de O.S</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalGeral}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Colaboradores</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Object.keys(stats.totalPorColaborador).length}
                  </p>
                </div>
                <Users className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Setores</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {Object.keys(stats.totalPorSetor).length}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-orange-600 opacity-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Plus className="w-6 h-6 mr-3" />
                  Adicionar Registro
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Setor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Setor <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('setor')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o setor</option>
                      {setores.map((setor) => (
                        <option key={setor} value={setor}>
                          {setor}
                        </option>
                      ))}
                    </select>
                    {errors.setor && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.setor.message}
                      </p>
                    )}
                  </div>

                  {/* Colaborador */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Colaborador <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('colaborador')}
                      disabled={!setorSelecionado || loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loading ? 'Carregando...' : setorSelecionado ? 'Selecione o colaborador' : 'Selecione o setor primeiro'}
                      </option>
                      {colaboradoresDisponiveis.map((colab) => (
                        <option key={colab.id} value={colab.nome}>
                          {colab.nome}
                        </option>
                      ))}
                    </select>
                    {errors.colaborador && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.colaborador.message}
                      </p>
                    )}
                  </div>

                  {/* Tipo de Atividade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Atividade <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('tipoAtividade')}
                      disabled={!setorSelecionado || loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loading ? 'Carregando...' : setorSelecionado ? 'Selecione a atividade' : 'Selecione o setor primeiro'}
                      </option>
                      {tiposAtividadeDisponiveis.map((tipo) => (
                        <option key={tipo.id} value={tipo.nome}>
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                    {errors.tipoAtividade && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.tipoAtividade.message}
                      </p>
                    )}
                  </div>

                  {/* Quantidade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('quantidade', { valueAsNumber: true })}
                      placeholder="Ex: 80"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {errors.quantidade && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.quantidade.message}
                      </p>
                    )}
                  </div>

                  {/* Mês */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mês <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('mes')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o mês</option>
                      {meses.map((mes) => (
                        <option key={mes.value} value={mes.value}>
                          {mes.label}
                        </option>
                      ))}
                    </select>
                    {errors.mes && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.mes.message}
                      </p>
                    )}
                  </div>

                  {/* Ano */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ano <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('ano')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o ano</option>
                      {anos.map((ano) => (
                        <option key={ano} value={ano}>
                          {ano}
                        </option>
                      ))}
                    </select>
                    {errors.ano && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.ano.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Adicionar Registro</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lista de Registros */}
            {registros.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 mr-3" />
                    Registros Adicionados ({registros.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="space-y-3">
                    {registros.map((registro) => (
                      <div
                        key={registro.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{registro.colaborador}</p>
                              <p className="text-sm text-gray-600">
                                {registro.setor} - {registro.tipoAtividade}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">{registro.quantidade}</p>
                              <p className="text-xs text-gray-500">
                                {meses.find((m) => m.value === registro.mes)?.label} {registro.ano}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removerRegistro(registro.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Remover registro"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Painel Lateral - Estatísticas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Estatísticas
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {registros.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum registro ainda</p>
                  </div>
                ) : (
                  <>
                    {/* Por Setor */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Por Setor
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(stats.totalPorSetor)
                          .sort(([, a], [, b]) => b - a)
                          .map(([setor, qtd]) => (
                            <div key={setor} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium text-gray-700">{setor}</span>
                              <span className="text-lg font-bold text-blue-600">{qtd}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Por Colaborador */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Por Colaborador
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Object.entries(stats.totalPorColaborador)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([colab, qtd]) => (
                            <div key={colab} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium text-gray-700 truncate">{colab}</span>
                              <span className="text-lg font-bold text-green-600">{qtd}</span>
                            </div>
                          ))}
                        {Object.keys(stats.totalPorColaborador).length > 5 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{Object.keys(stats.totalPorColaborador).length - 5} mais
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Por Tipo */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Tipos Mais Comuns
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Object.entries(stats.totalPorTipo)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([tipo, qtd]) => (
                            <div key={tipo} className="p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600 truncate">{tipo}</p>
                              <p className="text-lg font-bold text-purple-600">{qtd}</p>
                            </div>
                          ))}
                        {Object.keys(stats.totalPorTipo).length > 5 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{Object.keys(stats.totalPorTipo).length - 5} mais
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={gerarRelatorio}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span>Ver Relatório Completo</span>
                      </button>
                      <button
                        onClick={exportarRelatorio}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                      >
                        <Download className="w-5 h-5" />
                        <span>Exportar Dados</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Relatório Completo */}
        {showRelatorio && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Relatório Completo
                </h2>
                <button
                  onClick={() => setShowRelatorio(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Estatísticas Gerais */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas Gerais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total de Registros</p>
                      <p className="text-3xl font-bold text-blue-600">{registros.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total de O.S</p>
                      <p className="text-3xl font-bold text-green-600">{stats.totalGeral}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Colaboradores</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {Object.keys(stats.totalPorColaborador).length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Setores</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {Object.keys(stats.totalPorSetor).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Por Setor */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quantidade Total por Setor</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Setor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantidade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(stats.totalPorSetor)
                          .sort(([, a], [, b]) => b - a)
                          .map(([setor, qtd]) => (
                            <tr key={setor} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{setor}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-blue-600">{qtd.toLocaleString('pt-BR')}</div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Por Colaborador */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quantidade por Colaborador</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Colaborador
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantidade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(stats.totalPorColaborador)
                          .sort(([, a], [, b]) => b - a)
                          .map(([colab, qtd]) => (
                            <tr key={colab} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{colab}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-green-600">{qtd.toLocaleString('pt-BR')}</div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Por Tipo/Serviço */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quantidade por Tipo de Serviço</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo de Serviço
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantidade
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(stats.totalPorTipo)
                            .sort(([, a], [, b]) => b - a)
                            .map(([tipo, qtd]) => (
                              <tr key={tipo} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{tipo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-purple-600">{qtd.toLocaleString('pt-BR')}</div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast de Sucesso */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in z-50">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Registro adicionado com sucesso!</span>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
