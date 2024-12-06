import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainHeader from './MainHeader';
import Footer from './Footer';

interface SubUnitData {
  name: string;
  cityName: string;
  state: string;
  heroImage: string;
  address: string;
  phone: string;
  whatsapp: string;
  maps: string;
  programImages: {
    title: string;
    image: string;
  }[];
}

const subUnitData: Record<string, SubUnitData> = {
  'lago-sul': {
    name: 'Lago Sul',
    cityName: 'Brasília',
    state: 'DF',
    heroImage: 'https://images.pexels.com/photos/29471958/pexels-photo-29471958.jpeg',
    address: 'SHIS QI 11 Bloco O, Sala 108, Lago Sul',
    phone: '(61) 99999-9999',
    whatsapp: '5561999999999',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Baby Littles',
        image: 'https://i.imgur.com/N1IaOpl.jpg'
      },
      {
        title: 'Kids',
        image: 'https://i.imgur.com/TuOrswr.jpg'
      },
      {
        title: 'Adultos',
        image: 'https://kihap.com.br/wp-content/uploads/2021/12/kihap-adolescentes-e-adultos.jpg'
      }
    ]
  },
  'asa-sul': {
    name: 'Asa Sul',
    cityName: 'Brasília',
    state: 'DF',
    heroImage: 'https://images.pexels.com/photos/29471958/pexels-photo-29471958.jpeg',
    address: 'SGAS 915, Bloco C, Sala 201, Asa Sul',
    phone: '(61) 99999-9998',
    whatsapp: '5561999999998',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Littles',
        image: 'https://kihap.com.br/wp-content/uploads/2023/02/littles-kihap-2.jpeg'
      },
      {
        title: 'Adolescentes',
        image: 'https://i.imgur.com/nNaAx6f.jpg'
      },
      {
        title: 'Família',
        image: 'https://i.imgur.com/x7Yj2rj.jpg'
      }
    ]
  },
  'sudoeste': {
    name: 'Sudoeste',
    cityName: 'Brasília',
    state: 'DF',
    heroImage: 'https://images.pexels.com/photos/29471958/pexels-photo-29471958.jpeg',
    address: 'CLSW 300, Bloco B, Loja 164, Sudoeste',
    phone: '(61) 99999-9997',
    whatsapp: '5561999999997',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.5389324841837!2d-47.8821246!3d-15.7989873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzU2LjQiUyA0N8KwNTInNTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Kids',
        image: 'https://i.imgur.com/TuOrswr.jpg'
      },
      {
        title: 'Mulheres',
        image: 'https://i.imgur.com/frJfdib.jpg'
      },
      {
        title: 'Adultos',
        image: 'https://kihap.com.br/wp-content/uploads/2021/12/kihap-adolescentes-e-adultos.jpg'
      }
    ]
  },
  'centro-floripa': {
    name: 'Centro',
    cityName: 'Florianópolis',
    state: 'SC',
    heroImage: 'https://images.pexels.com/photos/18090774/pexels-photo-18090774.jpeg',
    address: 'Rua Felipe Schmidt, 515, Centro',
    phone: '(48) 99999-9999',
    whatsapp: '5548999999999',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Kids',
        image: 'https://i.imgur.com/TuOrswr.jpg'
      },
      {
        title: 'Mulheres',
        image: 'https://i.imgur.com/frJfdib.jpg'
      },
      {
        title: 'Adultos',
        image: 'https://kihap.com.br/wp-content/uploads/2021/12/kihap-adolescentes-e-adultos.jpg'
      }
    ]
  },
  'santa-monica': {
    name: 'Santa Mônica',
    cityName: 'Florianópolis',
    state: 'SC',
    heroImage: 'https://images.pexels.com/photos/18090774/pexels-photo-18090774.jpeg',
    address: 'Rua João Pio Duarte Silva, 404, Santa Mônica',
    phone: '(48) 99999-9998',
    whatsapp: '5548999999998',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Baby Littles',
        image: 'https://i.imgur.com/N1IaOpl.jpg'
      },
      {
        title: 'Littles',
        image: 'https://kihap.com.br/wp-content/uploads/2023/02/littles-kihap-2.jpeg'
      },
      {
        title: 'Família',
        image: 'https://i.imgur.com/x7Yj2rj.jpg'
      }
    ]
  },
  'coqueiros': {
    name: 'Coqueiros',
    cityName: 'Florianópolis',
    state: 'SC',
    heroImage: 'https://images.pexels.com/photos/18090774/pexels-photo-18090774.jpeg',
    address: 'Rua Desembargador Pedro Silva, 2958, Coqueiros',
    phone: '(48) 99999-9997',
    whatsapp: '5548999999997',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9789184906876!2d-48.5494156!3d-27.5969136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzQ4LjkiUyA0OMKwMzInNTcuOSJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Adolescentes',
        image: 'https://i.imgur.com/nNaAx6f.jpg'
      },
      {
        title: 'Adultos',
        image: 'https://kihap.com.br/wp-content/uploads/2021/12/kihap-adolescentes-e-adultos.jpg'
      },
      {
        title: 'Mulheres',
        image: 'https://i.imgur.com/frJfdib.jpg'
      }
    ]
  },
  'dourados': {
    name: 'Dourados',
    cityName: 'Dourados',
    state: 'MS',
    heroImage: 'https://i.imgur.com/L5zr9gT.jpg',
    address: 'Rua Principal, 123, Centro',
    phone: '(67) 99999-9999',
    whatsapp: '5567999999999',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.987456321098!2d-54.8067891!3d-22.2234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDEzJzI0LjQiUyA1NMKwNDgnMjQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1629899012345!5m2!1spt-BR!2sbr',
    programImages: [
      {
        title: 'Kids',
        image: 'https://i.imgur.com/TuOrswr.jpg'
      },
      {
        title: 'Adolescentes',
        image: 'https://i.imgur.com/nNaAx6f.jpg'
      },
      {
        title: 'Família',
        image: 'https://i.imgur.com/x7Yj2rj.jpg'
      }
    ]
  }
};

export default function SubUnitLanding() {
  const { subunit } = useParams<{ subunit: string }>();
  const { pathname } = useLocation();
  const data = subunit ? subUnitData[subunit] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!data) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário
  };

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
                Kihap {data.name} - {data.cityName}/{data.state}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Transforme sua vida através da arte marcial
              </p>
              <div className="flex gap-4">
                <a
                  href="#contact"
                  className="inline-block bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Agende uma experiência
                </a>
                <a
                  href={`https://wa.me/${data.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nossos Programas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.programImages.map((program, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={program.image}
                    alt={program.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Localização</h2>
                <div className="space-y-4 text-gray-600">
                  <p><strong>Endereço:</strong> {data.address}</p>
                  <p><strong>Telefone:</strong> {data.phone}</p>
                </div>
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden">
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
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Agende sua Experiência</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Agendar Experiência
                  </button>
                  <a
                    href={`https://wa.me/${data.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors text-center"
                  >
                    WhatsApp
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
