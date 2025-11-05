'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSectorDashboardData } from '@/hooks/useSectorDashboardData';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const dynamic = 'force-dynamic';

function SectorDashboardContent() {
  const searchParams = useSearchParams();
  const sector = searchParams.get('setor') || undefined;
  
  const { 
    data, 
    loading, 
    error, 
    filters, 
    updateDateFilter, 
    updateCollaboratorFilter, 
    refreshData 
  } = useSectorDashboardData(sector);

  return (
    <DashboardContent
      data={data}
      loading={loading}
      error={error}
      filters={filters}
      onDateChange={updateDateFilter}
      onCollaboratorChange={updateCollaboratorFilter}
      onRefresh={refreshData}
      sector={sector}
    />
  );
}

export default function SectorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <SectorDashboardContent />
    </Suspense>
  );
}
