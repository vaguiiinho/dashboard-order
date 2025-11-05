'use client';

import { Suspense } from 'react';
import { NovaOSForm } from '@/components/dashboard/NovaOSForm';

export const dynamic = 'force-dynamic';

export default function OrdemServicoPage() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <NovaOSForm />
    </Suspense>
  );
}