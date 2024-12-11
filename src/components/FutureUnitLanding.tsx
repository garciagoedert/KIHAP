import React from 'react';
import MainHeader from './MainHeader';
import Footer from './Footer';
import FutureUnitLeadForm from './FutureUnitLeadForm';
import { CreateLeadInput } from '../types/supabase';

export default function FutureUnitLanding() {
  const handleLeadSubmit = async (lead: CreateLeadInput) => {
    // Implementar lógica de submissão
    console.log('Novo lead:', lead);
  };

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=80")'
            }}
          ></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">A KIHAP está chegando até você!</h1>
              <p className="text-xl mb-8">
                Seja um dos primeiros a fazer parte da nossa comunidade na sua região. Garanta sua vaga com condições especiais de pré-matrícula.
              </p>
              <a href="#form" className="bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-colors inline-block">
                Quero garantir minha vaga
              </a>
            </div>
          </div>
        </section>

        {/* Benefícios Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Por que escolher a KIHAP?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Metodologia Exclusiva</h3>
                <p className="text-gray-600 text-center">
                  Sistema de ensino próprio que combina tradição e inovação para um aprendizado mais efetivo e envolvente
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Comunidade Engajada</h3>
                <p className="text-gray-600 text-center">
                  Faça parte de uma comunidade que compartilha valores, experiências e busca crescimento pessoal constante
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Estrutura Moderna</h3>
                <p className="text-gray-600 text-center">
                  Ambientes planejados e equipados com o que há de mais moderno para proporcionar a melhor experiência de treino
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">O que dizem nossos alunos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80" 
                    alt="Aluno praticando" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <blockquote className="text-gray-600 italic">
                    "A KIHAP mudou minha vida. Além do desenvolvimento físico, encontrei uma comunidade incrível e fiz amizades para a vida toda."
                  </blockquote>
                  <p className="text-gray-800 font-semibold mt-2">- Maria Silva</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80" 
                    alt="Aluno praticando" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <blockquote className="text-gray-600 italic">
                    "O método de ensino da KIHAP é único. Em poucos meses, já percebi uma grande evolução na minha técnica e condicionamento."
                  </blockquote>
                  <p className="text-gray-800 font-semibold mt-2">- João Santos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário Section */}
        <section id="form" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-4">Garanta sua vaga com condições especiais</h2>
              <p className="text-gray-600 text-center mb-8">
                Faça sua pré-matrícula agora e aproveite benefícios exclusivos quando a unidade for inaugurada na sua região
              </p>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <FutureUnitLeadForm 
                  onSubmit={handleLeadSubmit}
                  buttonText="Fazer Pré-matrícula"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciais Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Benefícios exclusivos para pré-matrícula</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-[#dfa129] mb-2">30%</div>
                <div className="text-gray-600">Desconto na matrícula</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-[#dfa129] mb-2">1º</div>
                <div className="text-gray-600">Mês gratuito</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-[#dfa129] mb-2">Kit</div>
                <div className="text-gray-600">Uniforme grátis</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-[#dfa129] mb-2">VIP</div>
                <div className="text-gray-600">Acesso prioritário</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
