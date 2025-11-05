'use client';

import { useState, Suspense } from 'react';
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
    <div className="min-h-screen dashboard-background">
      <DashboardNavbar />
      
      <div className="flex pt-16">
        <Suspense fallback={<div className="w-64 bg-gray-100 animate-pulse" />}>
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </Suspense>

        <div className="flex-1 lg:ml-[280px] flex flex-col">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-[calc(100vh-4rem-2.5rem-1px)] overflow-y-auto pt-6 pb-2 relative z-10">
            <Suspense fallback={<div className="h-6 mb-6 bg-gray-100 animate-pulse rounded" />}>
              <Breadcrumb />
            </Suspense>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

