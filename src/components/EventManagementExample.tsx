import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import type { KihapEvent, CreateEventParams } from '../types/supabase';

export function EventManagementExample() {
  const [events, setEvents] = useState<KihapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEventParams>({
    name: '',
    description: '',
    date: new Date().toISOString(),
    location: '',
    unit_id: '' // Deve ser preenchido com um ID válido
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await trpc.getEvents.query();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await trpc.createEvent.mutate(formData);
      // Recarrega a lista de eventos
      fetchEvents();
      // Limpa o formulário
      setFormData({
        name: '',
        description: '',
        date: new Date().toISOString(),
        location: '',
        unit_id: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Eventos</h2>
      
      {/* Formulário de criação */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="event-name" className="block text-sm font-medium mb-1">Nome do Evento</label>
          <input
            id="event-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Digite o nome do evento"
            required
            aria-label="Nome do Evento"
          />
        </div>

        <div>
          <label htmlFor="event-description" className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            id="event-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Digite a descrição do evento"
            rows={3}
            aria-label="Descrição do Evento"
          />
        </div>

        <div>
          <label htmlFor="event-date" className="block text-sm font-medium mb-1">Data</label>
          <input
            id="event-date"
            type="datetime-local"
            name="date"
            value={formData.date.slice(0, 16)} // Formato para datetime-local
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            aria-label="Data do Evento"
          />
        </div>

        <div>
          <label htmlFor="event-location" className="block text-sm font-medium mb-1">Local</label>
          <input
            id="event-location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Digite o local do evento"
            required
            aria-label="Local do Evento"
          />
        </div>

        <div>
          <label htmlFor="event-unit" className="block text-sm font-medium mb-1">Unidade</label>
          <input
            id="event-unit"
            type="text"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Digite o ID da unidade"
            required
            aria-label="ID da Unidade"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          aria-label="Criar Evento"
        >
          Criar Evento
        </button>
      </form>

      {/* Lista de eventos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Eventos Cadastrados</h3>
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold">{event.name}</h4>
            {event.description && (
              <p className="text-gray-600 mt-1">{event.description}</p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              <p>Data: {new Date(event.date).toLocaleString()}</p>
              <p>Local: {event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
