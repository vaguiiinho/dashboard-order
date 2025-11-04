'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { ordemServicoService, Setor } from '@/services/ordemServicoService';
import { CheckCircle, AlertCircle, Save } from 'lucide-react';

const colaboradorSchema = z.object({
  nome: z.string().min(2, 'Informe o nome do colaborador'),
  setorId: z.string().min(1, 'Selecione o setor'),
  ativo: z.boolean(),
});

type ColaboradorForm = z.infer<typeof colaboradorSchema>;

export function CadastroColaboradorForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setores, setSetores] = useState<Setor[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ColaboradorForm>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: { ativo: true },
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await ordemServicoService.getSetores();
        setSetores(data.filter(s => s.ativo));
      } catch {
        // no-op
      }
    })();
  }, []);

  const onSubmit = async (data: ColaboradorForm) => {
    try {
      setLoading(true);
      setError(null);
      await ordemServicoService.createColaborador(data);
      setSuccess('Colaborador cadastrado com sucesso');
      reset({ nome: '', setorId: '', ativo: true });
      setTimeout(() => setSuccess(null), 2500);
    } catch {
      setError('Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dashboard-text-primary mb-2">Cadastro de Colaborador</h1>
        <p className="dashboard-text-secondary">Associe colaboradores a um setor</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-green-800">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="dashboard-card rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Colaborador *</label>
              <input
                {...register('nome')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: João da Silva"
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setor *</label>
              <select
                {...register('setorId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                {setores.map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
              {errors.setorId && <p className="mt-1 text-sm text-red-600">{errors.setorId.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="ativo" {...register('ativo')} className="h-4 w-4 text-blue-600" />
            <label htmlFor="ativo" className="text-sm text-gray-700">Ativo</label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


