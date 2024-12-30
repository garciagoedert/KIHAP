import React, { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { CreateLeadInput } from '../types';

interface LeadFormProps {
  onSubmit: (lead: CreateLeadInput) => Promise<void>;
  buttonText?: string;
  darkMode?: boolean;
}

export default function LeadForm({ onSubmit, buttonText = "Agendar Aula Experimental", darkMode = false }: LeadFormProps) {
  const { units, subunits } = useDataStore();
  const [formData, setFormData] = useState<CreateLeadInput>({
    name: '',
    email: '',
    phone: '',
    source: 'form',
    unitId: units[0]?.id || '',
    subUnitId: '',
    notes: '',
    value: 0,
    status: 'novo'
  });

  // Log para debug
  console.log('Units:', JSON.stringify(units, null, 2));
  console.log('Subunits:', JSON.stringify(subunits, null, 2));
  console.log('Form Data:', JSON.stringify(formData, null, 2));

  const availableSubunits = subunits.filter(
    (subunit) => subunit.unitId === formData.unitId
  );
  console.log('Available Subunits:', JSON.stringify(availableSubunits, null, 2));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name || !formData.email || !formData.phone || !formData.unitId) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="unit" className={labelClasses}>
          Unidade
        </label>
        <select
          id="unit"
          value={formData.unitId}
          onChange={(e) => setFormData({ 
            ...formData, 
            unitId: e.target.value,
            subUnitId: '' // Limpa a subunidade quando muda a unidade
          })}
          className={inputClasses}
          required
          disabled={isSubmitting}
        >
          <option value="">Selecione uma unidade</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>

      {formData.unitId && availableSubunits.length > 0 && (
        <div>
          <label htmlFor="subunit" className={labelClasses}>
            Local de Treino
          </label>
          <select
            id="subunit"
            value={formData.subUnitId}
            onChange={(e) => setFormData({ ...formData, subUnitId: e.target.value })}
            className={inputClasses}
            required
            disabled={isSubmitting}
          >
            <option value="">Selecione um local</option>
            {availableSubunits.map((subunit) => (
              <option key={subunit.id} value={subunit.id}>
                {subunit.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
          disabled={isSubmitting}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-[#dfa129] text-white rounded-md hover:bg-opacity-90 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : buttonText}
        </button>
      </div>
    </form>
  );
}
