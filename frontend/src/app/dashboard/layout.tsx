'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Breadcrumb } from '@/components/dashboard/Breadcrumb';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
            <Breadcrumb />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

