import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import MainHeader from './MainHeader';
import Footer from './Footer';

interface Location {
  name: string;
  address: string;
  phone: string;
  maps: string;
  slug?: string;
  photo: string;
}

interface LocationData {
  name: string;
  state?: string;
  heroImage: string;
  description?: string;
  address?: string;
  phone?: string;
  maps?: string;
  photo?: string;
  locations?: Location[];
  features?: string[];
}

const locationData: Record<string, LocationData> = {
  brasilia: {
    name: 'Brasília',
    state: 'DF',
    heroImage: 'https://images.pexels.com/photos/29471958/pexels-photo-29471958.jpeg',
    locations: [
      {
        name: 'Lago Sul',
        address: 'SHIS QI 11 Bloco O, Sala 108, Lago Sul',
        phone: '(61) 99999-9999',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'lago-sul',
        photo: 'https://images.pexels.com/photos/3622613/pexels-photo-3622613.jpeg'
      },
      {
        name: 'Asa Sul',
        address: 'SGAS 915, Bloco C, Sala 201, Asa Sul',
        phone: '(61) 99999-9998',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'asa-sul',
        photo: 'https://images.pexels.com/photos/3622615/pexels-photo-3622615.jpeg'
      },
      {
        name: 'Sudoeste',
        address: 'CLSW 300, Bloco B, Loja 164, Sudoeste',
        phone: '(61) 99999-9997',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'sudoeste',
        photo: 'https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg'
      },
      {
        name: 'Jardim Botânico',
        address: 'Av. das Paineiras, Quadra 3, Lote 5, Jardim Botânico',
        phone: '(61) 99999-9996',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'jardim-botanico',
        photo: 'https://images.pexels.com/photos/3622619/pexels-photo-3622619.jpeg'
      },
      {
        name: 'Noroeste',
        address: 'CLNW 10/11, Bloco A, Loja 3, Noroeste',
        phone: '(61) 99999-9995',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'noroeste',
        photo: 'https://images.pexels.com/photos/3622621/pexels-photo-3622621.jpeg'
      }
    ]
  },
  florianopolis: {
    name: 'Florianópolis',
    state: 'SC',
    heroImage: 'https://images.pexels.com/photos/18090774/pexels-photo-18090774.jpeg',
    locations: [
      {
        name: 'Centro',
        address: 'Rua Felipe Schmidt, 515, Centro',
        phone: '(48) 99999-9999',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'centro-floripa',
        photo: 'https://images.pexels.com/photos/3622625/pexels-photo-3622625.jpeg'
      },
      {
        name: 'Santa Mônica',
        address: 'Rua João Pio Duarte Silva, 404, Santa Mônica',
        phone: '(48) 99999-9998',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'santa-monica',
        photo: 'https://images.pexels.com/photos/3622626/pexels-photo-3622626.jpeg'
      },
      {
        name: 'Coqueiros',
        address: 'Rua Desembargador Pedro Silva, 2958, Coqueiros',
        phone: '(48) 99999-9997',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
        slug: 'coqueiros',
        photo: 'https://images.pexels.com/photos/3622627/pexels-photo-3622627.jpeg'
      }
    ]
  },
  dourados: {
    name: 'Dourados',
    state: 'MS',
    heroImage: 'https://i.imgur.com/L5zr9gT.jpg',
    address: 'Rua Principal, 123, Centro',
    phone: '(67) 99999-9999',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.987456321098!2d-54.8067891!3d-22.2234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDEzJzI0LjQiUyA1NMKwNDgnMjQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    photo: 'https://images.pexels.com/photos/3622630/pexels-photo-3622630.jpeg'
  },
  online: {
    name: 'Tatame Online',
    heroImage: 'https://kihap.com.br/wp-content/uploads/2021/12/kihap-mulheres.png',
    description: 'Treine de onde estiver com nossos instrutores experientes através de nossa plataforma exclusiva.',
    features: [
      'Aulas ao vivo e gravadas',
      'Acompanhamento personalizado',
      'Flexibilidade de horários',
      'Acesso a conteúdo exclusivo',
      'Comunidade online ativa'
    ]
  }
};

export default function LocationLanding() {
  const { location } = useParams<{ location: string }>();
  const { pathname } = useLocation();
  const data = location ? locationData[location] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section 
          className="h-screen relative flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(48, 48, 48, 0.6), rgba(48, 48, 48, 0.6)), url(${data.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                {data.name} {data.state && `- ${data.state}`}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Transforme sua vida através da arte marcial
              </p>
              <a
                href="#contact"
                className="inline-block bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Agende uma experiência
              </a>
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {(location === 'florianopolis' || location === 'brasilia') && data.locations ? (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossas Unidades em {data.name}</h2>
                  {data.locations.map((loc: Location, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-b border-gray-200 last:border-0">
                      <div>
                        <Link 
                          to={`/subunidade/${loc.slug}`}
                          className="inline-block hover:text-[#dfa129] transition-colors"
                        >
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">Unidade {loc.name}</h3>
                        </Link>
                        <div className="space-y-4 text-gray-600">
                          <p><strong>Endereço:</strong> {loc.address}</p>
                          <p><strong>Telefone:</strong> {loc.phone}</p>
                          <Link 
                            to={`/subunidade/${loc.slug}`}
                            className="inline-block mt-4 text-[#dfa129] hover:text-opacity-80 transition-colors"
                          >
                            Ver mais detalhes →
                          </Link>
                        </div>
                        {/* Foto da Fachada */}
                        <div className="mt-6">
                          <img 
                            src={loc.photo} 
                            alt={`Fachada da unidade ${loc.name}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                      {loc.maps && (
                        <div className="h-[300px] rounded-lg overflow-hidden">
                          <iframe
                            src={loc.maps}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Mapa da unidade ${loc.name}`}
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Tatame Online</h2>
                    <div className="space-y-6 text-gray-600">
                      <p className="text-lg">{data.description}</p>
                      
                      {location === 'online' && data.features && (
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefícios do Tatame Online</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {data.features.map((feature: string, index: number) => (
                              <div 
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-2 h-2 bg-[#dfa129] rounded-full"></div>
                                </div>
                                <p className="text-gray-700">{feature}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8">
                        <a
                          href="#contact"
                          className="inline-block bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                          Comece Agora
                        </a>
                      </div>
                    </div>
                  </div>
                  {data.maps && (
                    <div className="h-[400px] rounded-lg overflow-hidden mt-8">
                      <iframe
                        src={data.maps}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa da unidade ${data.name}`}
                      ></iframe>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Agende sua Experiência</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">Nome completo</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-[#dfa129] focus:ring-1 focus:ring-[#dfa129]"
                    required
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-[#dfa129] focus:ring-1 focus:ring-[#dfa129]"
                    required
                    placeholder="Digite seu email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-[#dfa129] focus:ring-1 focus:ring-[#dfa129]"
                    required
                    placeholder="Digite seu telefone"
                  />
                </div>
                {(location === 'florianopolis' || location === 'brasilia') && data.locations && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="unidade">Unidade de Interesse</label>
                    <select
                      id="unidade"
                      name="unidade"
                      className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-[#dfa129] focus:ring-1 focus:ring-[#dfa129]"
                      required
                    >
                      <option value="">Selecione uma unidade</option>
                      {data.locations.map((loc: Location, index: number) => (
                        <option key={index} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Agendar Experiência
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
