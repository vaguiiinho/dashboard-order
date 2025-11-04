'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ordemServicoService, Colaborador, TipoAtividade, Setor, Cidade } from '@/services/ordemServicoService';
import { Button } from '@/components/ui/Button';
import { 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

// Schema de validação
const ordemServicoSchema = z.object({
  setor: z.enum(['FTTH', 'INFRAESTRUTURA', 'SUPORTE', 'FINANCEIRO']),
  tipoAtividade: z.string().min(1, 'Selecione o tipo de atividade'),
  colaborador: z.string().min(1, 'Selecione um colaborador'),
  cidade: z.string().min(1, 'Selecione a cidade'),
  quantidade: z.number().min(1, 'Quantidade deve ser no mínimo 1'),
  mes: z.string().min(1, 'Selecione o mês'),
  ano: z.string().min(1, 'Selecione o ano'),
});

type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>;

export function NovaOSForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [tiposAtividade, setTiposAtividade] = useState<TipoAtividade[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoSchema),
    defaultValues: {
      quantidade: 1,
      mes: new Date().toLocaleString('pt-BR', { month: '2-digit' }),
      ano: new Date().getFullYear().toString(),
    },
  });

  const selectedSetor = watch('setor');

  useEffect(() => {
    loadSetores();
    loadCidades();
  }, []);

  useEffect(() => {
    if (selectedSetor) {
      loadColaboradoresETipos(selectedSetor);
    }
  }, [selectedSetor]);

  const loadSetores = async () => {
    try {
      const data = await ordemServicoService.getSetores();
      setSetores(data.filter(s => s.ativo));
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  };

  const loadCidades = async () => {
    try {
      const data = await ordemServicoService.getCidades();
      setCidades(data.filter(c => c.ativo));
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const loadColaboradoresETipos = async (setor: string) => {
    try {
      const [colabs, tipos] = await Promise.all([
        ordemServicoService.getColaboradores(setor),
        ordemServicoService.getTiposAtividade(setor),
      ]);
      
      setColaboradores(colabs.filter(c => c.ativo));
      setTiposAtividade(tipos.filter(t => t.ativo));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onSubmit = async (data: OrdemServicoFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await ordemServicoService.createRegistro(data);
      
      setSuccess(true);
      reset();
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      setError('Erro ao salvar registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
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

  const anos = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dashboard-text-primary mb-2">Nova Ordem de Serviço</h1>
        <p className="dashboard-text-secondary">Cadastre uma nova ordem de serviço no sistema</p>
      </div>

      {/* Mensagens de feedback */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Sucesso!</h3>
              <p className="text-sm text-green-700 mt-1">Ordem de serviço cadastrada com sucesso.</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <div className="dashboard-card rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor *
              </label>
              <select
                {...register('setor')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o setor</option>
                {setores.map((setor) => (
                  <option key={setor.id} value={setor.nome}>
                    {setor.nome}
                  </option>
                ))}
              </select>
              {errors.setor && (
                <p className="mt-1 text-sm text-red-600">{errors.setor.message}</p>
              )}
            </div>

            {/* Colaborador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colaborador *
              </label>
              <select
                {...register('colaborador')}
                disabled={!selectedSetor}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Selecione o colaborador</option>
                {colaboradores.map((colaborador) => (
                  <option key={colaborador.id} value={colaborador.nome}>
                    {colaborador.nome}
                  </option>
                ))}
              </select>
              {errors.colaborador && (
                <p className="mt-1 text-sm text-red-600">{errors.colaborador.message}</p>
              )}
            </div>

            {/* Tipo de Atividade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atividade *
              </label>
              <select
                {...register('tipoAtividade')}
                disabled={!selectedSetor}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Selecione o tipo de atividade</option>
                {tiposAtividade.map((tipo) => (
                  <option key={tipo.id} value={tipo.nome}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
              {errors.tipoAtividade && (
                <p className="mt-1 text-sm text-red-600">{errors.tipoAtividade.message}</p>
              )}
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <select
                {...register('cidade')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              {errors.cidade && (
                <p className="mt-1 text-sm text-red-600">{errors.cidade.message}</p>
              )}
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                min="1"
                {...register('quantidade', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.quantidade && (
                <p className="mt-1 text-sm text-red-600">{errors.quantidade.message}</p>
              )}
            </div>

            {/* Mês */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês *
              </label>
              <select
                {...register('mes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
              {errors.mes && (
                <p className="mt-1 text-sm text-red-600">{errors.mes.message}</p>
              )}
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano *
              </label>
              <select
                {...register('ano')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {anos.map((ano) => (
                  <option key={ano.value} value={ano.value}>
                    {ano.label}
                  </option>
                ))}
              </select>
              {errors.ano && (
                <p className="mt-1 text-sm text-red-600">{errors.ano.message}</p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={loading}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar OS
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
