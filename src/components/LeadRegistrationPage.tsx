import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainHeader from './MainHeader';
import Footer from './Footer';
import LeadForm from './LeadForm';
import { MapPin } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { CreateLeadInput } from '../types/supabase';

const cities = [
  {
    name: 'Florianópolis',
    state: 'SC',
    path: '/unidade/florianopolis',
    image: 'https://images.pexels.com/photos/18090774/pexels-photo-18090774.jpeg',
    unitsCount: 3
  },
  {
    name: 'Brasília',
    state: 'DF',
    path: '/unidade/brasilia',
    image: 'https://images.pexels.com/photos/29471958/pexels-photo-29471958.jpeg',
    unitsCount: 3
  },
  {
    name: 'Dourados',
    state: 'MS',
    path: '/unidade/dourados',
    image: 'https://i.imgur.com/L5zr9gT.jpg',
    unitsCount: 1
  }
];

const testimonials = [
  {
    id: 1,
    name: "João Silva",
    city: "Florianópolis",
    video: "https://www.youtube.com/embed/VIDEO_ID_1",
    text: "A Kihap mudou minha vida..."
  },
  {
    id: 2,
    name: "Maria Santos",
    city: "Brasília",
    video: "https://www.youtube.com/embed/VIDEO_ID_2",
    text: "Meus filhos adoram as aulas..."
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    city: "Dourados",
    video: "https://www.youtube.com/embed/VIDEO_ID_3",
    text: "Melhor decisão que tomei..."
  }
];

export default function LeadRegistrationPage() {
  const { pathname } = useLocation();
  const { addLead } = useDataStore();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleSubmit = async (formData: CreateLeadInput) => {
    try {
      setError(null);
      await addLead(formData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Erro ao adicionar lead:', err);
      setError('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
      throw err; // Re-throw para que o LeadForm possa lidar com o estado de submissão
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MainHeader />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Obrigado pelo interesse!</h2>
              <p className="text-gray-600 mb-8">
                Em breve um de nossos professores entrará em contato para agendar sua aula experimental.
              </p>
              <Link
                to="/"
                className="inline-block bg-[#dfa129] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-20 md:py-32"
          style={{
            backgroundImage: 'linear-gradient(rgba(48, 48, 48, 0.9), rgba(48, 48, 48, 0.9)), url(https://kihap.com.br/wp-content/uploads/2022/06/kihap-familia-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text */}
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-6">
                    Transforme sua vida através da arte marcial
                  </h1>
                  <p className="text-xl text-gray-300 mb-8">
                    Agende sua aula experimental gratuita e descubra como a arte marcial pode transformar sua vida.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#dfa129] rounded-full"></span>
                      <span>Desenvolvimento físico e mental</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#dfa129] rounded-full"></span>
                      <span>Autoconfiança e disciplina</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#dfa129] rounded-full"></span>
                      <span>Metodologia exclusiva</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column - Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Agende sua Experiência
                  </h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  <LeadForm onSubmit={handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Por que escolher a KIHAP?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Metodologia Exclusiva</h3>
                <p className="text-gray-600">
                  Sistema de ensino desenvolvido para maximizar seu aprendizado e desenvolvimento.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Instrutores Qualificados</h3>
                <p className="text-gray-600">
                  Equipe altamente treinada e comprometida com seu desenvolvimento.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#dfa129] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ambiente Acolhedor</h3>
                <p className="text-gray-600">
                  Espaço preparado para proporcionar a melhor experiência de treino.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Depoimentos dos Nossos Alunos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={testimonial.video}
                      title={`Depoimento de ${testimonial.name}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{testimonial.city}</p>
                    <p className="text-gray-700">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Masters Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Master Cavenatti */}
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="https://kihap.com.br/wp-content/uploads/2021/12/master-cavenatti.jpg"
                    alt="Master Cavenatti"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Master Cavenatti</h3>
                  <p className="text-gray-700">
                    "Na KIHAP, acreditamos que cada pessoa tem um potencial único que pode ser desenvolvido 
                    através da disciplina positiva e da prática constante das artes marciais. Nossa missão 
                    é ajudar nossos alunos a descobrirem e desenvolverem esse potencial, transformando 
                    suas vidas através dos valores e ensinamentos do Taekwondo."
                  </p>
                </div>
              </div>

              {/* Professora Cavenatti */}
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="https://kihap.com.br/wp-content/uploads/2021/12/professora-cavenatti.jpg"
                    alt="Professora Cavenatti"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Professora Cavenatti</h3>
                  <p className="text-gray-700">
                    "O Taekwondo vai muito além de uma arte marcial. É uma ferramenta poderosa de 
                    transformação que trabalha corpo e mente de forma integrada. Na KIHAP, nos dedicamos 
                    a criar um ambiente acolhedor onde cada aluno possa se desenvolver no seu próprio 
                    ritmo, sempre com suporte e orientação personalizada."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Nossas Unidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {cities.map((city, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Image with gradient overlay */}
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
                    <img 
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-[#dfa129]" />
                      <div>
                        <h3 className="text-xl font-bold">
                          {city.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {city.state} • {city.unitsCount} {city.unitsCount === 1 ? 'unidade' : 'unidades'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
