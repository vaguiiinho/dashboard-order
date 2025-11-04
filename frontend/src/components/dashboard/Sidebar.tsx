'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Settings, 
  Wrench, 
  Phone, 
  DollarSign,
  BarChart3,
  PlusCircle,
  LayoutDashboard,
  LucideIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ordemServicoService, Setor } from '@/services/ordemServicoService';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const sectorIcons: Record<string, LucideIcon> = {
  'FTTH': Wrench,
  'INFRAESTRUTURA': Settings,
  'SUPORTE': Phone,
  'FINANCEIRO': DollarSign,
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSector = searchParams.get('setor');
  const [setores, setSetores] = useState<Setor[]>([]);

  useEffect(() => {
    loadSetores();
  }, []);

  const loadSetores = async () => {
    try {
      const data = await ordemServicoService.getSetores();
      setSetores(data.filter(s => s.ativo));
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  };

  const isCurrentSector = (setorNome: string) => {
    return pathname === '/dashboard/setor' && currentSector === setorNome;
  };

  const mainNavItems = [
    { href: '/dashboard/ordem-servico', label: 'Registro de OS', icon: PlusCircle },
    { href: '/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, exact: true },
  ];

  const [cadastroOpen, setCadastroOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem-2.5rem-1px)]
          dashboard-background shadow-lg z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:fixed lg:top-16 lg:h-[calc(100vh-4rem-2.5rem-1px)] lg:block
        `}
        style={{ width: '280px' }}
      >
        <div className="h-full flex flex-col border-r border-blue-800">
          {/* Header */}
          <div className="p-4 border-b border-blue-800">
            <h2 className="text-sm font-semibold dashboard-text-primary uppercase tracking-wider">
              NAVEGAÇÃO
            </h2>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-2">
              {/* Cadastro Section (primeiro item) */}
              <div className="mb-2">
                <button
                  onClick={() => setCadastroOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    cadastroOpen ? 'bg-blue-700 text-white border border-blue-600' : 'dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary'
                  }`}
                >
                  <span className="text-sm font-medium">Cadastro</span>
                  <svg className={`w-4 h-4 transition-transform ${cadastroOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {cadastroOpen && (
                  <div className="mt-1 space-y-1">
                    <Link href="/dashboard/cadastro/cidade" className="block px-6 py-2 text-sm rounded-lg dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary transition-colors">Cidade</Link>
                    <Link href="/dashboard/cadastro/setor" className="block px-6 py-2 text-sm rounded-lg dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary transition-colors">Setor</Link>
                    <Link href="/dashboard/cadastro/colaborador" className="block px-6 py-2 text-sm rounded-lg dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary transition-colors">Colaborador</Link>
                    <Link href="/dashboard/cadastro/tipo-atividade" className="block px-6 py-2 text-sm rounded-lg dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary transition-colors">Tipo de Atividade</Link>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="px-4 py-2">
                <div className="border-t border-blue-800"></div>
              </div>

              {/* Main Items */}
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all
                      ${isActive
                        ? 'bg-blue-700 text-white font-medium border border-blue-600'
                        : 'dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="px-4 py-2">
              <div className="border-t border-blue-800"></div>
            </div>

            {/* Sectors Section */}
            <div className="p-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold dashboard-text-tertiary uppercase tracking-wider">
                  DASHBOARDS POR SETOR
                </h3>
                <p className="text-xs dashboard-text-secondary mt-1">Clique no setor para ver detalhes</p>
              </div>
              
              {setores.map((setor) => {
                const Icon = sectorIcons[setor.nome] || BarChart3;
                const isActive = isCurrentSector(setor.nome);
                
                return (
                  <Link
                    key={setor.id}
                    href={`/dashboard/setor?setor=${encodeURIComponent(setor.nome)}`}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all group cursor-pointer
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md'
                        : 'dashboard-text-secondary hover:bg-blue-900 hover:dashboard-text-primary hover:shadow-sm'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'dashboard-text-tertiary group-hover:text-white'}`} />
                    <span className="text-sm font-medium">{setor.nome}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions (removido Usuários) */}
            <div className="p-2 border-t border-blue-800 mt-auto"></div>
          </nav>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 lg:hidden z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </>
  );
}

