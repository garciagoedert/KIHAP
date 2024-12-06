import React, { useState } from 'react';
import LeadForm from './LeadForm';
import { Lead } from '../types';
import { useDataStore } from '../store/useDataStore';

const AcademyLeadForm: React.FC = () => {
  const { addLead } = useDataStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (leadData: Omit<Lead, 'id' | 'status' | 'createdAt' | 'history'>) => {
    try {
      // Adiciona a etiqueta "Academy" nas notas
      const academyLead = {
        ...leadData,
        notes: `[Academy] ${leadData.notes || ''}`.trim(),
        source: 'academy'
      };

      await addLead(academyLead);
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  const formContainerStyle = {
    backgroundImage: `url('https://imgur.com/00i6Iv3.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  if (submitted) {
    return (
      <div className="relative rounded-lg shadow-lg overflow-hidden">
        <div className="absolute inset-0" style={formContainerStyle}>
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative p-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Obrigado pelo seu interesse!
          </h2>
          <p className="text-gray-300">
            Em breve entraremos em contato para mais informações sobre o Kihap Academy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg shadow-lg overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0" style={formContainerStyle}>
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative p-8">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Faça parte do Kihap Academy
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Preencha o formulário abaixo e inicie sua jornada de desenvolvimento profissional e pessoal
        </p>
        <div className="max-w-md mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-lg">
          <LeadForm 
            onSubmit={handleSubmit} 
            buttonText="Quero fazer parte do Academy"
            darkMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademyLeadForm;
