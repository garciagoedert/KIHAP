import React from 'react';
import Footer from './Footer';
import MainHeader from './MainHeader';
import AcademyLeadForm from './AcademyLeadForm';

const KihapAcademy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="relative bg-[#303030] text-white min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://imgur.com/bh6pyDC.png')`,
            backgroundPosition: 'center 25%'
          }}
        >
          {/* Overlay com gradiente para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="https://imgur.com/DOSZQbH.png" 
                alt="Logo Kihap Academy" 
                className="w-32 md:w-40 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Kihap Academy</h1>
            <div className="w-24 h-1 bg-[#dfa129] mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Desenvolvimento profissional e pessoal através dos três pilares
            </p>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#1a1a1a"/>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Sobre o Programa */}
        <section className="mb-16">
          <div className="bg-[#303030] rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">O Programa</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-300">
                O Kihap Academy é um programa exclusivo de desenvolvimento profissional e pessoal, 
                com aulas semanais de 1h30 de duração.
              </p>
              <p className="mb-4 text-gray-300">
                Nossa metodologia é baseada em três pilares fundamentais: Cultura, Processos e Tatame, 
                proporcionando uma formação completa e integrada.
              </p>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="mb-16">
          <div className="bg-[#303030] rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-white mb-8">Benefícios Exclusivos</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#262626] p-6 rounded-lg hover:shadow-md transition-shadow border border-[#404040]">
                <h3 className="text-2xl font-semibold text-white mb-4">Synergy Camp</h3>
                <p className="text-gray-300">
                  Acesso exclusivo ao Synergy Camp, uma experiência única de desenvolvimento e networking.
                </p>
              </div>
              <div className="bg-[#262626] p-6 rounded-lg hover:shadow-md transition-shadow border border-[#404040]">
                <h3 className="text-2xl font-semibold text-white mb-4">Elenco KIHAP</h3>
                <p className="text-gray-300">
                  Oportunidade de integrar o elenco KIHAP e fazer parte de uma equipe de alta performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Desenvolvimento */}
        <section className="mb-16">
          <div className="bg-[#303030] rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-white mb-8">Desenvolvimento Integral</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-300">
                No Kihap Academy, focamos no desenvolvimento profissional e pessoal dos nossos alunos, 
                proporcionando uma formação completa que vai além das técnicas convencionais.
              </p>
              <p className="mb-4 text-gray-300">
                Através da integração dos três pilares - Cultura, Processos e Tatame - criamos um ambiente 
                de aprendizado único, onde cada participante pode desenvolver seu potencial máximo.
              </p>
            </div>
          </div>
        </section>

        {/* Formulário de Inscrição */}
        <section className="mb-16">
          <AcademyLeadForm />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default KihapAcademy;
