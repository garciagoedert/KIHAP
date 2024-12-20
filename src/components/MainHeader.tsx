import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ScrollToTopLink from './ScrollToTopLink';

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmenuToggle = (menu: 'programs' | 'units') => {
    if (menu === 'programs') {
      setIsProgramsOpen(!isProgramsOpen);
      setIsUnitsOpen(false);
    } else {
      setIsUnitsOpen(!isUnitsOpen);
      setIsProgramsOpen(false);
    }
  };

  const isHomePage = location.pathname === '/';
  const useTransparentBg = isHomePage && !isScrolled;
  const submenuLinkClasses = "block text-gray-300 hover:text-white transition-all duration-300 text-base py-3 px-4 rounded-lg hover:bg-gray-700/50 active:bg-gray-700 mb-1";

  const programsItems = [
    { label: 'Baby Littles', path: '/programa/baby-littles' },
    { label: 'Littles', path: '/programa/littles' },
    { label: 'Kids', path: '/programa/kids' },
    { label: 'Adolescentes', path: '/programa/adolescentes' },
    { label: 'Adultos', path: '/programa/adultos' },
    { label: 'Família', path: '/programa/familia' },
    { label: 'Mulheres', path: '/programa/mulheres' },
    { label: 'Online', path: '/programa/online' }
  ];

  const unitsItems = [
    { label: 'Brasília - DF', path: '/unidade/brasilia' },
    { label: 'Florianópolis - SC', path: '/unidade/florianopolis' },
    { label: 'Dourados - MS', path: '/unidade/dourados' },
    { label: 'Unidade Online', path: '/unidade/online' }
  ];

  const renderMenuButton = () => {
    return (
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative p-3 bg-[#dfa129] hover:bg-[#c78b1f] rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfa129] overflow-hidden group"
        aria-label="Menu principal"
        aria-controls="mobile-menu"
        aria-haspopup="menu"
        data-state={isMenuOpen ? "open" : "closed"}
      >
        <div className="relative w-6 h-6">
          <div 
            className={`absolute top-0 left-0 transition-transform duration-300 ${
              isMenuOpen ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
          >
            <Menu size={24} className="text-white" />
          </div>
          <div 
            className={`absolute top-0 left-0 transition-transform duration-300 ${
              isMenuOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'
            }`}
          >
            <X size={24} className="text-white" />
          </div>
        </div>
        <span className="absolute inset-0 bg-white/30 transform scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300 rounded-lg"></span>
      </button>
    );
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-[100] transition-all duration-300 ${
        useTransparentBg ? 'bg-transparent' : 'bg-[#303030] shadow-lg'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <ScrollToTopLink to="/" className="flex items-center">
              <img 
                src="https://kihap.com.br/wp-content/uploads/2021/02/kihap-wh-1536x359.png" 
                alt="KIHAP Logo" 
                className="h-8 w-auto"
              />
            </ScrollToTopLink>

            {renderMenuButton()}
          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-in-out z-[90] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <nav 
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#303030] shadow-xl transform transition-all duration-500 ease-in-out z-[110] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="p-4 border-b border-gray-700 flex justify-end">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-3 bg-[#dfa129] hover:bg-[#c78b1f] rounded-lg transition-all duration-300 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfa129] group overflow-hidden relative"
            aria-label="Fechar Menu"
          >
            <X size={24} className="text-white relative z-10" />
            <span className="absolute inset-0 bg-white/30 transform scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300 rounded-lg"></span>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)]">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2 px-4">
              <ScrollToTopLink
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </ScrollToTopLink>

              <ScrollToTopLink
                to="/sobre"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </ScrollToTopLink>

              <ScrollToTopLink
                to="/metodologia"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Metodologia
              </ScrollToTopLink>

              <ScrollToTopLink
                to="/kihap-em-acao"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kihap em Ação
              </ScrollToTopLink>

              <ScrollToTopLink
                to="/kihap-academy"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kihap Academy
              </ScrollToTopLink>

              {/* Programs Dropdown */}
              <div className="border-t border-gray-700 pt-4 mb-2">
                <button
                  onClick={() => handleSubmenuToggle('programs')}
                  className="relative w-full flex items-center justify-between text-white hover:text-gray-300 transition-all duration-300 text-lg py-3 px-4 rounded-lg hover:bg-gray-700/50 group overflow-hidden"
                  aria-label={`${isProgramsOpen ? 'Fechar' : 'Abrir'} menu de programas`}
                  data-state={isProgramsOpen ? "open" : "closed"}
                >
                  <span>Programas</span>
                  <div 
                    className="transition-transform duration-300 transform group-hover:scale-110" 
                    style={{ transform: `rotate(${isProgramsOpen ? 180 : 0}deg)` }}
                  >
                    <ChevronDown size={24} />
                  </div>
                  <span className="absolute inset-0 bg-white/10 transform scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300 rounded-lg"></span>
                </button>
                
                <div 
                  id="programs-menu"
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isProgramsOpen ? `${programsItems.length * 60}px` : '0px',
                    opacity: isProgramsOpen ? 1 : 0,
                    transform: `translateY(${isProgramsOpen ? 0 : -8}px)`
                  }}
                >
                  <div className="pl-4 border-l-2 border-gray-700 mt-2">
                    {programsItems.map((item, index) => (
                      <ScrollToTopLink
                        key={index}
                        to={item.path}
                        className={submenuLinkClasses}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </ScrollToTopLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Units Dropdown */}
              <div className="border-t border-gray-700 pt-4 mb-2">
                <button
                  onClick={() => handleSubmenuToggle('units')}
                  className="relative w-full flex items-center justify-between text-white hover:text-gray-300 transition-all duration-300 text-lg py-3 px-4 rounded-lg hover:bg-gray-700/50 group overflow-hidden"
                  aria-label={`${isUnitsOpen ? 'Fechar' : 'Abrir'} menu de unidades`}
                  data-state={isUnitsOpen ? "open" : "closed"}
                >
                  <span>Unidades</span>
                  <div 
                    className="transition-transform duration-300 transform group-hover:scale-110" 
                    style={{ transform: `rotate(${isUnitsOpen ? 180 : 0}deg)` }}
                  >
                    <ChevronDown size={24} />
                  </div>
                  <span className="absolute inset-0 bg-white/10 transform scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300 rounded-lg"></span>
                </button>
                
                <div 
                  id="units-menu"
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isUnitsOpen ? `${unitsItems.length * 60}px` : '0px',
                    opacity: isUnitsOpen ? 1 : 0,
                    transform: `translateY(${isUnitsOpen ? 0 : -8}px)`
                  }}
                >
                  <div className="pl-4 border-l-2 border-gray-700 mt-2">
                    {unitsItems.map((item, index) => (
                      <ScrollToTopLink
                        key={index}
                        to={item.path}
                        className={submenuLinkClasses}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </ScrollToTopLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-gray-700">
            <ScrollToTopLink
              to="/portal"
              className="block w-full bg-[#dfa129] text-white px-6 py-3 rounded-lg hover:bg-[#c78b1f] transition-all duration-300 text-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfa129] relative group overflow-hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10">Área do Aluno</span>
              <span className="absolute inset-0 bg-white/30 transform scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300 rounded-lg"></span>
            </ScrollToTopLink>
          </div>
        </div>
      </nav>
    </>
  );
}
