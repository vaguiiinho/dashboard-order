import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../UI/LoadingSpinner';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Dashboard - Ordens de Serviço',
  description = 'Sistema de gerenciamento de ordens de serviço',
  requireAuth = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Páginas que não precisam do layout completo
  const publicPages = ['/login', '/forgot-password', '/reset-password'];
  const isPublicPage = publicPages.includes(router.pathname);

  // Se está carregando, mostra spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Se precisa de autenticação mas não está autenticado, redireciona
  if (requireAuth && !isAuthenticated && !isPublicPage) {
    router.push(`/login?redirect=${router.asPath}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Layout para páginas públicas (login, etc.)
  if (isPublicPage) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="min-h-screen bg-secondary-50">
          {children}
        </main>
      </>
    );
  }

  // Layout principal da aplicação
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout-container bg-secondary-50">
        {/* Sidebar */}
        <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo principal */}
        <div className="main-content">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Conteúdo da página */}
          <main className="content-area px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
