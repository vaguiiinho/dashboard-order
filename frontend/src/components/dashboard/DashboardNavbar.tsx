'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Settings } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface DashboardNavbarProps {
  userName?: string;
}

export function DashboardNavbar({ userName }: DashboardNavbarProps) {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            {/* Placeholder para Logo */}
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 relative">
                {/* Será substituído por uma imagem real */}
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback caso a imagem não exista
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div 
                  className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ display: 'none' }}
                >
                  BI
                </div>
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                BI - Monitoramento de Produtividade de O.S
              </h1>
              <p className="text-sm text-gray-500">
                Business Intelligence - Tubaron
              </p>
            </div>
          </div>

          {/* Menu do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Informações do usuário */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium">{userName || 'Usuário'}</div>
                  <div className="text-xs text-gray-500">Sessão ativa</div>
                </div>
                <svg
                  className={`w-4 h-4 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = '/dashboard/usuarios';
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Administração
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para fechar o menu quando clicar fora */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
