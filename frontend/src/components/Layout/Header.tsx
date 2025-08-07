import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Menu,
  Bell,
  Search,
  User,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Lado esquerdo - Menu mobile e busca */}
          <div className="flex items-center">
            {/* Botão menu mobile */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Barra de busca */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar ordens de serviço..."
                  className="block w-80 pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Lado direito - Notificações e perfil */}
          <div className="flex items-center space-x-4">
            {/* Botão de notificações */}
            <button className="relative p-2 text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Bell className="h-5 w-5" />
              {/* Badge de notificação */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-500"></span>
            </button>

            {/* Informações do usuário */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.department || 'Sem departamento'}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de busca mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar ordens de serviço..."
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
