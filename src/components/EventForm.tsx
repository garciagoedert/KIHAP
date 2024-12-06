import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { KihapEvent } from '../types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<KihapEvent, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => void;
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuthStore();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.unitId) return;

    onSubmit({
      ...eventData,
      unitId: user.unitId,
    });

    setEventData({
      title: '',
      description: '',
      date: '',
      location: '',
      maxParticipants: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Novo Evento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Evento
            </label>
            <input
              id="event-title"
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="event-description"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Digite a descrição do evento"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
              Data e Hora
            </label>
            <input
              id="event-date"
              type="datetime-local"
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              id="event-location"
              type="text"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Digite o local do evento"
              required
            />
          </div>

          <div>
            <label htmlFor="event-max-participants" className="block text-sm font-medium text-gray-700 mb-1">
              Número Máximo de Participantes
            </label>
            <input
              id="event-max-participants"
              type="number"
              min="0"
              value={eventData.maxParticipants}
              onChange={(e) => setEventData({ ...eventData, maxParticipants: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Digite o número máximo de participantes"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
