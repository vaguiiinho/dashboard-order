'use client';

import { useState } from 'react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

export function DateFilter({ startDate, endDate, onDateChange }: DateFilterProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleStartDateChange = (value: string) => {
    setLocalStartDate(value);
    onDateChange(value, localEndDate);
  };

  const handleEndDateChange = (value: string) => {
    setLocalEndDate(value);
    onDateChange(localStartDate, value);
  };

  const setPresetDates = (preset: 'today' | 'week' | 'month' | 'quarter') => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (preset) {
      case 'today':
        start = new Date(now);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        break;
      default:
        start = new Date(now);
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    setLocalStartDate(startStr);
    setLocalEndDate(endStr);
    onDateChange(startStr, endStr);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Filtro de Período</h3>
      
      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setPresetDates('today')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Hoje
        </button>
        <button
          onClick={() => setPresetDates('week')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Última Semana
        </button>
        <button
          onClick={() => setPresetDates('month')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Último Mês
        </button>
        <button
          onClick={() => setPresetDates('quarter')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Último Trimestre
        </button>
      </div>

      {/* Seletor de datas personalizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            id="startDate"
            value={localStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <input
            type="date"
            id="endDate"
            value={localEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
