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
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 lg:ml-[280px] flex flex-col overflow-hidden">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
            <Breadcrumb />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

