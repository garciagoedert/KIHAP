import React, { useState, useEffect, useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Lead, LeadStatus, LeadHistory } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FiSearch, FiTrash2, FiPhone, FiMail, FiMessageSquare, FiUsers, FiEdit, FiFilter, FiTag, FiClock, FiAlertCircle, FiCalendar, FiUserPlus } from 'react-icons/fi';
import { X, MapPin } from 'lucide-react';
import { format, isAfter, isBefore, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LeadDetailsModal from './LeadDetailsModal';
import LeadForm from './LeadForm';

interface FunnelMetrics {
  total: number;
  novo: number;
  contato: number;
  visitou: number;
  matriculado: number;
  desistente: number;
  conversaoTotal: number;
}

const priorityColors = {
  alta: 'bg-red-500',
  media: 'bg-yellow-500',
  baixa: 'bg-blue-500',
} as const;

type Priority = keyof typeof priorityColors;

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

interface Filters {
  status: LeadStatus[];
  priority: Priority[];
  source: string[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}

interface ExtendedLead extends Lead {
  priority?: Priority;
  nextContactDate?: string;
  lastContactDate?: string;
  tags?: string[];
  history?: LeadHistory[];
  createdAt: string;
  subUnitId?: string;
}

export default function CRMBoard() {
  const { leads, units, subunits, updateLead, deleteLead, fetchLeads, addLead } = useDataStore();
  const { user } = useAuthStore();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const [selectedLead, setSelectedLead] = useState<ExtendedLead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    priority: [],
    source: [],
    dateRange: {
      start: '',
      end: '',
    },
    tags: [],
  });

  const metrics = useMemo<FunnelMetrics>(() => {
    const total = leads.length;
    const statusCounts: Partial<Record<LeadStatus, number>> = {};
    
    leads.forEach(lead => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });

    const matriculados = statusCounts.matriculado || 0;
    const conversaoTotal = total > 0 ? (matriculados / total) * 100 : 0;

    return {
      total,
      novo: statusCounts.novo || 0,
      contato: statusCounts.contato || 0,
      visitou: statusCounts.visitou || 0,
      matriculado: matriculados,
      desistente: statusCounts.desistente || 0,
      conversaoTotal,
    };
  }, [leads]);

  useEffect(() => {
    console.log('Buscando leads...');
    fetchLeads().catch(error => {
      console.error('Erro ao buscar leads:', error);
    });
  }, []);

  const statusColors = getStatusColors(isDarkMode);

  const handleDragEnd = async (result: DropResult) => {
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

      try {
        await updateLead({
          ...lead,
          status: newStatus,
          history: [...((lead as ExtendedLead).history || []), newHistoryItem]
        });
      } catch (error) {
        console.error('Erro ao atualizar lead:', error);
        alert('Erro ao atualizar o status do lead. Por favor, tente novamente.');
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteLead(leadId);
        await fetchLeads();
      } catch (error) {
        console.error('Erro ao deletar lead:', error);
        alert('Erro ao excluir o lead. Por favor, tente novamente.');
      }
    }
  };

  const handleEditLead = (lead: ExtendedLead) => {
    setSelectedLead(lead);
  };

  const handleWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${formattedPhone}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const getLastContactDate = (lead: ExtendedLead): string => {
    if (!lead.history?.length) return lead.createdAt;
    const contacts = lead.history.filter(h => h.type === 'contact');
    if (!contacts.length) return lead.createdAt;
    return contacts[contacts.length - 1].createdAt;
  };

  const getContactStatus = (lead: ExtendedLead): { color: string; text: string } => {
    const lastContact = getLastContactDate(lead);
    const days = differenceInDays(new Date(), new Date(lastContact));
    
    if (days > 7) return { color: 'bg-red-500', text: `${days}d sem contato` };
    if (days > 3) return { color: 'bg-yellow-500', text: `${days}d sem contato` };
    return { color: 'bg-green-500', text: `Contato recente` };
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const searchMatch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      const extendedLead = lead as ExtendedLead;

      if (filters.status.length && !filters.status.includes(lead.status)) return false;
      if (filters.priority.length && !filters.priority.includes(extendedLead.priority || 'baixa')) return false;
      if (filters.source.length && !filters.source.includes(lead.source)) return false;
      if (filters.tags.length && !filters.tags.some(tag => extendedLead.tags?.includes(tag))) return false;

      if (filters.dateRange.start && isBefore(new Date(lead.createdAt), new Date(filters.dateRange.start))) return false;
      if (filters.dateRange.end && isAfter(new Date(lead.createdAt), new Date(filters.dateRange.end))) return false;

      return true;
    });
  }, [leads, searchTerm, filters]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-6 transition-colors duration-200`}>
      {/* Métricas do Funil */}
      <div className="max-w-[1800px] mx-auto mb-8">
        <div className="grid grid-cols-6 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Total de Leads</h3>
            <p className="text-2xl font-bold text-blue-600">{metrics.total}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Taxa de Conversão</h3>
            <p className="text-2xl font-bold text-green-600">{metrics.conversaoTotal.toFixed(1)}%</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Leads Novos</h3>
            <p className="text-2xl font-bold text-blue-600">{metrics.novo}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Em Contato</h3>
            <p className="text-2xl font-bold text-yellow-600">{metrics.contato}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Visitaram</h3>
            <p className="text-2xl font-bold text-purple-600">{metrics.visitou}</p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm text-gray-500">Matriculados</h3>
            <p className="text-2xl font-bold text-green-600">{metrics.matriculado}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-2 rounded-lg shadow-sm`}>
                <FiUsers className="text-blue-600" size={24} />
              </div>
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}`}>
                CRM
              </h2>
            </div>

            <button
              onClick={() => setShowNewLeadModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <FiUserPlus size={20} />
              <span>Novo Lead</span>
            </button>
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
                        .map((lead, index) => {
                          const extendedLead = lead as ExtendedLead;
                          return (
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
                                  <div className="flex flex-col space-y-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                                          {lead.name}
                                        </h4>
                                        {extendedLead.priority && (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-white ${priorityColors[extendedLead.priority]} mt-1`}>
                                            <FiAlertCircle className="mr-1" size={12} />
                                            Prioridade {extendedLead.priority}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleWhatsApp(lead.phone)}
                                          className={`${
                                            isDarkMode
                                              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
                                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                          } transition-colors p-1.5 rounded-full`}
                                          title="Enviar WhatsApp"
                                        >
                                          <FiPhone size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleEmail(lead.email)}
                                          className={`${
                                            isDarkMode
                                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                          } transition-colors p-1.5 rounded-full`}
                                          title="Enviar Email"
                                        >
                                          <FiMail size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleEditLead(extendedLead)}
                                          className={`${
                                            isDarkMode
                                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                          } transition-colors p-1.5 rounded-full`}
                                          title="Editar lead"
                                        >
                                          <FiEdit size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLead(lead.id)}
                                          className={`${
                                            isDarkMode
                                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                          } transition-colors p-1.5 rounded-full`}
                                          title="Excluir lead"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Status de Contato */}
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-white ${getContactStatus(extendedLead).color}`}>
                                        <FiClock className="mr-1" size={12} />
                                        {getContactStatus(extendedLead).text}
                                      </span>
                                      {extendedLead.nextContactDate && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                          <FiCalendar className="mr-1" size={12} />
                                          Próximo contato: {format(new Date(extendedLead.nextContactDate), 'dd/MM', { locale: ptBR })}
                                        </span>
                                      )}
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
                                      <div className={`flex items-center ${
                                        isDarkMode
                                          ? 'text-gray-300 group-hover:text-blue-400'
                                          : 'text-gray-600 group-hover:text-blue-600'
                                      } transition-colors`}>
                                        <MapPin className="mr-2" size={14} />
                                        <span className="text-sm">
                                          {units.find(u => u.id === lead.unitId)?.name}
                                          {extendedLead.subUnitId && ` - ${subunits.find(s => s.id === extendedLead.subUnitId)?.name}`}
                                        </span>
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
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
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

        {/* Modal para Novo Lead */}
        {showNewLeadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-md p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Adicionar Novo Lead
                </h2>
                <button
                  onClick={() => setShowNewLeadModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Fechar modal"
                  aria-label="Fechar modal"
                >
                  <X size={24} />
                </button>
              </div>

              <LeadForm
                onSubmit={async (data) => {
                  try {
                    await addLead(data);
                    setShowNewLeadModal(false);
                    await fetchLeads();
                  } catch (error) {
                    console.error('Erro ao criar lead:', error);
                    alert('Erro ao criar lead. Por favor, tente novamente.');
                  }
                }}
                buttonText="Criar Lead"
                darkMode={isDarkMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
