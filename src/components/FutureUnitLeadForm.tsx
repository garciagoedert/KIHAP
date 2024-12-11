import React, { useState } from 'react';
import { CreateLeadInput } from '../types/supabase';

interface FutureUnitLeadFormProps {
  onSubmit: (lead: CreateLeadInput) => Promise<void>;
  buttonText?: string;
  darkMode?: boolean;
}

export default function FutureUnitLeadForm({ onSubmit, buttonText = "Fazer Pré-matrícula", darkMode = false }: FutureUnitLeadFormProps) {
  const [formData, setFormData] = useState<CreateLeadInput & { region: string }>({
    name: '',
    email: '',
    phone: '',
    source: 'future_unit',
    unitId: 'future',
    notes: '',
    value: 0,
    region: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name || !formData.email || !formData.phone || !formData.region) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      // Incluir a região nas notas
      const leadData = {
        ...formData,
        notes: `Região de interesse: ${formData.region}\n${formData.notes}`.trim()
      };
      await onSubmit(leadData);
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
        <label htmlFor="region" className={labelClasses}>
          Cidade/Região de Interesse
        </label>
        <input
          type="text"
          id="region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className={inputClasses}
          required
          placeholder="Ex: Florianópolis - Centro"
          disabled={isSubmitting}
        />
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
          placeholder="Conte-nos mais sobre seu interesse em treinar conosco"
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
