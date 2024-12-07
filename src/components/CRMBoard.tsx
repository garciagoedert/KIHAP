import React, { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Lead, LeadStatus, LeadHistory } from '../types/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FiSearch, FiTrash2, FiPhone, FiMail, FiMessageSquare, FiUsers, FiEdit } from 'react-icons/fi';
import LeadDetailsModal from './LeadDetailsModal';

const statusLabels: Record<LeadStatus, string> = {
  'novo': 'Novo',
  'contato': 'Contatado',
  'visitou': 'Visitou',
  'matriculado': 'Matriculado',
  'desistente': 'Desistente'
};

const getStatusColors = (isDarkMode: boolean): Record<LeadStatus, string> => ({
  'novo': isDarkMode 
    ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-blue-100 border-blue-700'
    : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200',
  'contato': isDarkMode
    ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 text-yellow-100 border-yellow-700'
    : 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200',
  'visitou': isDarkMode
    ? 'bg-gradient-to-br from-purple-900 to-purple-800 text-purple-100 border-purple-700'
    : 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200',
  'matriculado': isDarkMode
    ? 'bg-gradient-to-br from-green-900 to-green-800 text-green-100 border-green-700'
    : 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200',
  'desistente': isDarkMode
    ? 'bg-gradient-to-br from-red-900 to-red-800 text-red-100 border-red-700'
    : 'bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200'
});

const kanbanStatuses: LeadStatus[] = ['novo', 'contato', 'visitou', 'matriculado', 'desistente'];

export default function CRMBoard() {
  const { leads, updateLead, deleteLead } = useDataStore();
  const { user } = useAuthStore();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = getStatusColors(isDarkMode);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !user) return;

    const { draggableId, source, destination } = result;
    const lead = leads.find(l => l.id === draggableId);
    
    if (lead && source.droppableId !== destination.droppableId) {
      const oldStatus = source.droppableId as LeadStatus;
      const newStatus = destination.droppableId as LeadStatus;
      
      const newHistoryItem: LeadHistory = {
        id: crypto.randomUUID(),
        leadId: lead.id,
        status: newStatus,
        notes: `Status alterado de ${statusLabels[oldStatus]} para ${statusLabels[newStatus]}`,
        createdAt: new Date().toISOString(),
        type: 'status_change',
        oldStatus,
        newStatus,
      };

      updateLead({ ...lead, status: newStatus, history: [...(lead.history || []), newHistoryItem] });
    }
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      deleteLead(leadId);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-6 transition-colors duration-200`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-2 rounded-lg shadow-sm`}>
              <FiUsers className="text-blue-600" size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}>
              CRM
            </h2>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2.5 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 transition-all duration-200 shadow-sm`}
            />
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto gap-6 pb-6">
            {kanbanStatuses.map(status => (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-shrink-0 w-80 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-100'
                    } rounded-xl shadow-sm border backdrop-blur-lg bg-opacity-90 transition-colors duration-200 ${
                      snapshot.isDraggingOver
                        ? isDarkMode
                          ? 'border-blue-500 bg-gray-700'
                          : 'border-blue-300 bg-blue-50'
                        : ''
                    }`}
                  >
                    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {statusLabels[status]}
                      </h3>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {filteredLeads.filter(lead => lead.status === status).length} leads
                      </div>
                    </div>
                    <div className={`p-4 space-y-4 min-h-[200px] transition-colors duration-200 ${
                      snapshot.isDraggingOver 
                        ? isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-blue-50'
                        : ''
                    }`}>
                      {filteredLeads
                        .filter(lead => lead.status === status)
                        .map((lead, index) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                } rounded-lg p-4 shadow-sm border transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? isDarkMode
                                      ? 'shadow-lg border-blue-500 rotate-2'
                                      : 'shadow-lg border-blue-300 rotate-2'
                                    : 'hover:shadow-md hover:-translate-y-1'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                                    {lead.name}
                                  </h4>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditLead(lead)}
                                      className={`${
                                        isDarkMode
                                          ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                      } transition-colors p-1.5 rounded-full opacity-0 group-hover:opacity-100`}
                                      title="Editar lead"
                                      aria-label="Editar lead"
                                    >
                                      <FiEdit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className={`${
                                        isDarkMode
                                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                      } transition-colors p-1.5 rounded-full opacity-0 group-hover:opacity-100`}
                                      title="Excluir lead"
                                      aria-label="Excluir lead"
                                    >
                                      <FiTrash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className={`flex items-center ${
                                    isDarkMode
                                      ? 'text-gray-300 group-hover:text-blue-400'
                                      : 'text-gray-600 group-hover:text-blue-600'
                                  } transition-colors`}>
                                    <FiMail className="mr-2" size={14} />
                                    <span className="text-sm">{lead.email}</span>
                                  </div>
                                  <div className={`flex items-center ${
                                    isDarkMode
                                      ? 'text-gray-300 group-hover:text-blue-400'
                                      : 'text-gray-600 group-hover:text-blue-600'
                                  } transition-colors`}>
                                    <FiPhone className="mr-2" size={14} />
                                    <span className="text-sm">{lead.phone}</span>
                                  </div>
                                  {lead.notes && (
                                    <div className={`flex items-start ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    } mt-2`}>
                                      <FiMessageSquare className="mr-2 mt-1" size={14} />
                                      <span className="text-sm italic">{lead.notes}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-3">
                                  <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[lead.status]}`}>
                                    {statusLabels[lead.status]}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {selectedLead && user && (
          <LeadDetailsModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
}
