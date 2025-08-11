'use client';

import { useState, useEffect } from 'react';
import { ColaboradorResponse } from '@/services/ixc-api';

interface Colaborador {
  id: string;
  funcionario: string;
}

interface CollaboratorFilterProps {
  colaboradores: Colaborador[];
  selectedCollaborators: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  loading?: boolean;
}

export function CollaboratorFilter({ 
  colaboradores, 
  selectedCollaborators, 
  onSelectionChange,
  loading = false
}: CollaboratorFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredColaboradores = colaboradores.filter(colaborador =>
    colaborador.funcionario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleColaborador = (colaboradorId: string) => {
    if (selectedCollaborators.includes(colaboradorId)) {
      onSelectionChange(selectedCollaborators.filter(id => id !== colaboradorId));
    } else {
      onSelectionChange([...selectedCollaborators, colaboradorId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCollaborators.length === filteredColaboradores.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredColaboradores.map(c => c.id));
    }
  };

  const getSelectedNames = () => {
    if (selectedCollaborators.length === 0) return 'Todos os colaboradores';
    if (selectedCollaborators.length === 1) {
      const colaborador = colaboradores.find(c => c.id === selectedCollaborators[0]);
      return colaborador?.funcionario || 'Colaborador selecionado';
    }
    return `${selectedCollaborators.length} colaboradores selecionados`;
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtro por Colaborador</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtro por Colaborador</h3>
      
      {/* Botão para expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 text-left border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{getSelectedNames()}</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Lista expandida */}
      {isExpanded && (
        <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Opção Selecionar Todos */}
          <div className="p-2 border-b border-gray-200">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedCollaborators.length === filteredColaboradores.length && filteredColaboradores.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">
                {selectedCollaborators.length === filteredColaboradores.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </span>
            </label>
          </div>

          {/* Lista de colaboradores */}
          <div className="max-h-40 overflow-y-auto">
            {filteredColaboradores.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? 'Nenhum colaborador encontrado' : 'Carregando colaboradores...'}
              </div>
            ) : (
              filteredColaboradores.map((colaborador) => (
                <div key={colaborador.id} className="p-2 hover:bg-gray-50">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCollaborators.includes(colaborador.id)}
                      onChange={() => handleToggleColaborador(colaborador.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{colaborador.funcionario}</span>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
