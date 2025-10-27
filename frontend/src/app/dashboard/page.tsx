'use client';

import { useSearchParams } from 'next/navigation';
import { useSectorDashboardData } from '@/hooks/useSectorDashboardData';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
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

