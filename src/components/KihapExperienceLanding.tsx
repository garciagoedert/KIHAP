import React from 'react';
import Footer from './Footer';
import MainHeader from './MainHeader';
import { Link } from 'react-router-dom';

const KihapExperienceLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <MainHeader />
      {/* Hero Section */}
      <div className="relative h-screen mt-20">
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute w-[100vw] h-[100vh] scale-[1.5] -translate-y-1/4 object-cover"
            style={{ pointerEvents: 'none' }}
            src="https://www.youtube.com/embed/ttHQfiRZnQU?autoplay=1&mute=1&controls=0&loop=1&playlist=ttHQfiRZnQU&showinfo=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <img 
            src="https://kihap.com.br/wp-content/uploads/2023/04/kihap-experience-2023-logo-1536x438.png"
            alt="Kihap Experience 2024"
            className="w-full max-w-2xl mx-auto mb-8 animate-fade-in"
          />
          <p className="text-xl md:text-2xl text-center mb-6 max-w-3xl font-light">
            O maior evento anual de artes marciais do Brasil
          </p>
          <p className="text-lg md:text-xl text-center mb-12 max-w-3xl font-light text-gray-300">
            3 dias intensos no luxuoso Costão do Santinho Resort em Florianópolis
          </p>
          <Link
            to="/cadastro"
            className="bg-[#dfa129] hover:bg-[#c78b1f] text-white font-bold py-5 px-12 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Comece Sua Jornada
          </Link>
        </div>
      </div>

      {/* Sobre o Evento */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-white mb-16 animate-fade-in">
            O Maior Evento de Artes Marciais do Brasil
          </h2>
          <div className="max-w-4xl mx-auto text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              O Kihap Experience é o maior evento anual de artes marciais do Brasil, reunindo 
              os maiores mestres e praticantes em uma experiência única de 3 dias no luxuoso 
              Costão do Santinho Resort, em Florianópolis.
            </p>
            <p className="text-lg">
              Durante 3 dias intensos, você terá:
            </p>
            <ul className="list-disc list-inside space-y-4 pl-4">
              <li>Hospedagem all-inclusive em resort 5 estrelas</li>
              <li>Treinamentos intensivos com mestres renomados</li>
              <li>Palestras e workshops inspiradores</li>
              <li>Networking com praticantes de todo o Brasil</li>
              <li>Momentos únicos de confraternização e lazer</li>
              <li>Experiência gastronômica internacional</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resort Section */}
      <section className="py-32 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-white mb-16 animate-fade-in">
            Costão do Santinho Resort
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            <div className="text-gray-300 space-y-8">
              <p className="text-lg">
                O Costão do Santinho é um dos mais premiados resorts do Brasil, localizado em uma 
                área preservada de Florianópolis, Santa Catarina. Com uma estrutura 5 estrelas, oferece:
              </p>
              <ul className="list-disc list-inside space-y-4 pl-4">
                <li>Suítes luxuosas com vista panorâmica para o mar</li>
                <li>Gastronomia internacional all-inclusive 24h</li>
                <li>Spa de luxo e área de lazer completa</li>
                <li>Praia privativa com 750m de extensão</li>
                <li>Piscinas, academia e quadras esportivas</li>
                <li>Centro de eventos com estrutura completa</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl w-full transform hover:scale-[1.02] transition-all duration-300">
              <div className="relative pt-[65%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full scale-105"
                  src="https://www.youtube.com/embed/AFl91bi_dq0?autoplay=1&mute=1&loop=1&playlist=AFl91bi_dq0&showinfo=0"
                  title="Costão do Santinho Resort"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ pointerEvents: 'none' }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Por que escolher o Kihap Experience?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center text-white">
              <div className="bg-[#dfa129] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Comunidade Exclusiva</h3>
              <p className="text-gray-300">
                Faça parte de uma comunidade dedicada ao crescimento pessoal através das artes marciais
              </p>
            </div>
            <div className="text-center text-white">
              <div className="bg-[#dfa129] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Excelência Técnica</h3>
              <p className="text-gray-300">
                Aprenda com mestres experientes e metodologia comprovada
              </p>
            </div>
            <div className="text-center text-white">
              <div className="bg-[#dfa129] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Desenvolvimento Integral</h3>
              <p className="text-gray-300">
                Transforme corpo e mente através de treinamento holístico
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in">
            Comece Sua Jornada Hoje
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Não espere mais para transformar sua vida. Junte-se ao Kihap Experience e descubra seu verdadeiro potencial.
          </p>
          <Link
            to="/cadastro"
            className="inline-block bg-[#dfa129] hover:bg-[#c78b1f] text-white font-bold py-6 px-16 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Garanta Sua Vaga
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KihapExperienceLanding;
