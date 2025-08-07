import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Building2,
  MapPin,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { canViewDashboard, canManageUsers, canManageOrders } = usePermissions();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Ordens de Serviço',
      href: '/orders',
      icon: FileText,
    },
    {
      name: 'Relatórios',
      href: '/reports',
      icon: BarChart3,
    },
    {
      name: 'Usuários',
      href: '/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Departamentos',
      href: '/departments',
      icon: Building2,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Estruturas',
      href: '/structures',
      icon: MapPin,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const isCurrentPath = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const hasPermissionForItem = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  };

  return (
    <div className="w-full h-full bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-white font-semibold text-lg">Dashboard</h1>
              <p className="text-primary-200 text-xs">Ordens de Serviço</p>
            </div>
          </Link>
          
          {/* Botão fechar (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:bg-primary-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (!hasPermissionForItem(item)) return null;

            const Icon = item.icon;
            const isActive = isCurrentPath(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`${
                  isActive
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                } nav-link group`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-secondary-400 group-hover:text-secondary-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar - Informações do usuário */}
        <div className="flex-shrink-0 border-t border-secondary-200">
          <div className="px-4 py-4">
            {/* Informações do usuário */}
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Badge da role */}
            <div className="mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : user?.role === 'manager'
                  ? 'bg-blue-100 text-blue-800'
                  : user?.role === 'supervisor'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.role === 'admin' && 'Administrador'}
                {user?.role === 'manager' && 'Gerente'}
                {user?.role === 'supervisor' && 'Supervisor'}
                {user?.role === 'user' && 'Usuário'}
              </span>
            </div>

            {/* Botão de logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-md transition-colors duration-150"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
