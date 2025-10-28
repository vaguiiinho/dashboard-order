'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sector = searchParams.get('setor');

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ];

    if (pathname === '/dashboard/setor' && sector) {
      items.push({ label: 'Por Setor', href: '/dashboard/setor' });
      items.push({ label: sector, href: undefined });
    } else if (pathname === '/dashboard/ordem-servico') {
      items.push({ label: 'Nova OS', href: undefined });
    } else if (pathname === '/dashboard/usuarios') {
      items.push({ label: 'Usuários', href: undefined });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Início
      </Link>
      
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
