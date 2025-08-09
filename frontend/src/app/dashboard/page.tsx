'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, Users, BarChart3, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuthGuard();
  const { logout } = useAuth();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null; // Será redirecionado pelo useAuthGuard
  // }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard de Ordens de Serviço
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {/* Olá, {user.email} ({user.grupo.nome}) */}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card de Estatísticas */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Relatórios
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Em breve
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Usuários */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Usuários
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = '/dashboard/usuarios'}
                        >
                          Gerenciar
                        </Button>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Configurações */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Configurações
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Em breve
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Informações do Sistema */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Sistema de Gerenciamento de Ordens de Serviço
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Bem-vindo ao sistema! Esta aplicação está em desenvolvimento e seguindo o plano de ação definido.
                  </p>
                </div>
                <div className="mt-5">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="text-sm text-blue-700">
                      <p><strong>Status atual:</strong></p>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        <li>✅ Backend NestJS com autenticação JWT implementado</li>
                        <li>✅ Frontend Next.js com sistema de login</li>
                        <li>✅ Arquitetura Clean implementada</li>
                        <li>⏳ Módulo de usuários (em desenvolvimento)</li>
                        <li>⏳ Dashboards com gráficos (próximo)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

