import React, { useState } from 'react';
import { Lead } from '../types';
import { useDataStore } from '../store/useDataStore';

interface LeadFormProps {
  onSubmit: (lead: Omit<Lead, 'id' | 'status' | 'createdAt' | 'history'>) => void;
  buttonText?: string;
  darkMode?: boolean;
}

export default function LeadForm({ onSubmit, buttonText = "Agendar Aula Experimental", darkMode = false }: LeadFormProps) {
  const { units } = useDataStore();
  const [formData, setFormData] = useState<Omit<Lead, 'id' | 'status' | 'createdAt' | 'history'>>({
    name: '',
    email: '',
    phone: '',
    source: 'form',
    unitId: units[0]?.id || '',
    notes: '',
    value: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = darkMode 
    ? "w-full p-2 border rounded-md bg-[#262626] border-[#404040] text-white placeholder-gray-400 focus:ring-[#dfa129] focus:border-[#dfa129]"
    : "w-full p-2 border rounded-md";

  const labelClasses = darkMode
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClasses}>
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
          required
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClasses}
          required
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={inputClasses}
          required
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label htmlFor="unit" className={labelClasses}>
          Unidade
        </label>
        <select
          id="unit"
          value={formData.unitId}
          onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
          className={inputClasses}
          required
        >
          <option value="">Selecione uma unidade</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className={labelClasses}>
          Mensagem (opcional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={inputClasses}
          rows={3}
          placeholder="Sua mensagem aqui"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#dfa129] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
