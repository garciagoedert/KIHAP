import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Calendar, Phone, Mail, DollarSign, Clock, Plus, Tag, AlertCircle } from 'lucide-react';
import { Lead, LeadHistory, LeadStatus } from '../types/supabase';
import { useDataStore } from '../store/useDataStore';
import { useThemeStore } from '../store/useThemeStore';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  userId: string;
}

const priorityOptions = [
  { value: 'baixa', label: 'Baixa', color: 'bg-blue-500' },
  { value: 'media', label: 'Média', color: 'bg-yellow-500' },
  { value: 'alta', label: 'Alta', color: 'bg-red-500' }
] as const;

const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo Lead',
  contato: 'Em Contato',
  visitou: 'Visitou',
  matriculado: 'Matriculado',
  desistente: 'Desistente'
};

const statusColors: Record<LeadStatus, string> = {
  novo: 'bg-blue-600',
  contato: 'bg-yellow-600',
  visitou: 'bg-purple-600',
  matriculado: 'bg-green-600',
  desistente: 'bg-red-600'
};

export default function LeadDetailsModal({ lead, onClose, userId }: LeadDetailsModalProps) {
  const { updateLead } = useDataStore();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const [note, setNote] = useState('');
  const [contact, setContact] = useState('');
  const [nextContactDate, setNextContactDate] = useState(lead.nextContactDate || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...(editedLead.tags || []), newTag.trim()];
      setEditedLead({ ...editedLead, tags: updatedTags });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = editedLead.tags?.filter(tag => tag !== tagToRemove) || [];
    setEditedLead({ ...editedLead, tags: updatedTags });
  };

  const handleSaveNote = () => {
    if (note.trim()) {
      const newHistoryItem: LeadHistory = {
        id: crypto.randomUUID(),
        leadId: lead.id,
        status: lead.status,
        notes: note,
        createdAt: new Date().toISOString(),
        type: 'note'
      };

      updateLead({
        ...lead,
        history: [...(lead.history || []), newHistoryItem]
      });
      setNote('');
    }
  };

  const handleSaveContact = () => {
    if (contact.trim()) {
      const newHistoryItem: LeadHistory = {
        id: crypto.randomUUID(),
        leadId: lead.id,
        status: lead.status,
        notes: contact,
        createdAt: new Date().toISOString(),
        type: 'contact'
      };

      updateLead({
        ...lead,
        history: [...(lead.history || []), newHistoryItem],
        nextContactDate,
        lastContactDate: new Date().toISOString()
      });
      setContact('');
    }
  };

  const handleSaveEdit = () => {
    updateLead(editedLead);
    setIsEditing(false);
  };

  const formatHistoryItem = (item: LeadHistory) => {
    switch (item.type) {
      case 'status_change':
        return `Status alterado de ${statusLabels[item.oldStatus!]} para ${statusLabels[item.newStatus!]}`;
      case 'note':
        return `Nota: ${item.notes}`;
      case 'contact':
        return `Contato: ${item.notes}`;
      default:
        return item.notes;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex justify-between items-center`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Detalhes do Lead</h2>
          <button 
            onClick={onClose} 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            title="Fechar modal"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Prioridade */}
          <div className="border-b pb-4">
            <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Prioridade</h4>
            <div className="flex gap-3">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setEditedLead({ ...editedLead, priority: option.value })}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                    editedLead.priority === option.value
                      ? `${option.color} text-white`
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <AlertCircle size={14} className="mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="border-b pb-4">
            <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tags</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {editedLead.tags?.map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    title={`Remover tag ${tag}`}
                    aria-label={`Remover tag ${tag}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag..."
                className={`flex-1 p-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                } disabled:opacity-50`}
              >
                Adicionar
              </button>
            </div>
          </div>
          {/* Informações Básicas */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedLead.name}
                  onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Nome"
                  aria-label="Nome do lead"
                />
                <input
                  type="email"
                  value={editedLead.email}
                  onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                  aria-label="Email do lead"
                />
                <input
                  type="tel"
                  value={editedLead.phone}
                  onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Telefone"
                  aria-label="Telefone do lead"
                />
                <input
                  type="number"
                  value={editedLead.value}
                  onChange={(e) => setEditedLead({ ...editedLead, value: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  placeholder="Valor"
                  aria-label="Valor do lead"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm mt-2 ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Editar lead"
                    aria-label="Editar informações do lead"
                  >
                    Editar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Phone size={20} className="text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={20} className="text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-gray-400" />
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(lead.value || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-400" />
                    <span>{format(new Date(lead.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Adicionar Contato */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-3">Registrar Contato</h4>
            <div className="space-y-3">
              <textarea
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Descreva o contato realizado..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                aria-label="Descrição do contato"
              />
              <div className="flex gap-3">
                <input
                  type="datetime-local"
                  value={nextContactDate}
                  onChange={(e) => setNextContactDate(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  aria-label="Data do próximo contato"
                  title="Data do próximo contato"
                />
                <button
                  onClick={handleSaveContact}
                  disabled={!contact.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>

          {/* Adicionar Nota */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-3">Adicionar Nota</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Digite uma nota..."
                className="flex-1 p-2 border rounded-lg"
                aria-label="Nova nota"
              />
              <button
                onClick={handleSaveNote}
                disabled={!note.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                title="Adicionar nota"
                aria-label="Adicionar nota"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Histórico */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-3">Histórico</h4>
            <div className="space-y-3">
              {lead.history?.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">{formatHistoryItem(item)}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
